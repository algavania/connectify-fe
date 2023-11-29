<template>
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <v-dialog v-model="loading" fullscreen transition="fade-transition">
      <v-container
        fluid
        fill-height
        style="background-color: rgba(255, 255, 255, 0.5)"
      >
        <v-layout justify-center align-center>
          <center>
            <v-row :class="percentage ? 'white pa-3 pt-6 border-12' : ''">
              <v-col cols="12">
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </v-col>
              <v-col cols="12" v-if="percentage"
                ><h2 class="primary--text">{{ percentage }}%</h2>
                <div class="primary--text" v-if="percentageDescription">
                  ({{ percentageDescription }})
                </div>
              </v-col>
            </v-row>
          </center>
        </v-layout>
      </v-container>
    </v-dialog>
    <v-main>
      <HomeDrawer />
      <router-view />
    </v-main>
    <v-snackbar :color="color" v-model="snackbar" :timeout="timeout">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import HomeDrawer from "./components/HomeDrawer.vue";
import { EventBus } from "./event-bus";

export default {
  name: "App",
  components: {
    HomeDrawer,
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
  },
  data: () => ({
    snackbar: false,
    text: "",
    timeout: 3000,
    color: "red",
    loading: false,
    percentage: 0,
    percentageDescription: "",
  }),
  mounted() {
    EventBus.$on("showSnackbar", (text, color) => {
      this.text = text;
      this.color = color;
      this.snackbar = true;
    });
    EventBus.$on("startLoading", () => (this.loading = true));
    EventBus.$on("stopLoading", () => {
      this.loading = false;
      this.percentage = 0;
    });
    EventBus.$on(
      "setPercentage",
      (percentage) => (this.percentage = percentage)
    );
    EventBus.$on(
      "setPercentageDescription",
      (desc) => (this.percentageDescription = desc)
    );
  },
};
</script>

<style>
* {
  text-transform: none !important;
}

body {
  background-color: black;
}

.archivo-font {
  font-family: "Archivo Black", sans-serif !important;
}

.heading-size {
  font-size: 3rem;
  line-height: 3.4rem;
}

.subheading-size {
  font-size: 2.2rem;
  line-height: 3rem;
}

.small-heading-size {
  font-size: 1.8rem;
  line-height: 3rem;
}

.smaller-heading-size {
  font-size: 1.6rem;
  line-height: 3rem;
}

.label-size {
  font-size: 1.3rem;
  line-height: 1.4rem;
}

.small-label-size {
  font-size: 1.2rem;
  line-height: 1.4rem;
}

.big-body-size {
  font-size: 1.1rem;
}

.small-body-size {
  font-size: 0.7rem;
  line-height: 1rem;
}

a {
  color: "#219aee";
  text-decoration: none;
  cursor: pointer;
}

.v-btn {
  padding-top: 1.3rem !important;
  padding-bottom: 1.3rem !important;
}
</style>
