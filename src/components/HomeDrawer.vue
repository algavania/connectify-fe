<template>
  <v-navigation-drawer v-model="drawer" class="background" app v-if="user.id">
    <v-list>
      <v-list-item
        v-for="item in links"
        :key="item.text"
        link
        :to="item.text == 'Logout' ? null :item.route"
        @click="item.text == 'Logout' ? logout() : null"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { EventBus } from "@/event-bus";

export default {
  name: "HomeDrawer",
  data: () => ({
    drawer: null,
    user: {},
    links: [
      {
        icon: "mdi-home",
        text: "Home",
        route: "/home"
      },
      {
        icon: "mdi-account",
        text: "Profile",
        route: ""
      },
      {
        icon: "mdi-logout",
        text: "Logout",
      },
    ],
  }),
  mounted() {
    EventBus.$on("updateHomeDrawer", () => this.getUser());
    this.getUser();
  },
  methods: {
    getUser() {
        this.user = JSON.parse(localStorage.getItem("user"));
        this.links[1].route = `/${this.user.username}`;
    },
    logout() {
        localStorage.clear();
        this.user = {};
        this.$router.push({ name: "main" });
    },
  }
};
</script>

<style>
</style>