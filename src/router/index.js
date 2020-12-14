import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from '@/router/routes';
import store from '@/store';
import middlewarePipeline from '@/router/middlewarePipeline';
import { CANCEL_PENDING_REQUESTS } from '@/store/actions.types';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes,
});

function cancelAllPendingRequests() {
  store.dispatch(`app/${CANCEL_PENDING_REQUESTS}`);
}

router.beforeEach((to, from, next) => {
  if (!to.name) {
    return next({ name: 'network' });
  }

  if (!to.meta.middleware) {
    cancelAllPendingRequests();
    return next();
  }

  const middleware = to.meta.middleware;
  const context = { to, from, next, store };

  return middleware[0]({
    ...context,
    nextMiddleware: middlewarePipeline(context, middleware, 1),
  });
});

export default router;
