<template>
  <div>
    <PostComponent :post="post" :key="postKey" />
    <PostTweetComponent
      class="mr-6"
      v-if="userDetail"
      :userDetail="userDetail"
      :parentPostId="post.id"
      @addPosts="addPosts"
    />
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
</template>

<script>
/* eslint-disable */
import { EventBus } from "@/event-bus";
import PostComponent from "@/components/PostComponent.vue";
import PostTweetComponent from "@/components/PostTweetComponent.vue";
import axios from "axios";

export default {
  name: "DetailPostView",
  props: ["postProp", "userProp"],
  components: {
    PostComponent,
    PostTweetComponent,
  },
  data: () => ({
    post: {},
    postKey: 0,
    userDetail: {},
    currentUser: {},
    posts: [],
  }),
  mounted() {
    this.functionOnMounted();
  },
  watch: {
    $route(_, __) {
      this.functionOnMounted();
    },
  },
  methods: {
    addPosts(data) {
      this.posts.unshift(data);
      if (!this.post.comment_count) {
        this.post.comment_count = 0;
      }
      this.post.comment_count++;
      this.postKey++;
    },
    deleteData(id) {
      this.posts = this.posts.filter((obj) => obj.id !== id);
    },
    async functionOnMounted() {
      this.post = this.postProp;
      if (!this.post) {
        await this.getPostByID();
      }
      this.user = this.userProp;
      if (!this.user) {
        await this.getUser();
      }
      await this.getPosts();
    },
    async getUser() {
      EventBus.$emit("startLoading");
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        console.log("post", this.post);
        const res = await axios.get(
          `${this.$api}/user-detail/${this.post.user_id}`
        );
        console.log("res", res);
        this.user = res.data.data;
      } catch (e) {
        EventBus.$emit("showSnackbar", e.response.data.message, "red");
      }
      EventBus.$emit("stopLoading");
      try {
        const userDetailRes = await axios.get(
          `${this.$api}/user-detail/${user.id}`
        );
        this.userDetail = userDetailRes.data.data;
        console.log(this.userDetail);
      } catch (e) {
        console.log(e);
      }
    },
    async getPostByID() {
      EventBus.$emit("startLoading");
      try {
        const res = await axios.get(
          `${this.$api}/post/${this.$route.params.id}`
        );
        this.post = res.data.data;
      } catch (e) {
        EventBus.$emit("showSnackbar", e.response.data.message, "red");
      }
      EventBus.$emit("stopLoading");
    },
    async getPosts() {
      try {
        const res = await axios.get(`${this.$api}/post/${this.post.id}/reply`);
        this.posts = res.data.data;
      } catch (e) {
        EventBus.$emit("showSnackbar", e.response.data.message, "red");
      }
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
