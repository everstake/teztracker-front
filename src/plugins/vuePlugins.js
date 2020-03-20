import Vue from "vue";
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
  BForm
} from "bootstrap-vue";
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText
} from "@fortawesome/vue-fontawesome";
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
  faCog
} from "@fortawesome/free-solid-svg-icons";
import {
  faLightbulb,
  faStar,
  faFolder,
  faUser,
  faChartBar,
  faBookmark,
  faGem,
  faHourglass,
  faTimesCircle
} from "@fortawesome/free-regular-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { dom } from "@fortawesome/fontawesome-svg-core";
import router from "../router";
import VueGtag from "vue-gtag";

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

Vue.component('b-form', BForm)

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
  faCog
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
  faTimesCircle
);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("font-awesome-layers", FontAwesomeLayers);
Vue.component("font-awesome-layers-text", FontAwesomeLayersText);

Vue.use(VueGtag, { config: { id: "UA-159555120-1" } }, router);
