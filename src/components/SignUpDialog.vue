<template>
  <v-dialog persistent v-model="show" max-width="500px">
    <v-form ref="form" lazy-validation>
      <v-card color="background">
        <v-toolbar elevation="0" class="background">
          <v-btn icon dark @click.stop="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="font-weight-bold">Sign Up</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="white--text">
          <h3 class="small-heading-size mb-4">Create your account</h3>
          <v-text-field
            v-model="username"
            :rules="noEmptyRules"
            outlined
            label="Username"
          ></v-text-field>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            outlined
            label="Email"
          ></v-text-field>
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            :append-icon="isPasswordObscure ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="isPasswordObscure = !isPasswordObscure"
            :type="isPasswordObscure ? 'password' : 'text'"
            outlined
            label="Password"
          ></v-text-field>
          <div class="small-body-size grey--text">
            By signing up, you agree to the <a href="">Terms of Service</a> and
            <a href=""> Privacy Policy </a>, including
            <a href="">Cookie Use</a>. Connectify may use your contact
            information, including your email address and phone number for
            purposes outlined in our <a href="">Privacy Policy</a>, like keeping
            your account secure and personalizing our services, including ads.
            <a href="">Learn more</a>. Others will be able to find you by email
            or phone number, when provided, unless you choose otherwise
            <a href="">here</a>.
          </div>
          <v-btn :loading="isLoading" @click="submitForm" rounded class="primary my-5" width="100%">Sign Up</v-btn>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>
  
<script>
import axios from "axios";
import EventBus from "@/event-bus";

export default {
  name: "SignUpDialog",
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
    username: "",
    email: "",
    password: "",
    isLoading: false,
    isPasswordObscure: true,
    noEmptyRules: [(v) => !!v || "Field can't be empty"],
    emailRules: [
      (v) => !!v || "Field can't be empty",
      (v) => /.+@.+\..+/.test(v) || "Not a valid email",
    ],
    passwordRules: [
      (v) => !!v || "Field can't be empty",
      (v) => (v && v.length >= 8) || "Password at least must be 8 characters",
    ],
  }),
  methods: {
    async submitForm () {
      if (this.$refs.form.validate()) {
        try {
          this.isLoading = true;
           const res = await axios.post(`${this.$api}/auth/register`, {
            username: this.username,
            email: this.email,
            password: this.password});
            EventBus.$emit("showSnackbar", "Sign up success", "green");

            if (res.status != 200) {
              EventBus.$emit("showSnackbar", res.data.message, "red");
            }

            this.$refs.form.reset()
            this.show = false;
        } catch (e) {
          EventBus.$emit("showSnackbar", e.response.data.message, "red");
        }
        this.isLoading = false;
      }
    }
  }
};
</script>
  