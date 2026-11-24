from concurrent.futures import ThreadPoolExecutor, as_completed
import datetime
import json
import time
import requests

API_KEY = "3fc9a599ce632eacdf94e9382a49da27"
BASE_URL = "https://api.themoviedb.org/3"

# قوالب سيرفرات التشغيل (عدّلها أو أضف سيرفراتك حسب الحاجة)
# {type} ستكون movie أو tv ، و {id} هو معرف العمل في TMDB
STREAM_SERVERS = [
    {
        "name": "سيرفر 1",
        "url": "https://vidsrc.to/embed/{type}/{id}",
    },
    {
        "name": "سيرفر 2",
        "url": "https://vidsrc.me/embed/{type}/{id}",
    },
    {
        "name": "سيرفر 3",
        "url": "https://player.autoembed.cc/embed/{type}/{id}",
    },
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

GENRES_MAP = {
    28: "أكشن",
    12: "مغامرة",
    16: "أنمي وكرتون",
    35: "كوميديا",
    80: "جريمة",
    18: "دراما",
    10751: "عائلي",
    14: "فانتازيا",
    27: "رعب",
    10749: "رومانسي",
    878: "خيال علمي",
    53: "إثارة",
    10759: "أكشن ومغامرة",
    10765: "خيال علمي وفانتازيا",
}


def determine_section(item, media_type):
  lang = item.get("original_language", "")
  genres = item.get("genre_ids", [])

  if 16 in genres and lang == "ja":
    return "أنمي"
  if 16 in genres:
    return "أفلام ومسلسلات كرتون"

  if media_type == "movie":
    if lang == "ar":
      return "أفلام عربية"
    if lang == "tr":
      return "أفلام تركية"
    if lang == "ko":
      return "أفلام كورية"
    return "أفلام أجنبية"
  else:
    if lang == "ar":
      return "مسلسلات عربية"
    if lang == "tr":
      return "مسلسلات تركية"
    if lang == "ko":
      return "مسلسلات كورية"
    return "مسلسلات أجنبية"


def build_candidate_streams(media_type, tmdb_id):
  streams = []
  for srv in STREAM_SERVERS:
    streams.append({
        "server": srv["name"],
        "url": srv["url"].format(type=media_type, id=tmdb_id),
    })
  return streams


def is_stream_working(url, timeout=6):
  """يفحص إذا كان رابط السيرفر يستجيب ولا يعطي خطأ."""
  try:
    resp = requests.head(
        url, headers=HEADERS, timeout=timeout, allow_redirects=True
    )
    # بعض السيرفرات لا تدعم HEAD وترجع 405 أو 403، فنجرب GET خفيف
    if resp.status_code in (405, 403, 400):
      resp = requests.get(
          url, headers=HEADERS, timeout=timeout, allow_redirects=True, stream=True
      )
      resp.close()

    # نعتبر الرابط متاحاً إذا كانت الحالة 200
    return resp.status_code == 200
  except requests.RequestException:
    return False


def verify_and_filter_entry(entry):
  """يفحص سيرفرات العمل؛ إذا لم يعمل أي سيرفر يُرجع None ليتم حذفه."""
  candidates = build_candidate_streams(entry["type"], entry["id"])
  working_streams = []

  for stream in candidates:
    if is_stream_working(stream["url"]):
      working_streams.append(stream)

  if not working_streams:
    return None

  entry["streams"] = working_streams
  entry["stream_url"] = working_streams[0]["url"]
  return entry


def fetch_content(media_type, language=None, pages=5):
  results = []
  endpoint = f"{BASE_URL}/discover/{media_type}"

  for page in range(1, pages + 1):
    params = {
        "api_key": API_KEY,
        "language": "ar-SA",
        "sort_by": "popularity.desc",
        "page": page,
    }
    if language:
      params["with_original_language"] = language

    try:
      response = requests.get(endpoint, params=params, timeout=10)
      if response.status_code == 200:
        data = response.json().get("results", [])
        for item in data:
          if not item.get("poster_path"):
            continue

          section = determine_section(item, media_type)
          genre_names = [
              GENRES_MAP.get(g, "منوع") for g in item.get("genre_ids", [])
          ]

          orig_title = (
              item.get("original_title") or item.get("original_name") or ""
          )
          ar_title = item.get("title") or item.get("name") or ""

          if ar_title and ar_title != orig_title:
            final_title = f"{orig_title} ({ar_title})"
          else:
            final_title = orig_title if orig_title else ar_title

          entry = {
              "id": item["id"],
              "type": media_type,
              "title": final_title,
              "original_title": orig_title,
              "poster": f"https://image.tmdb.org/t/p/w500{item['poster_path']}",
              "backdrop": (
                  f"https://image.tmdb.org/t/p/original{item['backdrop_path']}"
                  if item.get("backdrop_path")
                  else ""
              ),
              "rating": round(item.get("vote_average", 0), 1),
              "year": (
                  item.get("release_date")
                  or item.get("first_air_date")
                  or "2026"
              )[:4],
              "overview": item.get("overview") or "لا يوجد وصف متوفر حالياً.",
              "section": section,
              "genres": list(set(genre_names)),
              "date": datetime.date.today().isoformat(),
          }
          results.append(entry)
      else:
        print(
            f"⚠️ خطأ من السيرفر (كود {response.status_code}): {response.text}"
        )
        break
    except Exception as e:
      print(f"❌ خطأ في الاتصال بالإنترنت أو TMDB: {e}")
      break

    time.sleep(0.3)
  return results


def main():
  all_media = []

  tasks = [
      ("movie", "en", 10),
      ("tv", "en", 10),
      ("movie", "ar", 3),
      ("tv", "ar", 3),
      ("tv", "tr", 5),
      ("movie", "tr", 2),
      ("tv", "ko", 5),
      ("movie", "ko", 3),
      ("tv", "ja", 6),
  ]

  print(
      "🚀 جاري بدء سحب وتصنيف الأعمال بالأسماء الأصلية مع الترجمة بين"
      " قوسين..."
  )
  for m_type, lang, pages in tasks:
    print(f"⏳ جاري سحب [{m_type}] بلغة [{lang}]...")
    all_media.extend(fetch_content(m_type, lang, pages))

  unique_media = list(
      {f"{item['type']}_{item['id']}": item for item in all_media}.values()
  )
  print(
      f"🔍 تم سحب {len(unique_media)} عمل فريد. جاري فحص السيرفرات وحذف غير"
      " المتوفر..."
  )

  approved_media = []
  removed_count = 0

  # فحص متوازٍ لتسريع العملية
  with ThreadPoolExecutor(max_workers=15) as executor:
    futures = {
        executor.submit(verify_and_filter_entry, item): item
        for item in unique_media
    }
    for future in as_completed(futures):
      valid_item = future.result()
      if valid_item is not None:
        approved_media.append(valid_item)
      else:
        removed_count += 1

  with open("movies.json", "w", encoding="utf-8") as f:
    json.dump(approved_media, f, ensure_ascii=False, indent=2)

  print(
      f"✅ تم الانتهاء بنجاح! تم نشر {len(approved_media)} عمل صالح وحذف"
      f" {removed_count} عمل بدون سيرفرات شغالة."
  )


if __name__ == "__main__":
  main()
