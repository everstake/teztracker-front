import Vue from 'vue';
import store from '../store';
import { SET_IS_WS_CONNECTION_OPEN } from '@/store/mutations.types';

let ws = null;
let isOpen = false;
const connectionAttempts = 10;
let connectionCount = 0;
const connectionInterval = 10000;
let subscriptions = [];

const connect = (network = store.getters['app/getAppNetwork']) => {
  ws = new WebSocket(`ws://168.119.9.132:8085/v2/${network}/ws`);

  ws.onopen = () => {
    isOpen = true;
    store.commit(`app/${SET_IS_WS_CONNECTION_OPEN}`, isOpen);
    connectionCount = 0;
  };

  ws.onerror = () => {
    if (isOpen) {
      close();
    }
  };

  ws.onclose = () => {
    const intervalID = setInterval(() => {
      if (connectionCount < connectionAttempts && !isOpen) {
        connect();
        connectionCount += 1;
      } else {
        clearInterval(intervalID);
      }
    }, connectionInterval);
  };
};

const close = () => {
  ws.close();
  isOpen = false;
  subscriptions.splice(0, subscriptions.length);
  store.commit(`app/${SET_IS_WS_CONNECTION_OPEN}`, isOpen);
};

const sendObj = (obj) => {
  try {
    ws.send(JSON.stringify(obj));
  } catch (e) {
    console.error(e);
  }
};

const removeSubscription = (channel) => {
  delete subscriptions[subscriptions.indexOf(channel)];
};

const subscribeToChannel = (channel) => {
  sendObj({
    type: 'subscribe',
    payload: { channels: [channel] },
  });
  subscriptions.push(channel);
};

const unsubscribeFromChannel = (channel) => {
  sendObj({
    type: 'unsubscribe',
    payload: { channels: [channel] },
  });
  removeSubscription(channel);
};

const onmessage = (cb) => {
  ws.addEventListener('message', ({ data }) => {
    const res = JSON.parse(data);

    cb(res);
  });
};

Vue.use({
  install() {
    Vue.prototype.$ws = {
      ws,
      subscriptions,
      connect,
      close,
      sendObj,
      subscribeToChannel,
      unsubscribeFromChannel,
      onmessage,
    };
  },
});
