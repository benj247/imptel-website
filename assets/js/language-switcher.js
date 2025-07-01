// Language Switcher - IMPTEL Website

// Language configuration
const LANGUAGES = {
    pt: {
        code: 'pt',
        name: 'Português',
        default: true
    },
    en: {
        code: 'en',
        name: 'English',
        default: false
    }
};

// Initialize language switcher
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all scripts are loaded
    setTimeout(function() {
        initLanguageSwitcher();
    }, 10);
});

function initLanguageSwitcher() {
    // Get current language from localStorage or default
    const currentLang = utils.storage.get('selectedLanguage') || 'pt';
    
    // Set initial language
    setLanguage(currentLang);
    
    // Setup language switcher buttons
    const langButtons = document.querySelectorAll('.language-switcher button');
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            loadTranslations(lang); // Load translations immediately
        });
    });
    
    // Load translations
    loadTranslations(currentLang);
}

// Set language
function setLanguage(lang) {
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Store in localStorage
    utils.storage.set('selectedLanguage', lang);
    
    // Update active button
    updateLanguageSwitcher(lang);
}

// Update language switcher UI
function updateLanguageSwitcher(lang) {
    const buttons = document.querySelectorAll('.language-switcher button');
    buttons.forEach(button => {
        if (button.getAttribute('data-lang') === lang) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Load translations
function loadTranslations(lang) {
    // Check if translations are loaded
    if (typeof window.IMPTEL_TRANSLATIONS === 'undefined') {
        console.error('Translations not loaded. Make sure translations.js is included before language-switcher.js');
        return;
    }
    
    const translations = window.IMPTEL_TRANSLATIONS;
    
    if (translations[lang]) {
        applyTranslations(translations[lang]);
    } else {
        console.error('No translations found for language:', lang);
    }
}

// Apply translations to elements
function applyTranslations(translations) {
    // Find all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedProperty(translations, key);
        
        if (translation) {
            // Check if it's an input element
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.getAttribute('placeholder')) {
                    element.setAttribute('placeholder', translation);
                } else {
                    element.value = translation;
                }
            } else {
                // Check if translation contains HTML (like <br> tags)
                if (translation.includes('<br>')) {
                    element.innerHTML = translation;
                } else {
                    // For other elements, update text content
                    element.textContent = translation;
                }
            }
        }
    });
    
    // Update page title if translation exists
    if (translations.pageTitle) {
        document.title = translations.pageTitle;
    }
    
    // Update meta description if exists
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && translations.metaDescription) {
        metaDescription.setAttribute('content', translations.metaDescription);
    }
}

// Helper function to get nested object property
function getNestedProperty(obj, key) {
    return key.split('.').reduce((p, c) => p && p[c] || null, obj);
}

// Public API for dynamic content
window.i18n = {
    // Get current language
    getCurrentLanguage: function() {
        return utils.storage.get('selectedLanguage') || 'pt';
    },
    
    // Change language programmatically
    changeLanguage: function(lang) {
        if (LANGUAGES[lang]) {
            setLanguage(lang);
            loadTranslations(lang);
        }
    },
    
    // Translate a specific key
    translate: function(key) {
        const lang = this.getCurrentLanguage();
        if (typeof window.IMPTEL_TRANSLATIONS === 'undefined') {
            return key;
        }
        const translations = window.IMPTEL_TRANSLATIONS;
        return getNestedProperty(translations[lang], key) || key;
    },
    
    // Check if language is RTL (for future Arabic support)
    isRTL: function() {
        const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
        return rtlLanguages.includes(this.getCurrentLanguage());
    }
};

// Update language on browser back/forward
window.addEventListener('popstate', function() {
    const lang = utils.getQueryParam('lang') || utils.storage.get('selectedLanguage') || 'pt';
    setLanguage(lang);
    loadTranslations(lang);
});

// Watch for dynamic content changes
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.querySelector('[data-i18n]')) {
                    const lang = i18n.getCurrentLanguage();
                    loadTranslations(lang);
                }
            });
        }
    });
});

// Start observing the document with the configured parameters
observer.observe(document.body, {
    childList: true,
    subtree: true
});