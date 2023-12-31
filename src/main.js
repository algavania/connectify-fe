import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import VueGlobalVar from "vue-global-var";
import EventBus from "./event-bus";
import axios from "axios";
import linkify from "vue-linkify";

Vue.config.productionTip = false;
Vue.prototype.$bus = EventBus;
Vue.directive("linkified", linkify);

Vue.use(VueGlobalVar, {
  globals: {
    $baseUrl: "http://localhost:5000",
    $api: "http://localhost:5000/api",
  },
});

Vue.mixin({
  mounted() {
    axios.defaults.headers.common = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
  },
});

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
