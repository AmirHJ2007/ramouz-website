/**
 * i18n: reads ?lang=ar|en (falling back to the last saved choice), applies
 * translations to every [data-i18n] / [data-i18n-attr] element, flips
 * html lang/dir, and drives the header language switcher.
 *
 * Sections not yet tagged with data-i18n simply stay in English — this
 * dictionary grows section by section.
 */
(function () {
  const STORAGE_KEY = 'ramouz:lang';
  const flagByLang = { en: '🇬🇧', ar: '🇴🇲' };
  const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const toArabicDigits = str => String(str).replace(/[0-9]/g, d => ARABIC_DIGITS[+d]);

  const translations = {
    en: {
      'brand.home': 'Ramouz home',
      'brand.word': 'Ramouz',
      'nav.home': 'Home',
      'nav.menu': 'Menu',
      'nav.gallery': 'Gallery',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'lang.trigger_label': 'Change language',
      'lang.menu_label': 'Language',
      'lang.en': 'English',
      'lang.ar': 'العربية',
      'menu_toggle.aria': 'Open menu',
      'hero.aria_label': 'Ramouz hero',
      'hero.eyebrow': 'Est. Mashhad, now Muscat',
      'hero.line1': 'Every day with',
      'hero.brand_name': 'Ramouz Cafe',
      'hero.copy': 'Our beans, our ovens, our machines, your morning.',
      'hero.cta_menu': 'Explore our menu',
      'hero.cta_gallery': 'See the gallery',
      'hero.scroll_cue': 'Scroll down to the menu',
      'ticker.aria_label': 'Ramouz services',
      'ticker.1': 'Roasting since Mashhad',
      'ticker.2': 'Baked before you woke up',
      'ticker.3': 'The machines behind other counters',
      'ticker.4': 'Nine branches, one recipe',
      'ticker.5': 'Barista school in the back',
      'ticker.6': 'Est. 2016, now Muscat',
      'menu.eyebrow': 'Our menu',
      'menu.heading1': 'Made to taste good and ',
      'menu.heading_em': 'look even better',
      'menu.subtitle': '{n} items, search or filter to jump straight to yours.',
      'menu.search_label': 'Search the menu',
      'menu.search_placeholder': 'Search espresso, black tea, tiramisu…',
      'menu.search_clear': 'Clear search',
      'menu.tabs_aria': 'Menu categories',
      'menu.panel_full': 'Full menu',
      'menu.unavailable': 'Unavailable',
      'menu.cat.all': 'All',
      'menu.cat.coffee-base': 'Coffee Base',
      'menu.cat.tea-matcha': 'Tea & Matcha',
      'menu.cat.cold': 'Cold & Refreshing',
      'menu.cat.bites': 'Bites',
      'menu.cat.fit': 'Fit',
      'menu.expand_all': 'Expand all',
      'menu.collapse_all': 'Collapse all',
      'menu.expand_all_aria': 'Expand all categories',
      'menu.collapse_all_aria': 'Collapse all categories',
      'menu.empty_prefix': 'No items match “',
      'menu.empty_suffix': '”. Try coffee, tea, or croissant.',
      'gallery.eyebrow': 'Gallery',
      'gallery.heading1': 'Shot on the waterfront, ',
      'gallery.heading_em': 'moments with Ramouz',
      'gallery.cat.drinks': 'Drinks',
      'gallery.cat.space': 'The Space',
      'gallery.cat.craft': 'The Craft',
      'gallery.cat.moments': 'Moments',
      'gallery.1.alt': 'Takeaway tray with matcha and iced coffee, dressed with flowers',
      'gallery.1.cap': 'Takeaway, dressed up',
      'gallery.2.alt': 'Stay Bold campaign shot with a splashing berry drink',
      'gallery.2.cap': 'Stay bold',
      'gallery.3.alt': 'Caramel milkshake held up against the palm trees',
      'gallery.3.cap': 'Caramel under palms',
      'gallery.4.alt': 'Warm beige lounge interior with the bakery counter',
      'gallery.4.cap': 'The lounge',
      'gallery.5.alt': 'White stone bar with syrups, grinders and a warm lamp',
      'gallery.5.cap': 'The stone bar',
      'gallery.6.alt': 'Italian XLVI espresso machine on the stone counter',
      'gallery.6.cap': 'The XLVI machine',
      'gallery.7.alt': 'Window seats with a palm tree view',
      'gallery.7.cap': 'Window to the palms',
      'gallery.8.alt': 'Terrace tables at golden hour under the palms',
      'gallery.8.cap': 'Golden hour terrace',
      'gallery.9.alt': 'Espresso cup on marble under the glowing Ramouz sign',
      'gallery.9.cap': 'Espresso at the sign',
      'gallery.10.alt': 'Ramouz storefront glowing at night with Arabic signage',
      'gallery.10.cap': 'Waterfront at night',
      'about.eyebrow': 'About us',
      'about.heading1': 'The story behind ',
      'about.slider_aria': 'The Ramouz story',
      'about.prev_slide': 'Previous slide',
      'about.next_slide': 'Next slide',
      'about.1.kicker': 'The story',
      'about.1.h3_1': 'Two brothers, ',
      'about.1.h3_em': 'one idea',
      'about.1.p': 'Ten years ago, two brothers opened a small café in Mashhad. Nine more followed. The tenth is here, on the Muscat waterfront.',
      'about.1.img1_alt': 'Illustrated map of all Ramouz branches, from Mashhad to Muscat',
      'about.1.img2_alt': 'Glowing Ramouz Café Bakery signboard at night',
      'about.1.img3_alt': 'Blue Ramouz Café cat sign on the storefront',
      'about.2.kicker': 'The craft',
      'about.2.h3_1': 'Roasted by us, ',
      'about.2.h3_em': 'baked with love',
      'about.2.p': 'We started out pouring Lavazza. Now we import the beans, roast them under our own name, and bake everything in the case ourselves.',
      'about.2.img1_alt': 'Ramouz baker holding a tray of fresh brownies',
      'about.2.img2_alt': 'Tray of chocolate cupcakes and cookies from the Ramouz bakery',
      'about.2.img3_alt': 'Ramouz coffee bean bags, imported and roasted under our own brand',
      'about.3.kicker': 'The company',
      'about.3.h3_1': 'More than ',
      'about.3.h3_em': 'a café',
      'about.3.p': 'We supply Italian espresso machines and barista gear to cafés across Iran. We just kept the best of it for ourselves.',
      'about.3.img1_alt': 'Ramouz showroom shelves stocked with barista accessories',
      'about.3.img2_alt': 'Close-up of an XLVI espresso machine group head',
      'about.3.img3_alt': 'Italian XLVI espresso machine arriving on its shipping crate',
      'about.4.kicker': 'The school',
      'about.4.h3_em': 'School',
      'about.4.p': 'Coffee is a craft, and we teach it. From your first pour to your first shift behind a real bar — hands-on classes, real machines, and a certificate signed by the people who trained you.',
      'about.4.img1_alt': 'Students in a Ramouz School barista class',
      'about.4.img2_alt': 'Ramouz School student practicing a milk pour',
      'about.4.img3_alt': 'Barista wearing the Ramouz School apron',
      'contact.eyebrow': 'Contact us',
      'contact.heading1': 'Come find us ',
      'contact.heading_em': 'on the waterfront',
      'contact.phone_label': 'Phone',
      'contact.phone_value': '+968 7844 9000',
      'contact.phone_cta': 'Tap to call →',
      'contact.instagram_label': 'Instagram',
      'contact.instagram_cta': 'Tap to follow →',
      'contact.location_label': 'Location',
      'contact.location_value': 'Water-front Ramouz, Muscat, Oman',
      'contact.location_cta': 'Get Directions →',
      'contact.hours_label': 'Working hours',
      'contact.hours.1': 'Sun–Wed: 6:30 AM–12:30 AM',
      'contact.hours.2': 'Thu: 6:30 AM–1:30 AM',
      'contact.hours.3': 'Fri: 8 AM–1:30 AM',
      'contact.hours.4': 'Sat: 8 AM–12:30 AM',
      'contact.map_title': 'Ramouz Cafe location map',
      'footer.logo_alt': 'Ramouz Cafe',
      'footer.tag': 'Café, bakery, roastery, school, and the company behind the machines. Est. Mashhad ten years ago, now on the Muscat waterfront.',
      'footer.explore': 'Explore',
      'footer.nav_aria': 'Footer',
      'footer.craft_title': 'Our craft',
      'footer.craft.1': 'Specialty Coffee',
      'footer.craft.2': 'Fresh Bakery',
      'footer.craft.3': 'In-house Roastery',
      'footer.craft.4': 'Ramouz Barista School',
      'footer.craft.5': 'Espresso Machines & Gear',
      'footer.visit_title': 'Visit us',
      'footer.rights': 'Ramouz Café. All rights reserved.',
      'footer.admin_link': 'For admins',
      'footer.instagram_aria': 'Ramouz Cafe on Instagram',
      'footer.back_to_top': 'Back to top',
    },
    ar: {
      'brand.home': 'راموز — الصفحة الرئيسية',
      'brand.word': 'راموز',
      'nav.home': 'الرئيسية',
      'nav.menu': 'القائمة',
      'nav.gallery': 'المعرض',
      'nav.about': 'من نحن',
      'nav.contact': 'تواصل معنا',
      'lang.trigger_label': 'تغيير اللغة',
      'lang.menu_label': 'اللغة',
      'lang.en': 'English',
      'lang.ar': 'العربية',
      'menu_toggle.aria': 'فتح القائمة',
      'hero.aria_label': 'قسم راموز الرئيسي',
      'hero.eyebrow': 'تأسست في مشهد، والآن في مسقط',
      'hero.line1': 'كل يوم مع',
      'hero.brand_name': 'راموز كافيه',
      'hero.copy': 'حبوبنا، أفراننا، آلاتنا... من أجل صباحك.',
      'hero.cta_menu': 'استكشف قائمتنا',
      'hero.cta_gallery': 'شاهد المعرض',
      'hero.scroll_cue': 'مرر للأسفل لعرض القائمة',
      'ticker.aria_label': 'خدمات راموز',
      'ticker.1': 'نحمّص القهوة منذ مشهد',
      'ticker.2': 'نخبز قبل أن تستيقظ',
      'ticker.3': 'الآلات التي تعمل خلف عدادات أخرى',
      'ticker.4': 'تسعة فروع، وصفة واحدة',
      'ticker.5': 'مدرسة للباريستا في الخلف',
      'ticker.6': 'تأسست عام 2016، والآن في مسقط',
      'menu.eyebrow': 'قائمتنا',
      'menu.heading1': 'طعمها رائع، و',
      'menu.heading_em': 'مظهرها أروع',
      'menu.subtitle': '{n} صنفًا، ابحث أو صفِّ للوصول إلى طلبك مباشرة.',
      'menu.search_label': 'البحث في القائمة',
      'menu.search_placeholder': 'ابحث: إسبريسو، شاي أسود، تيراميسو…',
      'menu.search_clear': 'مسح البحث',
      'menu.tabs_aria': 'فئات القائمة',
      'menu.panel_full': 'القائمة الكاملة',
      'menu.unavailable': 'غير متوفر',
      'menu.cat.all': 'الكل',
      'menu.cat.coffee-base': 'القهوة',
      'menu.cat.tea-matcha': 'الشاي والماتشا',
      'menu.cat.cold': 'المشروبات الباردة',
      'menu.cat.bites': 'وجبات خفيفة',
      'menu.cat.fit': 'صحي',
      'menu.expand_all': 'توسيع الكل',
      'menu.collapse_all': 'طي الكل',
      'menu.expand_all_aria': 'توسيع كل الفئات',
      'menu.collapse_all_aria': 'طي كل الفئات',
      'menu.empty_prefix': 'لا توجد أصناف مطابقة لـ“',
      'menu.empty_suffix': '”. جرّب قهوة أو شاي أو كرواسون.',
      'gallery.eyebrow': 'المعرض',
      'gallery.heading1': 'لقطات من الواجهة البحرية، ',
      'gallery.heading_em': 'لحظات مع راموز',
      'gallery.cat.drinks': 'المشروبات',
      'gallery.cat.space': 'الأجواء',
      'gallery.cat.craft': 'الحرفة',
      'gallery.cat.moments': 'لحظات',
      'gallery.1.alt': 'صينية تيك أواي تحتوي على ماتشا وقهوة مثلجة مزينة بالورد',
      'gallery.1.cap': 'تيك أواي بلمسة أنيقة',
      'gallery.2.alt': 'صورة حملة «كن جريئًا» لمشروب توت متناثر',
      'gallery.2.cap': 'كن جريئًا',
      'gallery.3.alt': 'ميلك شيك كراميل أمام أشجار النخيل',
      'gallery.3.cap': 'كراميل تحت النخيل',
      'gallery.4.alt': 'صالة داخلية دافئة بلون البيج مع عداد المخبوزات',
      'gallery.4.cap': 'الصالة الداخلية',
      'gallery.5.alt': 'بار حجري أبيض بالنكهات والمطاحن ومصباح دافئ',
      'gallery.5.cap': 'البار الحجري',
      'gallery.6.alt': 'ماكينة إسبريسو إيطالية XLVI على الكاونتر الحجري',
      'gallery.6.cap': 'ماكينة XLVI',
      'gallery.7.alt': 'مقاعد بجانب النافذة بإطلالة على النخيل',
      'gallery.7.cap': 'نافذة على النخيل',
      'gallery.8.alt': 'طاولات التراس وقت الغروب تحت النخيل',
      'gallery.8.cap': 'التراس عند الغروب',
      'gallery.9.alt': 'فنجان إسبريسو على الرخام تحت لافتة راموز المضيئة',
      'gallery.9.cap': 'إسبريسو أمام اللافتة',
      'gallery.10.alt': 'واجهة محل راموز مضاءة ليلاً بلافتة عربية',
      'gallery.10.cap': 'الواجهة البحرية ليلاً',
      'about.eyebrow': 'من نحن',
      'about.heading1': 'القصة وراء ',
      'about.slider_aria': 'قصة راموز',
      'about.prev_slide': 'الشريحة السابقة',
      'about.next_slide': 'الشريحة التالية',
      'about.1.kicker': 'القصة',
      'about.1.h3_1': 'أخَوان، ',
      'about.1.h3_em': 'فكرة واحدة',
      'about.1.p': 'قبل عشر سنوات، افتتح أخَوان مقهى صغيرًا في مشهد. تبعته تسعة فروع أخرى. والعاشر هنا، على واجهة مسقط البحرية.',
      'about.1.img1_alt': 'خريطة توضيحية لجميع فروع راموز، من مشهد إلى مسقط',
      'about.1.img2_alt': 'لافتة راموز كافيه ومخبز مضيئة ليلاً',
      'about.1.img3_alt': 'لافتة القط الزرقاء لراموز كافيه على واجهة المحل',
      'about.2.kicker': 'الحرفة',
      'about.2.h3_1': 'نحمّصها بأنفسنا، ',
      'about.2.h3_em': 'ونخبزها بحب',
      'about.2.p': 'بدأنا بتقديم قهوة لافاتسا. أما الآن فنستورد الحبوب، ونحمّصها باسمنا الخاص، ونخبز كل ما تراه في الفاترينة بأنفسنا.',
      'about.2.img1_alt': 'خبّاز في راموز يحمل صينية براوني طازج',
      'about.2.img2_alt': 'صينية كب كيك بالشوكولاتة وكوكيز من مخبز راموز',
      'about.2.img3_alt': 'أكياس حبوب قهوة راموز، مستوردة ومحمّصة تحت علامتنا الخاصة',
      'about.3.kicker': 'الشركة',
      'about.3.h3_1': 'أكثر من ',
      'about.3.h3_em': 'مجرد مقهى',
      'about.3.p': 'نورّد ماكينات إسبريسو إيطالية ومعدات باريستا لمقاهٍ في جميع أنحاء إيران. واحتفظنا لأنفسنا بالأفضل منها.',
      'about.3.img1_alt': 'أرفف صالة عرض راموز مليئة بمستلزمات الباريستا',
      'about.3.img2_alt': 'لقطة مقرّبة لرأس مجموعة ماكينة إسبريسو XLVI',
      'about.3.img3_alt': 'وصول ماكينة إسبريسو إيطالية XLVI في صندوق الشحن',
      'about.4.kicker': 'المدرسة',
      'about.4.h3_em': 'المدرسة',
      'about.4.p': 'القهوة حرفة، ونحن نعلّمها. من أول كوب تحضّره إلى أول مناوبة لك خلف بار حقيقي: دروس عملية، آلات حقيقية، وشهادة موقّعة من الأشخاص الذين دربوك.',
      'about.4.img1_alt': 'طلاب في صف باريستا بمدرسة راموز',
      'about.4.img2_alt': 'طالب في مدرسة راموز يتدرب على سكب الحليب',
      'about.4.img3_alt': 'باريستا يرتدي مريلة مدرسة راموز',
      'contact.eyebrow': 'تواصل معنا',
      'contact.heading1': 'تعال وزرنا ',
      'contact.heading_em': 'على الواجهة البحرية',
      'contact.phone_label': 'الهاتف',
      'contact.phone_value': '+٩٦٨ ٧٨٤٤ ٩٠٠٠',
      'contact.phone_cta': 'اضغط للاتصال ←',
      'contact.instagram_label': 'إنستغرام',
      'contact.instagram_cta': 'اضغط للمتابعة ←',
      'contact.location_label': 'الموقع',
      'contact.location_value': 'واجهة راموز البحرية، مسقط، عُمان',
      'contact.location_cta': 'احصل على الاتجاهات ←',
      'contact.hours_label': 'ساعات العمل',
      'contact.hours.1': 'الأحد–الأربعاء: ٦:٣٠ ص–١٢:٣٠ ص',
      'contact.hours.2': 'الخميس: ٦:٣٠ ص–١:٣٠ ص',
      'contact.hours.3': 'الجمعة: ٨:٠٠ ص–١:٣٠ ص',
      'contact.hours.4': 'السبت: ٨:٠٠ ص–١٢:٣٠ ص',
      'contact.map_title': 'خريطة موقع راموز كافيه',
      'footer.logo_alt': 'راموز كافيه',
      'footer.tag': 'مقهى، مخبز، محمصة، مدرسة، والشركة التي تقف خلف الآلات. تأسسنا في مشهد قبل عشر سنوات، والآن على واجهة مسقط البحرية.',
      'footer.explore': 'استكشف',
      'footer.nav_aria': 'تذييل الصفحة',
      'footer.craft_title': 'حرفتنا',
      'footer.craft.1': 'قهوة مختصة',
      'footer.craft.2': 'مخبوزات طازجة',
      'footer.craft.3': 'تحميص داخلي',
      'footer.craft.4': 'مدرسة راموز للباريستا',
      'footer.craft.5': 'ماكينات إسبريسو ومعدات',
      'footer.visit_title': 'زوروا فرعنا',
      'footer.rights': 'Ramouz Café. All rights reserved.',
      'footer.admin_link': 'For admins',
      'footer.instagram_aria': 'راموز كافيه على إنستغرام',
      'footer.back_to_top': 'العودة إلى الأعلى',
    },
  };

  function getCurrentLang() {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl === 'ar' || fromUrl === 'en') return fromUrl;
    return localStorage.getItem(STORAGE_KEY) || 'en';
  }

  function applyTranslations(lang) {
    const dict = translations[lang] || translations.en;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      let val = dict[el.getAttribute('data-i18n')];
      if (val == null) return;
      if (el.hasAttribute('data-i18n-count')) {
        const n = (el.textContent.match(/\d+/) || [''])[0];
        val = val.replace('{n}', lang === 'ar' ? toArabicDigits(n) : n);
      }
      el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      let map;
      try { map = JSON.parse(el.getAttribute('data-i18n-attr')); } catch { return; }
      Object.entries(map).forEach(([attr, key]) => {
        if (dict[key] != null) el.setAttribute(attr, dict[key]);
      });
    });

    if (lang === 'ar') {
      document.querySelectorAll('[data-i18n-digits]').forEach(el => {
        el.textContent = toArabicDigits(el.textContent);
      });
    }
  }

  function syncUrlToLang(lang) {
    const params = new URLSearchParams(location.search);
    const urlLang = params.get('lang');
    if (lang === 'ar' && urlLang !== 'ar') {
      params.set('lang', 'ar');
    } else if (lang === 'en' && urlLang) {
      params.delete('lang');
    } else {
      return;
    }
    const qs = params.toString();
    history.replaceState(null, '', `${location.pathname}${qs ? `?${qs}` : ''}${location.hash}`);
  }

  function setLanguage(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    const url = new URL(location.href);
    if (lang === 'ar') url.searchParams.set('lang', 'ar');
    else url.searchParams.delete('lang');
    location.href = url.toString();
  }

  const lang = getCurrentLang();
  applyTranslations(lang);
  syncUrlToLang(lang);

  // Let other scripts (e.g. main.js's expand/collapse toggle) look up
  // translations for text they generate dynamically at runtime.
  window.RamouzI18n = {
    lang,
    t(key) {
      const val = (translations[lang] || translations.en)[key];
      return val != null ? val : (translations.en[key] || key);
    },
    digits(str) {
      return lang === 'ar' ? toArabicDigits(str) : str;
    },
  };

  // ---- language switcher UI ----
  const langSelect = document.querySelector('[data-lang-select]');
  const langTrigger = document.querySelector('[data-lang-trigger]');
  const langMenu = document.querySelector('[data-lang-menu]');
  if (langSelect && langTrigger && langMenu) {
    const langOptions = [...langMenu.querySelectorAll('button[data-lang]')];
    const triggerFlag = langTrigger.querySelector('.lang-flag');
    const triggerLabel = langTrigger.querySelector('span:not(.lang-flag)');

    const syncTrigger = activeLang => {
      if (triggerFlag) triggerFlag.textContent = flagByLang[activeLang];
      if (triggerLabel) triggerLabel.textContent = translations[activeLang][`lang.${activeLang}`];
      langOptions.forEach(o => {
        const on = o.dataset.lang === activeLang;
        o.classList.toggle('active', on);
        o.closest('li')?.setAttribute('aria-selected', String(on));
      });
    };
    syncTrigger(lang);

    const closeLangMenu = () => {
      langSelect.classList.remove('open');
      langTrigger.setAttribute('aria-expanded', 'false');
    };

    langTrigger.addEventListener('click', () => {
      const willOpen = !langSelect.classList.contains('open');
      langSelect.classList.toggle('open', willOpen);
      langTrigger.setAttribute('aria-expanded', String(willOpen));
    });

    langOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const next = opt.dataset.lang;
        if (next === lang) { closeLangMenu(); return; }
        setLanguage(next);
      });
    });

    document.addEventListener('click', e => {
      if (!langSelect.contains(e.target)) closeLangMenu();
    });
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && langSelect.classList.contains('open')) {
        closeLangMenu();
        langTrigger.focus();
      }
    });
  }
})();
