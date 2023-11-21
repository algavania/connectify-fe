<template>
  <v-navigation-drawer v-model="drawer" class="background" app v-if="user.id">
    <v-list>
      <v-list-item
        v-for="[icon, text] in links"
        :key="icon"
        link
        @click="text == 'Logout' ? logout() : null"
      >
        <v-list-item-icon>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ text }}</v-list-item-title>
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
      ["mdi-home", "Home"],
      ["mdi-chat", "Messages"],
      ["mdi-account", "Profile"],
      ["mdi-account", "Logout"],
    ],
  }),
  mounted() {
    EventBus.$on("updateHomeDrawer", () => this.getUser());
    this.getUser();
  },
  methods: {
    getUser() {
        this.user = JSON.parse(localStorage.getItem("user"));
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