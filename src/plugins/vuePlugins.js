import Vue from 'vue';
import {
  LinkPlugin,
  TablePlugin,
  PaginationPlugin,
  ProgressPlugin,
  TooltipPlugin,
  DropdownPlugin,
  ButtonPlugin,
  CardPlugin,
  TabsPlugin,
  BreadcrumbPlugin,
  FormSelectPlugin,
  LayoutPlugin,
  FormGroupPlugin,
  FormCheckboxPlugin,
  NavbarPlugin,
  FormInputPlugin,
  FormPlugin,
  FormRadioPlugin,
  FormTextareaPlugin,
  ModalPlugin,
  ToastPlugin,
  PaginationNavPlugin,
  SkeletonPlugin,
  InputGroupPlugin,
  ButtonGroupPlugin,
  BadgePlugin,
} from 'bootstrap-vue';
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText,
} from '@fortawesome/vue-fontawesome';
import {
  faSearch,
  faCaretUp,
  faCaretDown,
  faSpinner,
  faBars,
  faAngleDown,
  faCopy,
  faAngleLeft,
  faAngleRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faCog,
  faChevronLeft,
  faChevronRight,
  faGlobe,
  faEnvelope,
  faQuestionCircle,
  faSyncAlt,
  faUser as fasUser,
  faStar as fasStar,
  faPlus,
  faPencilAlt,
  faPencilRuler,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import {
  faLightbulb,
  faStar,
  faFolder,
  faUser,
  faChartBar,
  faBookmark,
  faGem,
  faHourglass,
  faTimesCircle,
} from '@fortawesome/free-regular-svg-icons';
import { faTwitter, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { dom } from '@fortawesome/fontawesome-svg-core';
import router from '../router';
import VueGtag from 'vue-gtag';
import FlagIcon from 'vue-flag-icon';
import VueGtm from 'vue-gtm';
import VueClipboard from 'vue-clipboard2';

Vue.use(LinkPlugin);
Vue.use(TablePlugin);
Vue.use(PaginationPlugin);
Vue.use(ProgressPlugin);
Vue.use(TooltipPlugin);
Vue.use(DropdownPlugin);
Vue.use(ButtonPlugin);
Vue.use(LayoutPlugin);
Vue.use(CardPlugin);
Vue.use(TabsPlugin);
Vue.use(BreadcrumbPlugin);
Vue.use(FormSelectPlugin);
Vue.use(FormGroupPlugin);
Vue.use(FormCheckboxPlugin);
Vue.use(NavbarPlugin);
Vue.use(FormInputPlugin);
Vue.use(FormRadioPlugin);
Vue.use(FormTextareaPlugin);
Vue.use(FormPlugin);
Vue.use(ModalPlugin);
Vue.use(FlagIcon);
Vue.use(ToastPlugin);
Vue.use(PaginationNavPlugin);
Vue.use(SkeletonPlugin);
Vue.use(InputGroupPlugin);
Vue.use(ButtonGroupPlugin);
Vue.use(BadgePlugin);

dom.watch();
library.add(
  faSearch,
  faSpinner,
  faCaretUp,
  faCaretDown,
  faBars,
  faAngleDown,
  faCopy,
  faAngleLeft,
  faAngleRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faCog,
  faChevronLeft,
  faChevronRight,
  faGlobe,
  faEnvelope,
  faQuestionCircle,
  faSyncAlt,
  fasUser,
  fasStar,
  faPlus,
  faPencilAlt,
  faPencilRuler,
  faBell,
);
library.add(
  faLightbulb,
  faStar,
  faFolder,
  faUser,
  faChartBar,
  faBookmark,
  faGem,
  faHourglass,
  faTimesCircle,
);
library.add(faTwitter, faTelegram);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('font-awesome-layers', FontAwesomeLayers);
Vue.component('font-awesome-layers-text', FontAwesomeLayersText);

Vue.use(VueGtag, { config: { id: 'UA-159555120-1' } }, router);
Vue.use(VueGtm, {
  id: 'GTM-KX6RPKS',
  debug: false, // Whether or not display console logs debugs (optional)
  loadScript: true, // Whether or not to load the GTM Script (Helpful if you are including GTM manually, but need the dataLayer functionality in your components) (optional)
  vueRouter: router, // Pass the router instance to automatically sync with router (optional)
});

Vue.use(VueClipboard);
