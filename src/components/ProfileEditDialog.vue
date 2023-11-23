<template>
  <v-dialog persistent v-model="show" max-width="500px">
    <v-form ref="form" lazy-validation>
      <v-card color="background">
        <v-toolbar elevation="0" class="background">
          <v-btn icon dark @click.stop="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="font-weight-bold"
            >Edit Profile</v-toolbar-title
          >
        </v-toolbar>
        <v-card-text class="white--text">
          <center style="position: relative">
            <v-file-input
              accept="image/*"
              id="file-input"
              style="display: none"
              v-model="photoFile"
            ></v-file-input>

            <v-avatar color="primary" size="90"><img :src="photo" /></v-avatar>
            <v-btn
              @click="onImageClick"
              icon
              style="position: absolute; top: 0"
              color="white"
              ><v-icon>mdi-pencil</v-icon></v-btn
            >
          </center>
          <v-text-field
            class="mt-6"
            v-model="name"
            :rules="noEmptyRules"
            outlined
            label="Name"
          ></v-text-field>
          <v-textarea v-model="description" outlined label="Bio"></v-textarea>
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                outlined
                autocomplete="off"
                v-bind="attrs"
                v-on="on"
                label="Birthday"
                readonly
                :value="formattedDate"
              ></v-text-field>
            </template>
            <v-date-picker
              flat
              v-model="birthday"
              locale="id-ID"
              @input="menu = false"
            >
            </v-date-picker>
          </v-menu>

          <v-btn
            :loading="isLoading"
            @click="submitForm"
            rounded
            class="primary my-5"
            width="100%"
            >Save</v-btn
          >
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
/* eslint-disable */
import axios from "axios";
import EventBus from "@/event-bus";
import moment from "moment";

export default {
  name: "ProfileEditDialog",
  props: {
    value: Boolean,
    user: Object,
    userDetail: Object,
  },
  computed: {
    formattedDate() {
      return this.birthday ? moment(this.birthday).format("DD/MM/YYYY") : "";
    },
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  data: () => ({
    menu: false,
    name: "",
    description: "",
    birthday: null,
    photo: null,
    photoFile: null,
    isLoading: false,
    isPasswordObscure: true,
    isSet: false,
    noEmptyRules: [(v) => !!v || "Field can't be empty"],
  }),
  mounted() {
    console.log("hello");
    console.log(this.userDetail);
    this.name = this.userDetail.name;
    this.description = this.userDetail.description;
    this.birthday = this.userDetail.birthday;
    this.photo = `${this.$baseUrl}/${this.userDetail.photo_url}`
    console.log('mounted');
  },
  methods: {
    onImageClick() {
      if (!this.isSet) {
        const imgInp = document.getElementById("file-input");
        imgInp.onchange = (e) => {
          console.log(e);
          const [file] = imgInp.files;
          if (file) {
            this.photo = URL.createObjectURL(file);
          }
        };
        this.isSet = true;
      }
      document.getElementById("file-input").click();
    },
    async submitForm() {
      if (this.$refs.form.validate()) {
        try {
          this.isLoading = true;
          const formData = new FormData();
          formData.append("file", this.photoFile);
          const data = {
            name: this.name,
          };
          if (this.description) {
            data['description'] = this.description;
          }
          if (this.birthday) {
            data['birthday'] = moment(this.birthday).format();
          }
          console.log(data.birthday);
          for (var field in data) {
            formData.append(field, data[field]);
          }
          const res = await axios.post(
            `${this.$api}/user-detail/${this.user.id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (res.status != 200) {
            EventBus.$emit("showSnackbar", res.data.message, "red");
            return;
          }
          this.show = false;
          this.$emit('updateProfile', res.data.data);
        } catch (e) {
          console.log(e);
          EventBus.$emit("showSnackbar", e.response.data.message, "red");
        }
        this.isLoading = false;
      }
    },
  },
};
</script>
