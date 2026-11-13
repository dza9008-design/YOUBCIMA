let movies = [];

// قاموس الترجمات الشامل للموقع وصفحة المشاهدة
const siteTranslations = {
    "ar-dz": {
        dir: "rtl",
        home: "الرئيسية",
        search_placeholder: "ابحث عن فيلم أو مسلسل...",
        trending_badge: "الأكثر مشاهدة اليوم",
        hero_desc: "استمتع بأحدث الأفلام والمسلسلات بجودة عالية حصرياً على Youb Cima.",
        watch_now: "تشغيل الآن",
        cat_all: "الكل",
        cat_movies: "أفلام",
        cat_series: "مسلسلات",
        cat_anime: "أنمي",
        series_arabic: "مسلسلات عربية",
        series_turkish: "مسلسلات تركية",
        series_korean: "مسلسلات كورية",
        series_foreign: "مسلسلات أجنبية",
        genre_latest: "الأحدث",
        genre_action: "أكشن",
        genre_horror: "رعب",
        genre_drama: "دراما",
        genre_comedy: "كوميديا",
        genre_scifi: "خيال علمي",
        genre_thriller: "إثارة",
        genre_adventure: "مغامرة",
        year_all: "سنة الإنتاج: الكل",
        year_older: "2022 فما قبل",
        row_trending: "الأكثر شهرة والأحدث",
        row_series: "مسلسلات",
        row_movies: "أفلام",
        row_anime: "أنمي وكرتون",
        search_bottom: "بحث",
        favorites: "المفضلة",
        continue_watching: "أكمل المشاهدة",
        no_content: "لا توجد أعمال متاحة حالياً",
        no_match: "عذراً، لا توجد أعمال مطابقة للخيارات المحددة حالياً.",
        no_search_match: "عذراً، لم نجد أي عمل مطابق لبحثك.",
        no_overview: "لا توجد قصة متاحةة",
        servers_label: "السيرفرات:",
        season_label: "الموسم:",
        episode_label: "الحلقة:",
        add_fav: "أضف للمفضلة",
        remove_fav: "إزالة من المفضلة",
        related_title: "قد تهمك",
        telegram_channel: "قناة Youb Cima على التليغرام",
        join_now: "انضم الآن ←",
        loading_title: "جاري التحميل..."
    },
    "en": {
        dir: "ltr",
        home: "Home",
        search_placeholder: "Search for a movie or series...",
        trending_badge: "Most Watched Today",
        hero_desc: "Enjoy the latest movies and series in high quality exclusively on Youb Cima.",
        watch_now: "Watch Now",
        cat_all: "All",
        cat_movies: "Movies",
        cat_series: "Series",
        cat_anime: "Anime",
        series_arabic: "Arabic Series",
        series_turkish: "Turkish Series",
        series_korean: "Korean Series",
        series_foreign: "Foreign Series",
        genre_latest: "Latest",
        genre_action: "Action",
        genre_horror: "Horror",
        genre_drama: "Drama",
        genre_comedy: "Comedy",
        genre_scifi: "Sci-Fi",
        genre_thriller: "Thriller",
        genre_adventure: "Adventure",
        year_all: "Production Year: All",
        year_older: "2022 & Older",
        row_trending: "Most Popular & Latest",
        row_series: "Series",
        row_movies: "Movies",
        row_anime: "Anime & Cartoons",
        search_bottom: "Search",
        favorites: "Favorites",
        continue_watching: "Continue Watching",
        no_content: "No works available currently",
        no_match: "Sorry, no works match the selected options currently.",
        no_search_match: "Sorry, we couldn't find any work matching your search.",
        no_overview: "No overview available",
        servers_label: "Servers:",
        season_label: "Season:",
        episode_label: "Episode:",
        add_fav: "Add to Favorites",
        remove_fav: "Remove from Favorites",
        related_title: "You may also like",
        telegram_channel: "Youb Cima Telegram Channel",
        join_now: "Join Now ←",
        loading_title: "Loading..."
    },
    "fr": {
        dir: "ltr",
        home: "Accueil",
        search_placeholder: "Rechercher un film ou une série...",
        trending_badge: "Les plus regardés aujourd'hui",
        hero_desc: "Profitez des derniers films et séries en haute qualité exclusivement sur Youb Cima.",
        watch_now: "Regarder",
        cat_all: "Tous",
        cat_movies: "Films",
        cat_series: "Séries",
        cat_anime: "Anime",
        series_arabic: "Séries arabes",
        series_turkish: "Séries turques",
        series_korean: "Séries coréennes",
        series_foreign: "Séries étrangères",
        genre_latest: "Plus récents",
        genre_action: "Action",
        genre_horror: "Horreur",
        genre_drama: "Drame",
        genre_comedy: "Comédie",
        genre_scifi: "Science-fiction",
        genre_thriller: "Thriller",
        genre_adventure: "Aventure",
        year_all: "Année de production : Tous",
        year_older: "2022 et avant",
        row_trending: "Plus populaires et récents",
        row_series: "Séries",
        row_movies: "Films",
        row_anime: "Anime et dessins animés",
        search_bottom: "Rechercher",
        favorites: "Favoris",
        continue_watching: "Continuer la lecture",
        no_content: "Aucun contenu disponible actuellement",
        no_match: "Désolé, aucun contenu ne correspond aux options sélectionnées.",
        no_search_match: "Désolé, nous n'avons trouvé aucun contenu correspondant à votre recherche.",
        no_overview: "Aucun résumé disponible",
        servers_label: "Serveurs :",
        season_label: "Saison :",
        episode_label: "Épisode :",
        add_fav: "Ajouter aux favoris",
        remove_fav: "Retirer des favoris",
        related_title: "Vous pourriez aimer",
        telegram_channel: "Canal Telegram Youb Cima",
        join_now: "Rejoindre ←",
        loading_title: "Chargement..."
    },
    "es": {
        dir: "ltr",
        home: "Inicio",
        search_placeholder: "Buscar película o serie...",
        trending_badge: "Más vistos hoy",
        hero_desc: "Disfruta de las últimas películas y series en alta calidad exclusivamente en Youb Cima.",
        watch_now: "Ver ahora",
        cat_all: "Todos",
        cat_movies: "Películas",
        cat_series: "Series",
        cat_anime: "Anime",
        series_arabic: "Series árabes",
        series_turkish: "Series turcas",
        series_korean: "Series coreanas",
        series_foreign: "Series extranjeras",
        genre_latest: "Más recientes",
        genre_action: "Acción",
        genre_horror: "Terror",
        genre_drama: "Drama",
        genre_comedy: "Comedia",
        genre_scifi: "Ciencia ficción",
        genre_thriller: "Suspenso",
        genre_adventure: "Aventura",
        year_all: "Año de producción: Todos",
        year_older: "2022 y anteriores",
        row_trending: "Más populares y recientes",
        row_series: "Series",
        row_movies: "Películas",
        row_anime: "Anime y caricaturas",
        search_bottom: "Buscar",
        favorites: "Favoritos",
        continue_watching: "Continuar viendo",
        no_content: "No hay contenido disponible actualmente",
        no_match: "Lo siento, no hay contenido que coincida con las opciones seleccionadas.",
        no_search_match: "Lo siento, no pudimos encontrar ningún contenido que coincida con tu búsqueda.",
        no_overview: "No hay resumen disponible",
        servers_label: "Servidores:",
        season_label: "Temporada:",
        episode_label: "Episodio:",
        add_fav: "Añadir a favoritos",
        remove_fav: "Quitar de favoritos",
        related_title: "También te puede interesar",
        telegram_channel: "Canal de Telegram Youb Cima",
        join_now: "Unirse ahora ←",
        loading_title: "Cargando..."
    }
};

let currentLang = 'ar-dz';

// دوال إدارة اللغات
function applyLanguage(lang) {
    if (!siteTranslations[lang]) lang = 'ar-dz';
    currentLang = lang;
    localStorage.setItem('user_lang', lang);

    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.value = lang;

    const t = siteTranslations[lang];
    document.documentElement.setAttribute('dir', t.dir);
    document.documentElement.setAttribute('lang', lang);

    // تحديث كافة العناصر التي تحمل سمة data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            const icon = el.querySelector('i');
            if (icon) {
                const iconHTML = icon.outerHTML;
                el.innerHTML = `${iconHTML} ${t[key]}`;
            } else {
                el.textContent = t[key];
            }
        }
    });

    // تحديث حقول البحث (Placeholders)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.placeholder = t[key];
    });
}

function switchLanguage(lang) {
    applyLanguage(lang);
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('view') === 'favorites') {
        renderFavoritesView();
    } else if (!window.location.pathname.includes('watch.html')) {
        initApp();
    } else {
        location.reload(); 
    }
}

// دوال إدارة المفضلة عبر LocalStorage
function getFavorites() {
    return JSON.parse(localStorage.getItem('youbcima_favorites') || '[]');
}

function isFavorite(id) {
    return getFavorites().some(item => String(item.id) === String(id));
}

function toggleFavorite(movie) {
    let favs = getFavorites();
    const index = favs.findIndex(item => String(item.id) === String(movie.id));
    if (index > -1) {
        favs.splice(index, 1);
    } else {
        favs.push({
            id: movie.id,
            title: movie.title,
            poster: movie.poster,
            type: movie.type || 'movie',
            year: movie.year || '',
            rating: movie.rating || ''
        });
    }
    localStorage.setItem('youbcima_favorites', JSON.stringify(favs));
}

// دالة لجلب الأفلام والمسلسلات من ملف movies.json المحلي
async function loadMovies() {
    try {
        const response = await fetch('movies.json');
        if (!response.ok) {
            throw new Error('فشل في تحميل ملف الأفلام');
        }
        movies = await response.json();
        
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('view') === 'favorites') {
            renderFavoritesView();
        } else {
            initApp();
        }
        setupSearch();
        setupCategoryFilter();
    } catch (error) {
        console.error('خطأ في جلب بيانات الأفلام:', error);
    }
}

// دالة إنشاء كرت العمل مع زر المفضلة السريع على البوستر (مصححة)
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    const badgeType = movie.type === 'tv' ? (currentLang === 'fr' ? 'Série' : currentLang === 'en' ? 'Series' : 'مسلسل') : 'HD';
    const favActive = isFavorite(movie.id) ? 'active' : '';
    const favColor = favActive ? '#e50914' : '#fff';
    const favBg = favActive ? 'rgba(229, 9, 20, 0.2)' : 'rgba(0, 0, 0, 0.7)';

    card.innerHTML = `
        <div class="poster-wrapper" style="position: relative;">
            <button class="poster-fav-btn ${favActive}" onclick="event.stopPropagation(); toggleFavQuickCard(this, ${JSON.stringify(movie).replace(/"/g, '&quot;')})" style="position: absolute; top: 8px; left: 8px; background: ${favBg}; border: none; color: ${favColor}; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: 0.2s; z-index: 5;">
                <i class="fa-solid fa-heart"></i>
            </button>
            <img src="${movie.poster}" alt="${movie.title}" loading="lazy">
            <span class="badge-hd">${badgeType}</span>
        </div>
        <div class="movie-title">${movie.title}</div>
    `;
    
    // التعديل السليم هنا لضمان الانتقال لصفحة المشاهدة بالمعرف والنوع
    card.onclick = () => {
        const movieType = movie.type || (movie.section && movie.section.includes('مسلسل') ? 'tv' : 'movie');
        window.location.href = `watch.html?id=${movie.id}&type=${movieType}`;
    };
    return card;
}

function toggleFavQuickCard(btn, movie) {
    toggleFavorite(movie);
    const active = isFavorite(movie.id);
    btn.classList.toggle('active', active);
    btn.style.color = active ? '#e50914' : '#fff';
    btn.style.background = active ? 'rgba(229, 9, 20, 0.2)' : 'rgba(0, 0, 0, 0.7)';
}

// دالة تعبئة الصفوف الأفقية بمحتوى الأفلام
function renderRow(containerId, sectionName = null, genreName = null, typeFilter = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.gridTemplateColumns = '';
    container.style.gap = '15px';
    container.style.overflowX = 'auto';
    
    let filteredMovies = movies;
    if (sectionName) {
        filteredMovies = movies.filter(item => item.section === sectionName || (item.genres && item.genres.includes(sectionName)));
    } else if (genreName) {
        filteredMovies = movies.filter(item => item.genres && item.genres.includes(genreName));
    } else if (typeFilter) {
        filteredMovies = movies.filter(item => 
            item.type === typeFilter || 
            (typeFilter === 'movie' && (item.section?.includes('أفلام') || item.section?.includes('فيلم'))) ||
            (typeFilter === 'tv' && (item.section?.includes('مسلسل') || item.section?.includes('مسلسلات')))
        );
    }

    if (filteredMovies.length === 0) {
        container.innerHTML = `<p class="no-content" style="color: #aaa; padding: 10px;">${siteTranslations[currentLang].no_content}</p>`;
        return;
    }

    filteredMovies.forEach(movie => {
        const card = createMovieCard(movie);
        container.appendChild(card);
    });
}

// دالة عرض قسم "أكمل المشاهدة"
function renderContinueWatching() {
    const history = JSON.parse(localStorage.getItem('youbcima_history') || '[]');
    let cwSection = document.getElementById('continueWatchingSection');
    const mainContainer = document.querySelector('.content-container');
    
    if (history.length === 0) {
        if (cwSection) cwSection.style.display = 'none';
        return;
    }

    if (!mainContainer) return;

    if (!cwSection) {
        cwSection = document.createElement('section');
        cwSection.id = 'continueWatchingSection';
        cwSection.className = 'row-section';
        cwSection.style.marginBottom = '25px';
        cwSection.innerHTML = `
            <h2 class="row-title" style="color: #fff; margin-bottom: 10px; font-size: 18px;"><i class="fa-solid fa-clock-rotate-left" style="color: #e50914;"></i> ${siteTranslations[currentLang].continue_watching}</h2>
            <div class="row-cards" id="continueWatchingRow" style="display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px;"></div>
        `;
        const firstRow = mainContainer.querySelector('.row-section');
        if (firstRow) {
            mainContainer.insertBefore(cwSection, firstRow);
        } else {
            mainContainer.prepend(cwSection);
        }
    } else {
        cwSection.style.display = 'block';
        const titleEl = cwSection.querySelector('.row-title');
        if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-clock-rotate-left" style="color: #e50914;"></i> ${siteTranslations[currentLang].continue_watching}`;
    }

    const row = document.getElementById('continueWatchingRow');
    if (!row) return;
    row.innerHTML = '';

    history.forEach(item => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        const badgeText = item.type === 'tv' ? `م${item.season} ح${item.episode}` : 'HD';
        const favActive = isFavorite(item.id) ? 'active' : '';
        const favColor = favActive ? '#e50914' : '#fff';
        const favBg = favActive ? 'rgba(229, 9, 20, 0.2)' : 'rgba(0, 0, 0, 0.7)';

        card.innerHTML = `
            <div class="poster-wrapper" style="position: relative;">
                <button class="poster-fav-btn ${favActive}" onclick="event.stopPropagation(); toggleFavQuickCard(this, ${JSON.stringify(item).replace(/"/g, '&quot;')})" style="position: absolute; top: 8px; left: 8px; background: ${favBg}; border: none; color: ${favColor}; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; z-index: 5;">
                    <i class="fa-solid fa-heart"></i>
                </button>
                <img src="${item.poster}" alt="${item.title}" loading="lazy">
                <span class="badge-hd" style="background: #e50914;">${badgeText}</span>
            </div>
            <div class="movie-title">${item.title}</div>
        `;

        card.onclick = () => {
            if (item.type === 'tv') {
                window.location.href = `watch.html?id=${item.id}&type=tv&s=${item.season}&e=${item.episode}`;
            } else {
                window.location.href = `watch.html?id=${item.id}&type=movie`;
            }
        };
        row.appendChild(card);
    });
}

// عرض صفحة المفضلة
function renderFavoritesView() {
    const hero = document.querySelector('.hero-section') || document.getElementById('heroContainer');
    if (hero) hero.style.display = 'none';

    document.querySelectorAll('.row-section').forEach(sec => sec.style.display = 'none');

    let favSection = document.getElementById('favoritesViewSection');
    if (!favSection) {
        favSection = document.createElement('section');
        favSection.id = 'favoritesViewSection';
        favSection.style.padding = '20px';
        favSection.innerHTML = `
            <h2 class="row-title" style="margin-bottom: 20px; font-size: 20px; color: #fff;"><i class="fa-solid fa-heart" style="color: #e50914;"></i> ${siteTranslations[currentLang].favorites}</h2>
            <div id="favoritesGrid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;"></div>
        `;
        const mainContainer = document.querySelector('.content-container') || document.body;
        mainContainer.appendChild(favSection);
    } else {
        favSection.style.display = 'block';
        const titleEl = favSection.querySelector('.row-title');
        if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-heart" style="color: #e50914;"></i> ${siteTranslations[currentLang].favorites}`;
    }

    const grid = document.getElementById('favoritesGrid');
    const favorites = getFavorites();
    grid.innerHTML = '';

    if (favorites.length === 0) {
        grid.innerHTML = `<p style="color: #aaa; text-align: center; grid-column: span 3; padding: 40px;">${siteTranslations[currentLang].no_content}</p>`;
        return;
    }

    favorites.forEach(movie => {
        const card = createMovieCard(movie);
        grid.appendChild(card);
    });
}

// تشغيل الواجهة الرئيسية
function initApp() {
    renderContinueWatching();
    
    document.querySelectorAll('.row-section').forEach(sec => {
        if (sec.id !== 'favoritesViewSection') {
            sec.style.display = 'block';
        }
    });

    renderRow('trendingRow');                  
    renderRow('turkishSeriesRow', null, null, 'tv'); 
    renderRow('arabicMoviesRow', null, null, 'movie'); 
    renderRow('animeRow', 'أنمي');                

    const seriesSubBar = document.getElementById('seriesSubBar');
    const subCategoriesBar = document.getElementById('subCategoriesBar');
    if (seriesSubBar) seriesSubBar.style.display = 'none';
    if (subCategoriesBar) subCategoriesBar.style.display = 'none';

    const heroPlayBtn = document.getElementById('heroPlayBtn');
    const heroTitle = document.getElementById('heroTitle');
    const heroDesc = document.getElementById('heroDesc');

    if (movies.length > 0) {
        const featured = movies[0];
        if (heroTitle) heroTitle.textContent = featured.title;
        if (heroDesc) heroDesc.textContent = featured.overview || siteTranslations[currentLang].no_overview;

        if (heroPlayBtn) {
            heroPlayBtn.onclick = () => {
                const featuredType = featured.type || (featured.section && featured.section.includes('مسلسل') ? 'tv' : 'movie');
                window.location.href = `watch.html?id=${featured.id}&type=${featuredType}`;
            };
        }
    }
}

// تفعيل الفلاتر والأقسام
function setupCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.cat-btn');
    const seriesSubBar = document.getElementById('seriesSubBar');
    const seriesSubButtons = document.querySelectorAll('.series-sub-btn');
    const subCategoriesBar = document.getElementById('subCategoriesBar');
    const subCategoryButtons = document.querySelectorAll('.sub-cat-btn');
    const yearDropdownContainer = document.getElementById('yearDropdownContainer');
    const yearSelect = document.getElementById('yearSelect');
    const trendingRow = document.getElementById('trendingRow');
    const allSections = document.querySelectorAll('.row-section');

    let currentMain = 'all';
    let currentSeriesType = 'all';
    let currentGenre = 'all';
    let currentYear = 'all';

    function applyFilters() {
        let filtered = movies;
        let sectionLabel = "";

        if (currentMain === 'movies') {
            filtered = movies.filter(item => 
                item.type === 'movie' || 
                (item.section && (item.section.includes('أفلام') || item.section.includes('فيلم')))
            );
            filtered = filtered.filter(item => !(item.section && item.section.includes('أنمي')));
            sectionLabel = siteTranslations[currentLang].cat_movies;
        } else if (currentMain === 'tv') {
            filtered = movies.filter(item => 
                item.type === 'tv' || 
                (item.section && (item.section.includes('مسلسل') || item.section.includes('مسلسلات')))
            );
            filtered = filtered.filter(item => !(item.section && item.section.includes('أنمي')));
            sectionLabel = siteTranslations[currentLang].cat_series;
        } else if (currentMain === 'أنمي') {
            filtered = movies.filter(item => 
                (item.section && (item.section.includes('أنمي') || item.section.includes('كرتون'))) || 
                (item.genres && item.genres.some(g => g.includes('أنمي') || g.includes('كرتون')))
            );
            sectionLabel = siteTranslations[currentLang].cat_anime;
        }

        if (currentMain === 'tv' && currentSeriesType !== 'all') {
            filtered = filtered.filter(item => item.section === currentSeriesType || (item.genres && item.genres.includes(currentSeriesType)));
            sectionLabel += ` - ${currentSeriesType}`;
        }

        if (currentGenre === 'latest') {
            filtered = [...filtered].reverse();
            sectionLabel += ` - ${siteTranslations[currentLang].genre_latest}`;
        } else if (currentGenre !== 'all') {
            filtered = filtered.filter(item => item.genres && item.genres.includes(currentGenre));
            sectionLabel += ` - ${currentGenre}`;
        }

        if (currentMain === 'movies' && currentYear !== 'all') {
            filtered = filtered.filter(item => {
                const itemYear = item.year || (item.release_date ? item.release_date.substring(0, 4) : '');
                return itemYear === currentYear;
            });
            sectionLabel += ` (${currentYear})`;
        }

        const trendingSec = trendingRow?.closest('.row-section');
        allSections.forEach((sec) => {
            if (sec === trendingSec) {
                sec.style.display = 'block';
            } else {
                sec.style.display = 'none';
            }
        });

        const titleEl = trendingRow?.previousElementSibling;
        if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-layer-group"></i> ${sectionLabel}`;

        if (trendingRow) {
            trendingRow.style.display = 'grid';
            trendingRow.style.gridTemplateColumns = 'repeat(3, 1fr)';
            trendingRow.style.gap = '8px';
            trendingRow.innerHTML = '';

            if (filtered.length === 0) {
                trendingRow.innerHTML = `<p style="color: #fff; padding: 30px; text-align: center; grid-column: span 3;">${siteTranslations[currentLang].no_match}</p>`;
                return;
            }

            filtered.forEach(movie => {
                const card = createMovieCard(movie);
                trendingRow.appendChild(card);
            });
        }
    }

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            currentMain = button.getAttribute('data-section');
            currentSeriesType = 'all';
            currentGenre = 'all';
            currentYear = 'all';

            if (yearSelect) yearSelect.value = 'all';

            seriesSubButtons.forEach(b => b.classList.remove('active'));
            seriesSubButtons[0]?.classList.add('active');

            subCategoryButtons.forEach(b => b.classList.remove('active'));
            subCategoryButtons[0]?.classList.add('active');

            if (currentMain === 'all') {
                if (seriesSubBar) seriesSubBar.style.display = 'none';
                if (subCategoriesBar) subCategoriesBar.style.display = 'none';
                initApp();
                return;
            }

            if (currentMain === 'tv') {
                if (seriesSubBar) seriesSubBar.style.display = 'flex';
                if (subCategoriesBar) subCategoriesBar.style.display = 'flex';
                if (yearDropdownContainer) yearDropdownContainer.style.display = 'none';
            } else if (currentMain === 'movies') {
                if (seriesSubBar) seriesSubBar.style.display = 'none';
                if (subCategoriesBar) subCategoriesBar.style.display = 'flex';
                if (yearDropdownContainer) yearDropdownContainer.style.display = 'block';
            } else if (currentMain === 'أنمي') {
                if (seriesSubBar) seriesSubBar.style.display = 'none';
                if (subCategoriesBar) subCategoriesBar.style.display = 'flex';
                if (yearDropdownContainer) yearDropdownContainer.style.display = 'none';
            }

            applyFilters();
        });
    });

    seriesSubButtons.forEach(button => {
        button.addEventListener('click', () => {
            seriesSubButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentSeriesType = button.getAttribute('data-series-type');
            applyFilters();
        });
    });

    subCategoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            subCategoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentGenre = button.getAttribute('data-genre');
            applyFilters();
        });
    });

    if (yearSelect) {
        yearSelect.addEventListener('change', (e) => {
            currentYear = e.target.value;
            applyFilters();
        });
    }
}

// البحث الفوري
function setupSearch() {
    const searchInput = document.getElementById('searchInput') || document.querySelector('input[type="text"]');
    const seriesSubBar = document.getElementById('seriesSubBar');
    const subCategoriesBar = document.getElementById('subCategoriesBar');
    const trendingRow = document.getElementById('trendingRow');
    const allSections = document.querySelectorAll('.row-section');

    if (!searchInput) return;

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('view') === 'favorites') {
                renderFavoritesView();
            } else {
                initApp();
            }
            return;
        }

        if (seriesSubBar) seriesSubBar.style.display = 'none';
        if (subCategoriesBar) subCategoriesBar.style.display = 'none';

        const matchedMovies = movies.filter(m => 
            (m.title && m.title.toLowerCase().includes(query)) || 
            (m.original_title && m.original_title.toLowerCase().includes(query)) ||
            (m.section && m.section.toLowerCase().includes(query))
        );

        const trendingSec = trendingRow?.closest('.row-section');
        allSections.forEach((sec) => {
            if (sec === trendingSec) {
                sec.style.display = 'block';
            } else {
                sec.style.display = 'none';
            }
        });

        const titleEl = trendingRow?.previousElementSibling;
        if (titleEl) titleEl.textContent = `${currentLang === 'fr' ? 'Résultats de recherche' : currentLang === 'en' ? 'Search Results' : 'نتائج البحث'}: "${searchInput.value}"`;

        if (trendingRow) {
            trendingRow.style.display = 'grid';
            trendingRow.style.gridTemplateColumns = 'repeat(3, 1fr)';
            trendingRow.style.gap = '8px';
            trendingRow.innerHTML = '';
            
            if (matchedMovies.length === 0) {
                trendingRow.innerHTML = `<p style="color: #fff; padding: 20px; text-align: center; grid-column: span 3;">${siteTranslations[currentLang].no_search_match}</p>`;
                return;
            }
            matchedMovies.forEach(movie => {
                const card = createMovieCard(movie);
                trendingRow.appendChild(card);
            });
        }
    }

    searchInput.addEventListener('input', performSearch);
}

// عند تحميل الصفحة لأول مرة
document.addEventListener('DOMContentLoaded', () => {
    let savedLang = localStorage.getItem('user_lang');
    if (!savedLang) {
        let phoneLang = navigator.language || navigator.userLanguage;
        if (phoneLang.startsWith('ar')) {
            savedLang = 'ar-dz';
        } else if (phoneLang.startsWith('fr')) {
            savedLang = 'fr';
        } else if (phoneLang.startsWith('es')) {
            savedLang = 'es';
        } else {
            savedLang = 'en';
        }
    }
    applyLanguage(savedLang);

    if (!window.location.pathname.includes('watch.html')) {
        loadMovies();
    }
});
