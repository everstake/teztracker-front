import Vue from "vue";

const helpers = {
  isLocalStorageAvailable() {
    try {
      localStorage;
      return true;
    } catch (e) {
      return false;
    }
  },
  formatXtz(value) {
    return value / Vue.prototype.$constants.XTZ;
  }
};

Vue.use({
  install() {
    Vue.prototype.$helpers = helpers;
  }
});
