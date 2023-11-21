<template>
  <v-app id="inspire" class="background fill-height">
    <v-row>
      <v-col cols="8">
        <div>
          <div>
            <v-divider class="mb-7"></v-divider>
            <v-row>
              <v-col cols="auto"></v-col>
              <v-avatar color="primary"></v-avatar>
              <v-col>
                <v-textarea
                  class="pt-0 mt-0 tweet-input"
                  counter="280"
                  rows="3"
                  auto-grow
                  v-model="tweetText"
                  placeholder="What is happening?!"
                ></v-textarea>
                <div class="d-flex justify-end mt-3">
                  <v-btn
                    @click="sendPost"
                    :disabled="!tweetText || tweetText.length > 280"
                    :loading="isLoading"
                    rounded
                    color="primary"
                    >Post</v-btn
                  >
                </div>
              </v-col>
            </v-row>
            <v-divider class="mt-3"></v-divider>
            <div v-if="posts">
              <div v-for="post in posts" :key="post.id">
                <PostComponent class="pa-5" :post="post" />
                <v-divider></v-divider>
              </div>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="auto">
        <v-divider vertical></v-divider>
      </v-col>
      <v-col> Search </v-col>
    </v-row>
  </v-app>
</template>

<script>
import axios from "axios";
import EventBus from "@/event-bus";
import PostComponent from "@/components/PostComponent.vue";

export default {
  name: "HomeView",
  components: {
    PostComponent,
  },
  data: () => ({
    isLoading: false,
    tweetText: "",
    posts: [],
  }),
  mounted() {
    this.getPosts();
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    async getPosts() {
      try {
        const res = await axios.get(`${this.$api}/post`);
        this.posts = res.data.data;
      } catch (e) {
        EventBus.$emit("showSnackbar", e.response.data.message, "red");
      }
    },
    async sendPost() {
      try {
        this.isLoading = true;
        await axios.post(
          `${this.$api}/post`,
          {
            content: this.tweetText,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        EventBus.$emit("showSnackbar", "Post has been sent!", "green");
        this.tweetText = "";
      } catch (e) {
        EventBus.$emit("showSnackbar", e.response.data.message, "red");
      }
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.tweet-input::v-deep {
  textarea {
    max-height: 20rem;
    overflow: auto;
  }
}
</style>