<template>
  <div>
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
          <v-img :src="photo.photo" height="100%" class="rounded-lg"></v-img>
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
    <v-btn class="ml-16 mt-3" @click="onImageClick" fab small color="primary">
      <v-icon>mdi-image</v-icon>
    </v-btn>

    <div class="d-flex justify-end mt-3">
      <v-btn
        @click="sendPost"
        :disabled="(!postText && photos.length == 0) || postText.length > 280"
        :loading="isLoading"
        rounded
        color="primary"
        >Post</v-btn
      >
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import EventBus from '@/event-bus';
export default {
  name: "PostTweetComponent",
  props: ["userDetail", "parentPostId"],
  data: () => ({
    postText: "",
    photos: [],
    isLoading: false,
    isSet: false,
  }),
  methods: {
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
    async sendPost() {
      try {
        this.isLoading = true;
        const formData = new FormData();
        formData.append("content", this.postText);

        for (var i = 0; i < this.photos.length; i++) {
          formData.append(`media${i + 1}`, this.photos[i].file);
        }
        if (this.parentPostId) {
            formData.append("parent_post_id", this.parentPostId);
        }
        console.log(formData);

        const res = await axios.post(`${this.$api}/post`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("res", res);
        this.$emit("addPosts", res.data.data);
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

<style></style>
