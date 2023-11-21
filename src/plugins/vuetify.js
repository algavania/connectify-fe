import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi",
  },
  theme: {
    dark: true,
    themes: {
      dark: {
        background: "#040404",
        primary: "#219aee",
        grey: "#71767b",
      },
    },
  },
});
