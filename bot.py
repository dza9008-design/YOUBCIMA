from concurrent.futures import ThreadPoolExecutor, as_completed
import datetime
import json
import time
from urllib.parse import quote
import requests

API_KEY = "3fc9a599ce632eacdf94e9382a49da27"
BASE_URL = "https://api.themoviedb.org/3"
DAILYMOTION_API_URL = "https://api.dailymotion.com/videos"
SITE_URL = "https://youbcima.com"

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

# كلمات البحث لجلب الدراما القصيرة من Dailymotion مجاناً
SHORT_DRAMA_QUERIES = [
    "دراما قصيرة مترجمة",
    "مسلسل قصير مترجم",
    "مسلسل قصير مدبلج",
    "DramaBox مترجم",
    "short drama arabic sub",
]


def determine_section(item, media_type, is_short=False):
    if is_short:
        return "دراما قصيرة"

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
    return [
        {
            "server": srv["name"],
            "url": srv["url"].format(type=media_type, id=tmdb_id),
        }
        for srv in STREAM_SERVERS
    ]


def is_stream_working(url, timeout=6):
    try:
        resp = requests.head(
            url, headers=HEADERS, timeout=timeout, allow_redirects=True
        )
        if resp.status_code in (405, 403, 400):
            resp = requests.get(
                url, headers=HEADERS, timeout=timeout, allow_redirects=True, stream=True
            )
            resp.close()
        return resp.status_code == 200
    except requests.RequestException:
        return False


def verify_and_filter_entry(entry):
    # أعمال Dailymotion تملك رابط تضمين جاهز ولا تحتاج فحص سيرفرات TMDB
    if entry.get("source") == "dailymotion" and entry.get("stream_url"):
        return entry

    tmdb_lookup_type = entry.get("tmdb_type") or entry["type"]
    candidates = build_candidate_streams(tmdb_lookup_type, entry["id"])
    working_streams = [s for s in candidates if is_stream_working(s["url"])]

    if not working_streams:
        return None

    entry["streams"] = working_streams
    entry["stream_url"] = working_streams[0]["url"]
    return entry


def fetch_content(
    media_type,
    language=None,
    pages=5,
    sort_by="popularity.desc",
    is_short=False,
    max_runtime=None,
):
    results = []
    endpoint = f"{BASE_URL}/discover/{media_type}"

    for page in range(1, pages + 1):
        params = {
            "api_key": API_KEY,
            "language": "ar-SA",
            "sort_by": sort_by,
            "include_adult": "false",
            "page": page,
        }
        if language:
            params["with_original_language"] = language
        if max_runtime:
            params["with_runtime.lte"] = max_runtime
            params["with_runtime.gte"] = 3

        try:
            response = requests.get(endpoint, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json().get("results", [])
                for item in data:
                    if item.get("adult") is True:
                        continue
                    if not item.get("poster_path"):
                        continue

                    section = determine_section(item, media_type, is_short=is_short)
                    genre_names = [
                        GENRES_MAP.get(g, "منوع") for g in item.get("genre_ids", [])
                    ]
                    if is_short and "دراما قصيرة" not in genre_names:
                        genre_names.append("دراما قصيرة")

                    orig_title = (
                        item.get("original_title") or item.get("original_name") or ""
                    )
                    ar_title = item.get("title") or item.get("name") or ""

                    if ar_title and ar_title != orig_title:
                        final_title = f"{orig_title} ({ar_title})"
                    else:
                        final_title = orig_title if orig_title else ar_title

                    entry_type = "short" if is_short else media_type

                    entry = {
                        "id": item["id"],
                        "type": entry_type,
                        "tmdb_type": media_type,
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

        time.sleep(0.25)
    return results


def fetch_dailymotion_shorts(queries=None, limit_per_query=15):
    if queries is None:
        queries = SHORT_DRAMA_QUERIES

    results = []
    seen_ids = set()
    fields = "id,title,description,thumbnail_720_url,thumbnail_480_url,duration,created_time"

    for q in queries:
        params = {
            "search": q,
            "fields": fields,
            "limit": limit_per_query,
            "sort": "relevance",
            "flags": "no_live,verified",
        }
        try:
            resp = requests.get(DAILYMOTION_API_URL, params=params, headers=HEADERS, timeout=10)
            if resp.status_code != 200:
                print(f"⚠️ تعذر الجلب من Dailymotion للاستعلام [{q}]: {resp.status_code}")
                continue

            videos = resp.json().get("list", [])
            for vid in videos:
                dm_id = vid.get("id")
                if not dm_id or dm_id in seen_ids:
                    continue

                duration = vid.get("duration") or 0
                # استبعاد المقاطع القصيرة جداً (إعلانات أقل من دقيقة)
                if duration < 60:
                    continue

                poster = vid.get("thumbnail_720_url") or vid.get("thumbnail_480_url")
                if not poster:
                    continue

                seen_ids.add(dm_id)
                title = (vid.get("title") or "دراما قصيرة").strip()
                desc = (vid.get("description") or "").strip()
                if len(desc) > 280:
                    desc = desc[:277] + "..."
                if not desc:
                    desc = f"مشاهدة {title} بجودة عالية على Youb Cima."

                created_ts = vid.get("created_time")
                year_str = (
                    datetime.datetime.utcfromtimestamp(created_ts).strftime("%Y")
                    if created_ts
                    else str(datetime.date.today().year)
                )

                embed_url = f"https://geo.dailymotion.com/player.html?video={dm_id}"

                entry = {
                    "id": f"dm_{dm_id}",
                    "type": "short",
                    "source": "dailymotion",
                    "title": title,
                    "original_title": title,
                    "poster": poster,
                    "backdrop": poster,
                    "rating": 8.0,
                    "year": year_str,
                    "overview": desc,
                    "section": "دراما قصيرة",
                    "genres": ["دراما قصيرة", "دراما"],
                    "stream_url": embed_url,
                    "streams": [
                        {
                            "server": "سيرفر الدراما القصيرة (Dailymotion)",
                            "url": embed_url,
                        }
                    ],
                    "date": datetime.date.today().isoformat(),
                }
                results.append(entry)
        except Exception as e:
            print(f"❌ خطأ أثناء الجلب من Dailymotion ({q}): {e}")

        time.sleep(0.3)

    return results


def generate_sitemap(items, output_path="sitemap.xml"):
    today = datetime.date.today().isoformat()
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        "  <url>",
        f"    <loc>{SITE_URL}/</loc>",
        f"    <lastmod>{today}</lastmod>",
        "    <changefreq>daily</changefreq>",
        "    <priority>1.0</priority>",
        "  </url>",
    ]

    seen_locs = {f"{SITE_URL}/"}

    for item in items:
        item_id = item.get("id")
        if not item_id:
            continue

        item_type = quote(str(item.get("type") or "movie"))
        encoded_id = quote(str(item_id))
        loc = f"{SITE_URL}/watch.html?id={encoded_id}&amp;type={item_type}"
        if loc in seen_locs:
            continue
        seen_locs.add(loc)

        lastmod = item.get("date") or today
        lines.extend([
            "  <url>",
            f"    <loc>{loc}</loc>",
            f"    <lastmod>{lastmod}</lastmod>",
            "    <changefreq>weekly</changefreq>",
            "    <priority>0.8</priority>",
            "  </url>",
        ])

    lines.append("</urlset>")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

    print(f"🗺️ تم تحديث {output_path} بعدد {len(seen_locs)} رابط.")


def main():
    all_media = []

    tasks = [
        ("movie", "en", 10, "popularity.desc", False, None),
        ("movie", "en", 5, "vote_count.desc", False, None),
        ("tv", "en", 10, "popularity.desc", False, None),
        ("movie", "ar", 4, "popularity.desc", False, None),
        ("tv", "ar", 4, "popularity.desc", False, None),
        ("tv", "tr", 6, "popularity.desc", False, None),
        ("movie", "tr", 3, "popularity.desc", False, None),
        ("tv", "ko", 6, "popularity.desc", False, None),
        ("movie", "ko", 4, "popularity.desc", False, None),
        ("tv", "ja", 6, "popularity.desc", False, None),
        # أفلام قصيرة من TMDB (أقل من 40 دقيقة)
        ("movie", "en", 3, "popularity.desc", True, 40),
        ("movie", "ko", 2, "popularity.desc", True, 40),
    ]

    print("🚀 جاري سحب وتصنيف الأعمال المتنوعة مع حظر المحتوى الإباحي...")
    for m_type, lang, pages, sort_by, is_short, max_rt in tasks:
        print(f"⏳ جاري سحب [{m_type}] بلغة [{lang}] بترتيب [{sort_by}]...")
        all_media.extend(
            fetch_content(
                m_type,
                lang,
                pages,
                sort_by,
                is_short=is_short,
                max_runtime=max_rt,
            )
        )

    print("🎬 جاري سحب الدراما القصيرة من Dailymotion مجاناً...")
    dm_shorts = fetch_dailymotion_shorts()
    print(f"📦 تم جلب {len(dm_shorts)} عمل من Dailymotion.")
    all_media.extend(dm_shorts)

    unique_media = list(
        {f"{item['type']}_{item['id']}": item for item in all_media}.values()
    )
    print(
        f"🔍 تم سحب {len(unique_media)} عمل فريد. جاري فحص السيرفرات وحذف غير المتوفر..."
    )

    approved_media = []
    removed_count = 0

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

    generate_sitemap(approved_media, "sitemap.xml")

    print(
        f"✅ تم الانتهاء بنجاح! تم نشر {len(approved_media)} عمل صالح وحذف"
        f" {removed_count} عمل بدون سيرفرات شغالة."
    )


if __name__ == "__main__":
    main()
