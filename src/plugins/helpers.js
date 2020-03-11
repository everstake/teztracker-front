import Vue from "vue";

const helpers = {
  isLocalStorageAvailable() {
    try {
      localStorage;
      return true;
    } catch (e) {
      return false;
    }
  }
};

Vue.use({
  install() {
    Vue.prototype.$helpers = helpers;
  }
});
