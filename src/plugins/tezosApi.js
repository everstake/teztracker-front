import Vue from "vue";
import api from "@/services/api.service";

Vue.use({
  install() {
    Vue.prototype.$api = api;
  }
});
