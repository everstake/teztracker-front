import Vue from "vue";
import moment from "moment";
import { XTZ } from "./store";
const MAX_HASH_LENGTH = 20;

Vue.filter("bignum", function (num, delimiter) {
  if (!num || num < 1000) {
    return num;
  }
  const delim = delimiter && delimiter.length > 0 ? delimiter : " ";
  const str = Array.from(num.toString()).reverse();
  let result = [];
  for (let i = 0; i < str.length; i++) {
    if (i != 0 && (i % 3 == 0)) {
      result.push(delim);
    }
    result.push(str[i]);
  }
  return result.reverse().join("");
});
Vue.filter("timeformat", function (ts, format) {
  return moment(Number(ts) * 1000).format(format);
});

Vue.filter("longhash", function (hash, length) {
  const l = length || MAX_HASH_LENGTH;
  if (!hash || hash.length < l) {
    return hash;
  }
  return hash.slice(0, l) + "...";
});

Vue.filter("tezos", function (amount) {
  if (amount > 0) {
    return amount / XTZ + " XTZ";
  }
  return "0 XTZ";
  //return amount + "ꜩ";
});

Vue.filter("getAge", function (timestamp) {
  var date = new Date();
  var value = Math.ceil((date.getTime() - timestamp * 1000) / (1000 * 60 * 60 * 24));
  return value + ' days';
});

Vue.filter("getPercentageICOActiveAddresses", function (num) {
  var allAddresses = 30317;
  if (num) {
    return parseFloat((num * 100) / 30317).toFixed(2);
  }
});