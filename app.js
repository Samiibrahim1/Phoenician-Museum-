const sections = Array.from(document.querySelectorAll('.page'));
const navItems = Array.from(document.querySelectorAll('[data-target]'));
const quizOptions = Array.from(document.querySelectorAll('.quiz-option'));
const translateBtn = document.getElementById('translateBtn');
const englishExtraSections = Array.from(document.querySelectorAll('.english-extra'));
const languageTargetButtons = Array.from(document.querySelectorAll('[data-target-en][data-target-ar]'));

// Translation dictionary
const translations = {
  'Home': 'الصفحة الرئيسية',
  'Alphabet': 'الأبجدية',
  'Evolution I': 'التطور الأول',
  'Evolution II': 'التطور الثاني',
  'Meaning I': 'المعنى الأول',
  'Meaning II': 'المعنى الثاني',
  'Quiz': 'اختبار',
  'EN/AR': 'AR/EN',
};

let isArabic = false;

function showDefaultSections() {
  sections.forEach((section) => {
    section.hidden = section.classList.contains('english-extra');
  });
}

function showSingleSection(sectionId) {
  sections.forEach((section) => {
    section.hidden = section.id !== sectionId;
  });
}

function updateLanguageTargets() {
  languageTargetButtons.forEach((button) => {
    button.dataset.target = isArabic ? button.dataset.targetAr : button.dataset.targetEn;
  });
}

function toggleLanguage() {
  isArabic = !isArabic;
  const html = document.documentElement;
  
  if (isArabic) {
    html.setAttribute('lang', 'ar');
    html.setAttribute('dir', 'rtl');
    translateBtn.classList.add('active');
    translateBtn.textContent = translations['EN/AR'];
    showDefaultSections();
    updatePageImages('ar');
  } else {
    html.setAttribute('lang', 'en');
    html.removeAttribute('dir');
    translateBtn.classList.remove('active');
    translateBtn.textContent = 'EN/AR';
    showDefaultSections();
    updatePageImages('en');
  }

  updateLanguageTargets();
}

function updatePageImages(lang) {
  const images = document.querySelectorAll('.page__image');

  const toArabicMap = {
    './assets/pages/page-1n.png': './assets/pages/ar/page-1.png',
    './assets/pages/page-2.png': './assets/pages/ar/page-2.png',
    './assets/pages/page-3.png': './assets/pages/ar/page-3.png',
    './assets/pages/page-4.png': './assets/pages/ar/page-4.png',
    './assets/pages/page-5.png': './assets/pages/ar/page-5.png',
    './assets/pages/page-6.png': './assets/pages/ar/page-6.png',
    './assets/pages/page-7.png': './assets/pages/ar/page-7.png',
  };

  const toEnglishMap = {
    './assets/pages/ar/page-1.png': './assets/pages/page-1n.png',
    './assets/pages/ar/page-2.png': './assets/pages/page-2.png',
    './assets/pages/ar/page-3.png': './assets/pages/page-3.png',
    './assets/pages/ar/page-4.png': './assets/pages/page-4.png',
    './assets/pages/ar/page-5.png': './assets/pages/page-5.png',
    './assets/pages/ar/page-6.png': './assets/pages/page-6.png',
    './assets/pages/ar/page-7.png': './assets/pages/page-7.png',
  };

  images.forEach((img) => {
    let src = img.getAttribute('src');
    if (!src) {
      return;
    }

    if (lang === 'ar') {
      src = toArabicMap[src] ?? src;
    } else {
      src = toEnglishMap[src] ?? src;
    }
    img.setAttribute('src', src);
  });
}

translateBtn?.addEventListener('click', toggleLanguage);

function setupQuizSelection() {
  quizOptions.forEach((option) => {
    option.setAttribute('aria-pressed', 'false');

    option.addEventListener('click', () => {
      const questionId = option.dataset.question;
      if (!questionId) {
        return;
      }

      quizOptions.forEach((item) => {
        if (item.dataset.question !== questionId) {
          return;
        }

        item.classList.remove('is-selected');
        item.setAttribute('aria-pressed', 'false');
      });

      option.classList.add('is-selected');
      option.setAttribute('aria-pressed', 'true');
    });
  });
}

function setActiveSection(sectionId) {
  navItems.forEach((item) => {
    const isActive = item.dataset.target === `#${sectionId}`;
    item.classList.toggle('is-active', isActive);
  });

  sections.forEach((section) => {
    section.classList.toggle('is-focus', section.id === sectionId);
  });
}

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    if (!isArabic && item.dataset.singlePage === 'true') {
      const sectionId = (item.dataset.target || '').replace('#', '');
      if (!sectionId) {
        return;
      }

      showSingleSection(sectionId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection(sectionId);
      return;
    }

    const target = document.querySelector(item.dataset.target);
    if (!target) {
      return;
    }

    showDefaultSections();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(target.id);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

    if (visible) {
      setActiveSection(visible.target.id);
    }
  },
  {
    root: null,
    threshold: [0.25, 0.4, 0.55, 0.7],
    rootMargin: '-15% 0px -50% 0px',
  }
);

sections.forEach((section) => observer.observe(section));

window.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
    return;
  }

  const visibleSections = sections.filter((section) => !section.hidden);
  if (visibleSections.length === 0) {
    return;
  }

  const currentIndex = visibleSections.findIndex((section) => section.classList.contains('is-focus'));
  const nextIndex =
    event.key === 'ArrowDown'
      ? Math.min(visibleSections.length - 1, Math.max(0, currentIndex + 1))
      : Math.max(0, currentIndex - 1);

  const nextSection = visibleSections[nextIndex];
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

if (sections.length > 0) {
  setActiveSection(sections[0].id);
}

showDefaultSections();
updateLanguageTargets();
setupQuizSelection();
