<template>
  <div>
    <v-container class="pt-8" v-if="user">
      <v-row>
        <v-col cols="auto">
          <v-avatar color="primary" size="160">
            <img :src="`${this.$baseUrl}/${userDetail.photo_url}`" alt="" />
          </v-avatar>
        </v-col>
        <v-col>
          <div class="d-flex">
            <div class="smaller-heading-size">{{ user.username }}</div>
            <v-btn
              v-if="isMyProfile"
              @click.stop="showDialog = true"
              outlined
              rounded
              class="ml-5"
              >Edit Profile</v-btn
            >
            <v-btn
              @click="followButtonClicked"
              outlined
              rounded
              class="ml-5"
              v-else
              >{{ hasFollowed ? "Unfollow" : "Follow" }}</v-btn
            >
          </div>
          <div class="d-flex mt-2">
            <div class="mr-4">{{ posts ? posts.length : 0 }} posts</div>
            <div class="mx-6" @click="showFollowersDialog = true">{{ followersCount }} followers</div>
            <div class="ml-4" @click="showFollowingDialog = true">{{ followingsCount }} followings</div>
          </div>
          <div class="mt-6 font-weight-bold">
            {{ userDetail.name ? userDetail.name : user.username }}
          </div>
          <div v-if="userDetail">{{ userDetail.description }}</div>
        </v-col>
      </v-row>
    </v-container>
    <v-divider class="mt-3"></v-divider>
      <div v-if="posts">
        <div v-for="post in posts" :key="post.id">
          <router-link :to="`/${post.user.username}/post/${post.id}`">
            <PostComponent @deleteData="deleteData" :post="post" />
          </router-link>
          <v-divider></v-divider>
        </div>
      </div>
    <ProfileEditDialog
      @updateProfile="updateProfile"
      :key="editKey"
      :user="user"
      :userDetail="userDetail"
      v-model="showDialog"
    />
    <UserListDialog
      :users="followers"
      :key="followersKey"
      :title="'Followers'"
      v-model="showFollowersDialog"
    />
    <UserListDialog
      :users="followings"
      :title="'Followings'"
      :key="followingKey"
      v-model="showFollowingDialog"
    />

  </div>
</template>

<script>
import EventBus from "@/event-bus";
import axios from "axios";
import ProfileEditDialog from "@/components/ProfileEditDialog.vue";
import UserListDialog from "@/components/UserListDialog.vue";
import PostComponent from "@/components/PostComponent.vue";

export default {
  name: "ProfileView",
  components: {
    ProfileEditDialog,
    PostComponent,
    UserListDialog
  },
  data: () => ({
    showDialog: false,
    user: {},
    userDetail: {},
    followersCount: 0,
    followingsCount: 0,
    isMyProfile: false,
    hasFollowed: false,
    editKey: 0,
    followersKey: "followersKey",
    followingKey: "followingKey",
    posts: [],
    showFollowingDialog: false,
    showFollowersDialog: false,
    followings: [],
    followers: [],
  }),
  mounted() {
    this.functionOnMounted();
  },
  methods: {
    deleteData(id) {
      this.posts = this.posts.filter(obj => obj.id !== id);
    },
    async functionOnMounted() {
      await this.getUser();
      this.getPosts();
      this.getFollowersCount();
      this.getFollowingsCount();
      this.getFollowersData();
      this.getFollowingsData();
    },
    updateProfile(data) {
      this.userDetail = data;
      console.log("update profile", this.userDetail);
    },
    async getFollowings() {
      try {
        const res = await axios.get(`${this.$api}/post/user/${this.user.id}`);
        this.posts = res.data.data;
      } catch (e) {
        EventBus.$emit("showSnackbar", e.response.data.message, "red");
      }
    },
    async getFollowersData() {
      try {
        const res = await axios.get(`${this.$api}/user-following/${this.user.id}/followers`);
        this.followers = res.data.data;
        this.followersKey += "1";
      } catch (e) {
        EventBus.$emit("showSnackbar", e.response.data.message, "red");
      }
    },
    async getFollowingsData() {
      try {
        const res = await axios.get(`${this.$api}/user-following/${this.user.id}`);
        this.followings = res.data.data;
        console.log('followings',this.followings);
        this.followingKey += "1";
      } catch (e) {
        EventBus.$emit("showSnackbar", e.response.data.message, "red");
      }
    },

    async getPosts() {
      try {
        const res = await axios.get(`${this.$api}/post/user/${this.user.id}`);
        this.posts = res.data.data;
      } catch (e) {
        EventBus.$emit("showSnackbar", e.response.data.message, "red");
      }
    },
    async getFollowersCount() {
      try {
        const res = await axios.get(
          `${this.$api}/user-following/${this.user.id}/followers/count`
        );
        this.followersCount = res.data.data;
      } catch (e) {
        this.followersCount = 0;
      }
    },
    async getFollowingsCount() {
      try {
        const res = await axios.get(
          `${this.$api}/user-following/${this.user.id}/count`
        );
        this.followingsCount = res.data.data;
      } catch (e) {
        this.followingsCount = 0;
      }
    },
    async checkHasFollowed() {
      try {
        const res = await axios.get(
          `${this.$api}/user-following/${this.user.id}/check`
        );
        this.hasFollowed = res.data.data;
      } catch (e) {
        this.hasFollowed = false;
      }
    },
    async followButtonClicked() {
      EventBus.$emit("startLoading");
      try {
        if (!this.hasFollowed) {
          await axios.post(`${this.$api}/user-following`, {
            user_id: this.user.id,
          });
          this.hasFollowed = true;
          this.followersCount++;
        } else {
          await axios.delete(`${this.$api}/user-following/${this.user.id}`);
          this.hasFollowed = false;
          this.followersCount--;
        }
      } catch (e) {
        EventBus.$emit("showSnackbar", e.response.data.message, "red");
      }
      EventBus.$emit("stopLoading");
    },
    async getUser() {
      EventBus.$emit("startLoading");
      try {
        const res = await axios.get(
          `${this.$api}/user/${this.$route.params.username}`
        );
        console.log("res", res);
        this.user = res.data.data;
        this.isMyProfile =
          this.user.id == JSON.parse(localStorage.getItem("user")).id;
        this.editKey++;
        if (!this.isMyProfile) {
          await this.checkHasFollowed();
        }
      } catch (e) {
        EventBus.$emit("showSnackbar", e.response.data.message, "red");
      }
      EventBus.$emit("stopLoading");
      try {
        const userDetailRes = await axios.get(
          `${this.$api}/user-detail/${this.user.id}`
        );
        this.userDetail = userDetailRes.data.data;
        this.editKey++;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style></style>
