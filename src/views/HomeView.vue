<template>
  <div id="inspire" class="background fill-height" style="width: 100%">
    <v-row>
      <v-col cols="8">
        <div>
          <div>
            <v-divider class="mb-7"></v-divider>
            <PostTweetComponent @addPosts="addPosts" :userDetail="userDetail" v-if="userDetail" />
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
      <v-col>
        <div class="pr-6 mt-8">
          <v-autocomplete
            v-model="value"
            :items="items"
            item-text="user.username"
            item-value="user.username"
            dense
            outlined
            label="Search User"
          ></v-autocomplete>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import EventBus from "@/event-bus";
import PostComponent from "@/components/PostComponent.vue";
import PostTweetComponent from "@/components/PostTweetComponent.vue";

export default {
  name: "HomeView",
  components: {
    PostComponent,
    PostTweetComponent
  },
  data: () => ({
    items: [],
    value: null,
    userDetail: {},
    posts: [],
  }),
  mounted() {
    this.getUser();
    this.getPosts();
    this.getAllUsers();
  },
  watch: {
    value(val, oldVal) {
      console.log(oldVal, val);
      console.log(val);
      if (val) {
        this.$router.push(`/${val}`);
      }
    },
  },
  methods: {
    addPosts(data) {
      this.posts.unshift(data);
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    deleteData(id) {
      this.posts = this.posts.filter((obj) => obj.id !== id);
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
    async getAllUsers() {
      try {
        const res = await axios.get(`${this.$api}/user-detail/all`);
        this.items = res.data.data;
        const id = JSON.parse(localStorage.getItem("user")).id;
        this.items = this.posts.filter((obj) => obj.user_id !== id);
        console.log('user items', this.items);
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
