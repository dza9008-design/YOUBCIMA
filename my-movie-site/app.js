let movies = [];

// دالة لجلب الأفلام والمسلسلات من ملف movies.json المحلي
async function loadMovies() {
    try {
        const response = await fetch('movies.json');
        if (!response.ok) {
            throw new Error('فشل في تحميل ملف الأفلام');
        }
        movies = await response.json();
        
        initApp();
        setupSearch();
        setupCategoryFilter(); // تفعيل الأقسام الثلاثة والفلترة المتقدمة
    } catch (error) {
        console.error('خطأ في جلب بيانات الأفلام:', error);
    }
}

// دالة إنشاء وإضافة كروت الأعمال
function renderRow(containerId, sectionName = null, genreName = null, typeFilter = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
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

// دالة تصنيع عنصر كرت العمل
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    const badgeType = movie.type === 'tv' ? 'مسلسل' : 'HD';

    card.innerHTML = `
        <div class="poster-wrapper">
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

// تشغيل الصفحة الرئيسية وتعبئة الصفوف والأقسام الافتراضية
function initApp() {
    document.querySelectorAll('.row-section').forEach(sec => sec.style.display = 'block');

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
            // ترتيب الأعمال من الأحدث (عكس المصفوفة لتعرض أحدث المضافات أولاً)
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

        allSections.forEach((sec, index) => {
            sec.style.display = index === 0 ? 'block' : 'none';
        });

        const titleEl = trendingRow?.previousElementSibling;
        if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-layer-group"></i> ${sectionLabel}`;

        if (trendingRow) {
            trendingRow.style.display = 'flex';
            trendingRow.style.flexWrap = 'wrap';
            trendingRow.style.gap = '15px';
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
            initApp();
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

        allSections.forEach((sec, index) => {
            sec.style.display = index === 0 ? 'block' : 'none';
        });

        const titleEl = trendingRow?.previousElementSibling;
        if (titleEl) titleEl.textContent = `نتائج البحث: "${searchInput.value}"`;

        if (trendingRow) {
            trendingRow.style.flexWrap = 'wrap';
            trendingRow.style.gap = '15px';
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