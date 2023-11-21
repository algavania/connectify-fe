<template>
  <div class="d-flex">
    <v-avatar color="primary"></v-avatar>
    <div class="ml-3" style="width: 100%; position: relative;">
      <div class="d-flex justify-space-between">
        <div class="grey--text">
          <span class="font-weight-bold white--text">{{
            post.user.username
          }}</span>
          @{{ post.user.username }} - <TimeAgo :datetime="post.created_at" />
        </div>
        <div style="position: absolute; right: 0;" v-if="post.user.id == user.id">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon dark v-bind="attrs" v-on="on" x-small ripple="false">
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(item, index) in items" :key="index">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>

      <div>{{ post.content }}</div>
    </div>
  </div>
</template>

<script>
import { TimeAgo } from "vue2-timeago";

export default {
  name: "PostComponent",
  props: ["post"],
  components: {
    TimeAgo,
  },
  data: () => ({
    items: [{ title: "Delete" }],
    user: {}
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
  }
};
</script>

<style>
</style>