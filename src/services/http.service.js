import axios from 'axios';
import NProgress from 'nprogress';

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
