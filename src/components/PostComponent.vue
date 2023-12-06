<template>
  <div class="white--text">
    <div class="d-flex pa-5">
      <router-link :to="`/${post.user.username}`">
        <v-avatar color="primary">
          <img
            v-if="post.user_detail.photo_url"
            :src="`${this.$baseUrl}/${post.user_detail.photo_url}`"
            alt=""
          />
        </v-avatar>
      </router-link>
      <div class="ml-3" style="width: 95%; position: relative">
        <div class="d-flex justify-space-between">
          <div class="grey--text">
            <span class="font-weight-bold white--text">{{
              post.user_detail.name
            }}</span>
            @{{ post.user.username }} - <TimeAgo :datetime="post.created_at" />
          </div>
          <div
            style="position: absolute; right: 0"
            v-if="post.user.id == user.id"
          >
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  to="#"
                  icon
                  dark
                  v-bind="attrs"
                  v-on="on"
                  x-small
                  :ripple="false"
                >
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="deletePost">
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>

        <div>
          <div v-html="post.content" v-linkified></div>
          <div v-if="post.media1" class="mt-5">
            <v-row>
              <v-col
                :class="i > 1 && !post.media2 ? 'd-none' : ''"
                :cols="post.media2 ? '6' : '12'"
                v-for="i in 4"
                :key="i"
              >
                <div v-if="`${post[`media${i}`]}`.toString() != 'null'">
                  <a
                    :href="`${$baseUrl}/${post[`media${i}`]}`"
                    target="__blank"
                  >
                    <v-img
                      :src="`${$baseUrl}/${post[`media${i}`]}`"
                      height="100%"
                      class="rounded-lg"
                      :width="post.media2 ? '100%' : '30rem'"
                      :style="`height: ${post.media2 ? '180px' : '292px'}`"
                      cover
                    ></v-img>
                  </a>
                </div>
              </v-col>
            </v-row>
          </div>

          <div class="d-flex mt-3">
            <v-icon>mdi-comment</v-icon>
            <div class="ml-1">
              {{ post.comment_count ? post.comment_count : 0 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TimeAgo } from "vue2-timeago";
import axios from "axios";
import EventBus from "@/event-bus";

export default {
  name: "PostComponent",
  props: ["post"],
  components: {
    TimeAgo,
  },
  data: () => ({
    user: {},
  }),
  watch: {
    post: {
      handler: "parseText",
      immediate: true,
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
  },
  methods: {
    parseText() {},
    async deletePost() {
      try {
        await axios.delete(`${this.$api}/post/${this.post.id}`);
        this.$emit("deleteData", this.post.id);
      } catch (e) {
        EventBus.$emit("showSnackbar", e.response.data.message, "red");
      }
    },
  },
};
</script>

<style></style>
