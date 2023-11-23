import Vue from "vue";
import VueRouter from "vue-router";

// Views
import MainView from "../views/MainView.vue";
import HomeView from "../views/HomeView.vue";
import DetailPostView from "../views/DetailPostView.vue";
import ProfileView from "../views/ProfileView.vue";

// Middlewares
import auth from "../middlewares/auth";
import notAuth from "../middlewares/not-auth";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  scrollBehavior() {
    return {
      x: 0,
      y: 0,
    };
  },
  routes: [
    {
      path: "/",
      name: "main",
      component: MainView,
      meta: {
        middleware: [notAuth],
      },
    },
    {
      path: "/home",
      name: "home",
      component: HomeView,
      meta: {
        middleware: [auth],
      },
    },
    {
      path: "/:username",
      name: "profile",
      component: ProfileView,
      meta: {
        middleware: [auth],
      },
    },
    {
      path: "/:username/post/:id",
      name: "detail-post",
      component: DetailPostView,
      meta: {
        middleware: [auth],
      },
    },
  ],
});

function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index];
  if (!subsequentMiddleware) return context.next;
  return (...parameters) => {
    context.next(...parameters);
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({
      ...context,
      next: nextMiddleware,
    });
  };
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];

    const context = {
      from,
      next,
      router,
      to,
    };

    const nextMiddleware = nextFactory(context, middleware, 1);
    return middleware[0]({
      ...context,
      next: nextMiddleware,
    });
  }
  return next();
});

export default router;
