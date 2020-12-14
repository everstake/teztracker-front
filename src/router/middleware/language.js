import { translation } from '@/plugins/translation';
import { constants } from '@/plugins/constants';

export default function language({ to, next, nextMiddleware }) {
  const { language: routeLanguage } = to.params;
  const defaultLanguage = translation.getUserLang().langNoISO;
  const appLanguage = translation.currentLanguage;
  const routeLanguageNotAllowed = !constants.SUPPORTED_LANGUAGES.includes(routeLanguage);

  if (!routeLanguage || routeLanguageNotAllowed) {
    to.params.language = defaultLanguage;
    return next({ ...to });
  }

  if (routeLanguage !== appLanguage) {
    translation.currentLanguage = routeLanguage;
  }

  return nextMiddleware();
}
