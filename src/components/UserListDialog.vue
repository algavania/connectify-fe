<template>
    <v-dialog persistent v-model="show" max-width="500px">
      <v-form ref="form" lazy-validation>
        <v-card color="background">
          <v-toolbar elevation="0" class="background">
            <v-btn icon dark @click.stop="show = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title class="font-weight-bold">{{ title }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="white--text" v-if="users">
            <v-row v-for="user in users" :key="user.user_id">
                <v-col cols="auto">
                    <v-avatar color="primary">
                        <img v-if="user.photo_url" :src="`${$baseUrl}/${user.photo_url}`" alt="">
                    </v-avatar>
                </v-col>
                <v-col>
                    <div>
                        <div class="font-weight-bold">{{ user.name }}</div>
                        <div>@{{ user.user.username }}</div>
                    </div>
                </v-col>
                <v-divider></v-divider>
            </v-row>
          </v-card-text>
        </v-card>
      </v-form>
    </v-dialog>
  </template>
    
  <script>
//   import axios from "axios";
//   import EventBus from "@/event-bus";
  
  export default {
    name: "UserListDialog",
    props: {
      value: Boolean,
      title: String,
      users: Array,
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
  };
  </script>
    