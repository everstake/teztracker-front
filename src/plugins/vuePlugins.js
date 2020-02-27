import Vue from 'vue';
import {
  LinkPlugin,
  TablePlugin,
  PaginationPlugin,
  ProgressPlugin,
  TooltipPlugin
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
  faAngleDoubleRight
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

Vue.use(LinkPlugin);
Vue.use(TablePlugin);
Vue.use(PaginationPlugin);
Vue.use(ProgressPlugin);
Vue.use(TooltipPlugin);

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
  faAngleDoubleRight
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
