let movies = [];

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
        setupCategoryFilter(); // تفعيل الأقسام الثلاثة والفلترة المتقدمة
    } catch (error) {
        console.error('خطأ في جلب بيانات الأفلام:', error);
    }
}

// دالة تصنيع عنصر كرت العمل مع زر المفضلة السريع على البوستر
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    const badgeType = movie.type === 'tv' ? 'مسلسل' : 'HD';
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
    
    card.onclick = () => {
        window.location.href = `watch.html?id=${movie.id}&type=${movie.type}`;
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

// دالة إنشاء وإضافة كروت الأعمال
function renderRow(containerId, sectionName = null, genreName = null, typeFilter = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    // التأكد من أن حاوية الصفوف الرئيسية تستخدم التمرير الأفقي (Flex)
    container.style.display = 'flex';
    container.style.gridTemplateColumns = '';
    container.style.gap = '15px';
    
    let filteredMovies = movies;
    if (sectionName) {
        filteredMovies = movies.filter(item => item.section === sectionName);
    } else if (genreName) {
        filteredMovies = movies.filter(item => item.genres && item.genres.includes(genreName));
    } else if (typeFilter) {
        filteredMovies = movies.filter(item => item.type === typeFilter);
    }

    if (filteredMovies.length === 0) {
        container.innerHTML = '<p class="no-content" style="color: #aaa; padding: 10px;">لا توجد أعمال متاحة في هذا القسم حالياً</p>';
        return;
    }

    filteredMovies.forEach(movie => {
        const card = createMovieCard(movie);
        container.appendChild(card);
    });
}

// دالة عرض قسم "أكمل المشاهدة" في الصفحة الرئيسية
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
            <h2 class="row-title" style="color: #fff; margin-bottom: 10px; font-size: 18px;"><i class="fa-solid fa-clock-rotate-left" style="color: #e50914;"></i> أكمل المشاهدة</h2>
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

// عرض صفحة المفضلة بالكامل
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
            <h2 class="row-title" style="margin-bottom: 20px; font-size: 20px; color: #fff;"><i class="fa-solid fa-heart" style="color: #e50914;"></i> قائمة المفضلة</h2>
            <div id="favoritesGrid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;"></div>
        `;
        const mainContainer = document.querySelector('.content-container') || document.body;
        mainContainer.appendChild(favSection);
    } else {
        favSection.style.display = 'block';
    }

    const grid = document.getElementById('favoritesGrid');
    const favorites = getFavorites();
    grid.innerHTML = '';

    if (favorites.length === 0) {
        grid.innerHTML = '<p style="color: #aaa; text-align: center; grid-column: span 3; padding: 40px;">لا توجد أي أعمال في قائمة المفضلة حالياً.</p>';
        return;
    }

    favorites.forEach(movie => {
        const card = createMovieCard(movie);
        grid.appendChild(card);
    });
}

// تشغيل الصفحة الرئيسية وتعبئة الصفوف والأقسام الافتراضية
function initApp() {
    renderContinueWatching(); 
    document.querySelectorAll('.row-section').forEach(sec => {
        if (sec.id !== 'favoritesViewSection') sec.style.display = 'block';
    });

    renderRow('trendingRow'); // الأكثر شهرة
    renderRow('turkishSeriesRow', null, null, 'tv'); // مسلسلات عامة
    renderRow('arabicMoviesRow', null, null, 'movie'); // أفلام عامة
    renderRow('animeRow', 'أنمي'); // أنمي

    // إخفاء الأشرطة الفرعية والقوائم في الواجهة الرئيسية
    const seriesSubBar = document.getElementById('seriesSubBar');
    const subCategoriesBar = document.getElementById('subCategoriesBar');
    if (seriesSubBar) seriesSubBar.style.display = 'none';
    if (subCategoriesBar) subCategoriesBar.style.display = 'none';

    // إعداد واجهة الـ Hero
    const heroPlayBtn = document.getElementById('heroPlayBtn');
    const heroTitle = document.getElementById('heroTitle');
    const heroDesc = document.getElementById('heroDesc');

    if (movies.length > 0) {
        const featured = movies[0];
        if (heroTitle) heroTitle.textContent = featured.title;
        if (heroDesc) heroDesc.textContent = featured.overview || "لا توجد قصة متاحة";

        if (heroPlayBtn) {
            heroPlayBtn.onclick = () => {
                window.location.href = `watch.html?id=${featured.id}&type=${featured.type}`;
            };
        }
    }
}

// دالة تفعيل الأقسام والتصنيفات الفرعية والقوائم المنسدلة
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

        // 1. الفلترة حسب القسم الرئيسي (السطر الأول)
        if (currentMain === 'movies') {
            filtered = movies.filter(item => item.type === 'movie' && item.section !== 'أنمي');
            sectionLabel = "أفلام";
        } else if (currentMain === 'tv') {
            filtered = movies.filter(item => item.type === 'tv' && item.section !== 'أنمي');
            sectionLabel = "مسلسلات";
        } else if (currentMain === 'أنمي') {
            filtered = movies.filter(item => item.section === 'أنمي' || (item.genres && item.genres.includes('أنمي وكرتون')));
            sectionLabel = "أنمي";
        }

        // 2. الفلترة حسب نوع/دولة المسلسلات (السطر الثاني - حصري للمسلسلات)
        if (currentMain === 'tv' && currentSeriesType !== 'all') {
            filtered = filtered.filter(item => item.section === currentSeriesType || (item.genres && item.genres.includes(currentSeriesType)));
            sectionLabel += ` - ${currentSeriesType}`;
        }

        // 3. الفلترة أو الترتيب حسب "الأحدث" أو تصنيفات IMDb الفرعية (السطر الثالث)
        if (currentGenre === 'latest') {
            filtered = [...filtered].reverse();
            sectionLabel += ` - الأحدث`;
        } else if (currentGenre !== 'all') {
            filtered = filtered.filter(item => item.genres && item.genres.includes(currentGenre));
            sectionLabel += ` - ${currentGenre}`;
        }

        // 4. الفلترة حسب سنة الإنتاج للأفلام (السطر الثالث - القائمة المنسدلة حصرياً للأفلام)
        if (currentMain === 'movies' && currentYear !== 'all') {
            filtered = filtered.filter(item => {
                const itemYear = item.year || (item.release_date ? item.release_date.substring(0, 4) : '');
                return itemYear === currentYear;
            });
            sectionLabel += ` (${currentYear})`;
        }

        // إظهار القسم الخاص بـ trendingRow حصرياً وإخفاء بقية الأقسام وأكمل المشاهدة
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
            // تطبيق شبكة 3 بوسترات في السطر حصرياً عند تصفح الأقسام
            trendingRow.style.display = 'grid';
            trendingRow.style.gridTemplateColumns = 'repeat(3, 1fr)';
            trendingRow.style.gap = '8px';
            trendingRow.innerHTML = '';

            if (filtered.length === 0) {
                trendingRow.innerHTML = `<p style="color: #aaa; padding: 30px; text-align: center; width: 100%;">عذراً، لا توجد أعمال مطابقة للخيارات المحددة حالياً.</p>`;
                return;
            }

            filtered.forEach(movie => {
                const card = createMovieCard(movie);
                trendingRow.appendChild(card);
            });
        }
    }

    // استماع للأقسام الأساسية (السطر الأول)
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            currentMain = button.getAttribute('data-section');
            currentSeriesType = 'all';
            currentGenre = 'all';
            currentYear = 'all';

            if (yearSelect) yearSelect.value = 'all';

            // إعادة ضبط الأزرار الفرعية
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

            // إظهار وإخفاء الأسطر حسب القسم المختار
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

    // استماع لتصنيفات المسلسلات (السطر الثاني)
    seriesSubButtons.forEach(button => {
        button.addEventListener('click', () => {
            seriesSubButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            currentSeriesType = button.getAttribute('data-series-type');
            applyFilters();
        });
    });

    // استماع لتصنيفات IMDb أو زر الأحدث (السطر الثالث)
    subCategoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            subCategoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            currentGenre = button.getAttribute('data-genre');
            applyFilters();
        });
    });

    // استماع لتغيير قائمة سنة الإنتاج (للأفلام)
    if (yearSelect) {
        yearSelect.addEventListener('change', (e) => {
            currentYear = e.target.value;
            applyFilters();
        });
    }
}

// تفعيل ميزة البحث الفوري
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

        // إخفاء الأشرطة الفرعية أثناء البحث
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
        if (titleEl) titleEl.textContent = `نتائج البحث: "${searchInput.value}"`;

        if (trendingRow) {
            // تطبيق شبكة 3 بوسترات عند البحث أيضاً
            trendingRow.style.display = 'grid';
            trendingRow.style.gridTemplateColumns = 'repeat(3, 1fr)';
            trendingRow.style.gap = '8px';
            trendingRow.innerHTML = '';
            
            if (matchedMovies.length === 0) {
                trendingRow.innerHTML = '<p style="color: #fff; padding: 20px; text-align: center; width: 100%;">عذراً، لم نجد أي عمل مطابق لبحثك.</p>';
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

// تنفيذ التحميل عند فتح الصفحة الرئيسية
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('watch.html')) {
        loadMovies();
    }
});
