import axios from 'axios';
import NProgress from 'nprogress';
import store from '@/store';
import { ADD_CANCEL_TOKEN } from '@/store/mutations.types';

NProgress.configure({
  showSpinner: false,
});

let loaderTimeout = null;

const startLoader = () => {
  clearLoaderTimeout();
  loaderTimeout = setTimeout(() => {
    NProgress.start();
  }, 200);
};

const stopLoader = () => {
  clearLoaderTimeout();
  NProgress.done();
};

const clearLoaderTimeout = () => {
  if (loaderTimeout) {
    clearTimeout(loaderTimeout);
    loaderTimeout = null;
  }
};

const http = axios.create();

http.interceptors.request.use(
  (config) => {
    startLoader();
    let source = axios.CancelToken.source();
    config.cancelToken = source.token;
    store.commit(`app/${ADD_CANCEL_TOKEN}`, source);
    return config;
  },
  (error) => {
    stopLoader();
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => {
    stopLoader();
    return response;
  },
  (error) => {
    stopLoader();
    return Promise.reject(error);
  },
);

export default http;
