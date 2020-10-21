import { constants } from '@/plugins/constants';
const { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } = constants;
import i18n from '@/plugins/i18n';

const translation = {
  get defaultLanguage() {
    return DEFAULT_LANGUAGE;
  },
  get supportedLanguages() {
    return SUPPORTED_LANGUAGES;
  },
  get currentLanguage() {
    return i18n.locale;
  },
  set currentLanguage(language) {
    i18n.locale = language;
    localStorage.setItem('lang', language);
  },
  getUserLang() {
    const localStorageLanguage = localStorage.getItem('lang');
    if (this.isLangSupported(localStorageLanguage)) {
      return {
        lang: localStorageLanguage,
        langNoISO: localStorageLanguage,
      };
    } else {
      const lang = window.navigator.language || window.navigator.userLanguage || this.defaultLanguage
      return {
        lang: lang,
        langNoISO: lang.split('-')[0],
      };
    }
  },
  isLangSupported(language) {
    return this.supportedLanguages.includes(language);
  },
};

export { translation };
