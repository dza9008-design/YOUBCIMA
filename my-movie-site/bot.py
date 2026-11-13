import requests
import json
import time

API_KEY = "3fc9a599ce632eacdf94e9382a49da27"
BASE_URL = "https://api.themoviedb.org/3"

GENRES_MAP = {
    28: "أكشن", 12: "مغامرة", 16: "أنمي وكرتون", 35: "كوميديا",
    80: "جريمة", 18: "دراما", 10751: "عائلي", 14: "فانتازيا",
    27: "رعب", 10749: "رومانسي", 878: "خيال علمي", 53: "إثارة",
    10759: "أكشن ومغامرة", 10765: "خيال علمي وفانتازيا"
}

def determine_section(item, media_type):
    lang = item.get("original_language", "")
    genres = item.get("genre_ids", [])

    if 16 in genres and lang == "ja":
        return "أنمي"
    if 16 in genres:
        return "أفلام ومسلسلات كرتون"

    if media_type == "movie":
        if lang == "ar": return "أفلام عربية"
        if lang == "tr": return "أفلام تركية"
        if lang == "ko": return "أفلام كورية"
        return "أفلام أجنبية"
    else:
        if lang == "ar": return "مسلسلات عربية"
        if lang == "tr": return "مسلسلات تركية"
        if lang == "ko": return "مسلسلات كورية"
        return "مسلسلات أجنبية"

def fetch_content(media_type, language=None, pages=5):
    results = []
    endpoint = f"{BASE_URL}/discover/{media_type}"
    
    for page in range(1, pages + 1):
        params = {
            "api_key": API_KEY,
            "language": "ar-SA", # لجلب تفاصيل ووصف باللغة العربية مع الاسم العربي
            "sort_by": "popularity.desc",
            "page": page
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
                    genre_names = [GENRES_MAP.get(g, "منوع") for g in item.get("genre_ids", [])]
                    
                    # الاسم الأصلي (إنجليزي/فرنسي/أصلي)
                    orig_title = item.get("original_title") or item.get("original_name") or ""
                    # الاسم المترجم بالعربية من TMDB
                    ar_title = item.get("title") or item.get("name") or ""
                    
                    # جعل الاسم الأساسي باللغة الأصلية، وإذا توفر اسم عربي مختلف نضعه بين قوسين
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
                        "backdrop": f"https://image.tmdb.org/t/p/original{item['backdrop_path']}" if item.get("backdrop_path") else "",
                        "rating": round(item.get("vote_average", 0), 1),
                        "year": (item.get("release_date") or item.get("first_air_date") or "2026")[:4],
                        "overview": item.get("overview") or "لا يوجد وصف متوفر حالياً.",
                        "section": section,
                        "genres": list(set(genre_names))
                    }
                    results.append(entry)
            else:
                print(f"⚠️ خطأ من السيرفر (كود {response.status_code}): {response.text}")
                break
        except Exception as e:
            print(f"❌ خطأ في الاتصال بالإنترنت أو TMDB: {e}")
            break
            
        time.sleep(0.3)
    return results

def main():
    all_media = []
    
    tasks = [
        ("movie", "en", 10), # أفلام أجنبية
        ("tv", "en", 10),    # مسلسلات أجنبية
        ("movie", "ar", 3),  # أفلام عربية
        ("tv", "ar", 3),     # مسلسلات عربية
        ("tv", "tr", 5),     # مسلسلات تركية
        ("movie", "tr", 2),  # أفلام تركية
        ("tv", "ko", 5),     # مسلسلات كورية
        ("movie", "ko", 3),  # أفلام كورية
        ("tv", "ja", 6),     # أنمي ياباني
    ]

    print("🚀 جاري بدء سحب وتصنيف الأعمال بالأسماء الأصلية مع الترجمة بين قوسين...")
    for m_type, lang, pages in tasks:
        print(f"⏳ جاري سحب [{m_type}] بلغة [{lang}]...")
        all_media.extend(fetch_content(m_type, lang, pages))

    unique_media = {f"{item['type']}_{item['id']}": item for item in all_media}.values()
    final_list = list(unique_media)

    with open("movies.json", "w", encoding="utf-8") as f:
        json.dump(final_list, f, ensure_ascii=False, indent=2)

    print(f"✅ تم الانتهاء بنجاح! إجمالي الأعمال المحفوظة في movies.json: {len(final_list)}")

if __name__ == "__main__":
    main()