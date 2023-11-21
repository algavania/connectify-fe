<template>
  <v-dialog persistent v-model="show" max-width="500px">
    <v-form ref="form" lazy-validation>
      <v-card color="background">
        <v-toolbar elevation="0" class="background">
          <v-btn icon dark @click.stop="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="font-weight-bold">Sign In</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="white--text">
          <h3 class="small-heading-size mb-4">Sign in to Connectify</h3>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            outlined
            label="Email"
          ></v-text-field>
          <v-text-field
            v-model="password"
            :append-icon="isPasswordObscure ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="isPasswordObscure = !isPasswordObscure"
            :type="isPasswordObscure ? 'password' : 'text'"
            outlined
            label="Password"
          ></v-text-field>
          <v-btn :loading="isLoading" @click="submitForm" rounded class="primary my-5" width="100%">Sign In</v-btn>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>
  
<script>
import axios from "axios";
import EventBus from "@/event-bus";

export default {
  name: "SignInDialog",
  props: {
    value: Boolean,
  },
  computed: {
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
    email: "",
    password: "",
    isLoading: false,
    isPasswordObscure: true,
    noEmptyRules: [(v) => !!v || "Field can't be empty"],
    emailRules: [
      (v) => !!v || "Field can't be empty",
      (v) => /.+@.+\..+/.test(v) || "Not a valid email",
    ],
  }),
  methods: {
    async submitForm () {
      if (this.$refs.form.validate()) {
        try {
          this.isLoading = true;
           const res = await axios.post(`${this.$api}/auth/login`, {
            email: this.email,
            password: this.password});
            EventBus.$emit("showSnackbar", "Sign in success", "green");

            if (res.status != 200) {
              EventBus.$emit("showSnackbar", res.data.message, "red");
              return;
            }
            this.$refs.form.reset()
            this.show = false;

            localStorage.setItem("token", res.data.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.data.user));
            EventBus.$emit("updateHomeDrawer");
            this.$router.push({ name: "home" });
        } catch (e) {
          EventBus.$emit("showSnackbar", e.response.data.message, "red");
        }
        this.isLoading = false;
      }
    }
  }
};
</script>
  