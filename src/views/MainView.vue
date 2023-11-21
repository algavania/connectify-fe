<template>
  <v-container class="fill-height">
    <v-row>
      <v-col cols="7">
        <v-row>
          <v-col></v-col>
          <img
            :src="require('@/assets/logo-app-white.svg')"
            class="ma-auto"
            alt="Background"
          />
          <v-col></v-col>
          <v-col></v-col>
        </v-row>
      </v-col>
      <v-col cols="5">
        <v-spacer></v-spacer>
        <div>
          <h1 class="archivo-font heading-size mb-6">Happening now</h1>
          <h2 class="archivo-font subheading-size mb-4">Join today.</h2>
          <div style="width: 20rem">
            <v-btn @click.stop="showDialog=true" rounded class="primary mb-3" width="100%"
              >Create account</v-btn
            >
            <div class="small-body-size grey--text mb-8">
              By signing up, you agree to the
              <span><a href="">Terms of Service</a></span> and
              <span><a href="">Privacy Policy</a></span
              >, including <span><a href="">Cookie Use</a></span
              >.
            </div>
            <h3 class="mb-3">Already have an account?</h3>
            <v-btn @click.stop="showLoginDialog=true" rounded outlined width="100%" class="primary--text"
              >Sign in</v-btn
            >
          </div>
        </div>
        <v-spacer></v-spacer>
      </v-col>
    </v-row>
    <SignUpDialog v-model="showDialog" />
    <SignInDialog v-model="showLoginDialog" />
  </v-container>
</template>

<script>
import SignUpDialog from '@/components/SignUpDialog.vue';
import SignInDialog from '@/components/SignInDialog.vue';

export default {
  name: "MainView",
  components: {
    SignUpDialog,
    SignInDialog
  },
  data: () => ({
    showDialog: false,
    showLoginDialog: false,
  })
};
</script>
