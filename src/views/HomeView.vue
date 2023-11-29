<template>
  <div id="inspire" class="background fill-height" style="width: 100%">
    <v-row>
      <v-col cols="8">
        <div>
          <div>
            <v-divider class="mb-7"></v-divider>
            <v-row>
              <v-col cols="auto"></v-col>
              <v-avatar color="primary">
                <img
                  v-if="userDetail.photo_url"
                  :src="`${this.$baseUrl}/${userDetail.photo_url}`"
                  alt=""
                />
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
              </v-col>
            </v-row>
            <v-file-input
              accept="image/*"
              id="file-input"
              style="display: none"
            ></v-file-input>
            <v-row v-if="photos.length > 0" class="ml-15">
              <v-col cols="6" v-for="(photo, i) in photos" :key="i">
                <div
                  style="position: relative"
                  :style="`height: ${photos.length > 1 ? '180px' : '292px'}`"
                >
                  <v-img
                    :src="photo.photo"
                    height="100%"
                    class="rounded-lg"
                  ></v-img>
                  <v-btn
                    @click="photos.splice(i, 1)"
                    fab
                    small
                    elevation="0"
                    style="position: absolute; top: 0; right: 0"
                    color="red"
                    class="ma-3"
                  >
                    <v-icon small>mdi-close</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
            <v-btn
              class="ml-16 mt-3"
              @click="onImageClick"
              fab
              small
              color="primary"
            >
              <v-icon>mdi-image</v-icon>
            </v-btn>

            <div class="d-flex justify-end mt-3">
              <v-btn
                @click="sendPost"
                :disabled="
                  (!postText && photos.length == 0) || postText.length > 280
                "
                :loading="isLoading"
                rounded
                color="primary"
                >Post</v-btn
              >
            </div>

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
            item-value="user_id"
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

export default {
  name: "HomeView",
  components: {
    PostComponent,
  },
  data: () => ({
    items: [],
    value: null,
    isLoading: false,
    postText: "",
    userDetail: {},
    posts: [],
    photos: [],
    isSet: false,
  }),
  mounted() {
    this.getUser();
    this.getPosts();
    this.getAllUsers();
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    deleteData(id) {
      this.posts = this.posts.filter((obj) => obj.id !== id);
    },
    onImageClick() {
      if (this.photos.length == 4) {
        EventBus.$emit("showSnackbar", "Max 4 photos!", "red");
        return;
      }
      if (!this.isSet) {
        console.log("length", this.photos.length);
        const imgInp = document.getElementById("file-input");
        imgInp.onchange = (e) => {
          console.log(e);
          const [file] = imgInp.files;
          console.log(file);
          if (file) {
            this.photos.push({
              photo: URL.createObjectURL(file),
              file: file,
            });
          }
          console.log("photos", this.photos);
        };
        this.isSet = true;
      }
      document.getElementById("file-input").click();
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
        console.log(this.items);
      } catch (e) {
        EventBus.$emit("showSnackbar", e.response.data.message, "red");
      }
    },
    async sendPost() {
      try {
        this.isLoading = true;
        const formData = new FormData();
        formData.append("content", this.postText);

        for (var i = 0; i < this.photos.length; i++) {
          formData.append(`media${i+1}`, this.photos[i].file);
        }
        console.log(formData);

        const res = await axios.post(
          `${this.$api}/post`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("res", res);
        this.posts.unshift(res.data.data);
        EventBus.$emit("showSnackbar", "Post has been sent!", "green");
        this.postText = "";
        this.photos = [];
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
