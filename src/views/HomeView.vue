<template>
  <div id="inspire" class="background fill-height" style="width: 100%;">
    <v-row>
      <v-col cols="8">
        <div>
          <div>
            <v-divider class="mb-7"></v-divider>
            <v-row>
              <v-col cols="auto"></v-col>
              <v-avatar color="primary">
                <img v-if="userDetail.photo_url" :src="`${this.$baseUrl}/${userDetail.photo_url}`" alt="">
              </v-avatar>
              <v-col>
                <v-textarea
                  class="pt-0 mt-0 tweet-input"
                  counter="280"
                  rows="3"
                  auto-grow
                  v-model="postText"
                  placeholder="What is happening?!"
                ></v-textarea>
                <div class="d-flex justify-end mt-3">
                  <v-btn
                    @click="sendPost"
                    :disabled="!postText || postText.length > 280"
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
                <router-link :to="`/${post.user.username}/post/${post.id}`">
                  <PostComponent @deleteData="deleteData" :post="post" />
                </router-link>
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
  </div>
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
    postText: "",
    userDetail: {},
    posts: [],
  }),
  mounted() {
    this.getUser();
    this.getPosts();
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    deleteData(id) {
      this.posts = this.posts.filter(obj => obj.id !== id);
    },
    async getUser() {
      EventBus.$emit("startLoading");
      try {
        this.user = JSON.parse(localStorage.getItem("user"));
        const res = await axios.get(`${this.$api}/user/${this.user.username}`);
        console.log("res", res);
        this.user = res.data.data;
        localStorage.setItem("user", JSON.stringify(this.user));
      } catch (e) {
        EventBus.$emit("showSnackbar", e.response.data.message, "red");
      }
      EventBus.$emit("stopLoading");
      try {
        const userDetailRes = await axios.get(
          `${this.$api}/user-detail/${this.user.id}`
        );
        this.userDetail = userDetailRes.data.data;
      } catch (e) {
        console.log(e);
      }
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
        const res = await axios.post(
          `${this.$api}/post`,
          {
            content: this.postText,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("res",res);
        this.posts.unshift(res.data.data);
        EventBus.$emit("showSnackbar", "Post has been sent!", "green");
        this.postText = "";
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