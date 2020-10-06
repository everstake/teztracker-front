import Vue from 'vue';
import moment from 'moment';
import numeral from 'numeral';

Vue.filter('bignum', function(num, delimiter) {
  if (!num || num < 1000) {
    return num;
  }
  const delim = delimiter && delimiter.length > 0 ? delimiter : ' ';
  const str = Array.from(num.toString()).reverse();
  let result = [];
  for (let i = 0; i < str.length; i++) {
    if (i != 0 && i % 3 == 0) {
      result.push(delim);
    }
    result.push(str[i]);
  }
  return result.reverse().join('');
});

Vue.filter('timeformat', function(ts, format) {
  return moment(
    Number(ts) * Vue.prototype.$constants.THOUSAND_MILLISECONDS,
  ).format(format);
});

// Vue.filter('longhash', function(hash, length) {
//   const l = length || Vue.prototype.$constants.MAX_HASH_LENGTH;
//   if (!hash || hash.length < l) {
//     return hash;
//   }
//   return hash.slice(0, l) + '...';
// });

Vue.filter('longhash', function(hash, fromStart, fromEnd) {
  return Vue.prototype.$helpers.truncateHash(hash, fromStart, fromEnd);
});

Vue.filter('tezos', function(amount) {
  if (amount > 0) {
    return (
      numeral(amount / Vue.prototype.$constants.XTZ).format('0,0[.]000000') +
      ' XTZ'
    );
  }
  return '0 XTZ';
  //return amount + "ꜩ";
});

Vue.filter('tezosToFixed', function(amount) {
  if (amount > 0) {
    if (numeral(amount / Vue.prototype.$constants.XTZ).format('0,0') == 0) {
      return `${numeral(amount / Vue.prototype.$constants.XTZ).format(
        '0,0[.]000000',
      )} XTZ`;
    } else {
      return `${numeral(amount / Vue.prototype.$constants.XTZ).format(
        '0,0',
      )} XTZ`;
    }
  }
  return '0 XTZ';
});

Vue.filter('tezosCapacity', function(amount) {
  return `${numeral(amount).format('0,0[.]000000')} XTZ`;
});

Vue.filter('addPercent', function(amount) {
  if (amount > 0) {
    return `${amount} %`;
  }
  return '0 %';
});

Vue.filter('getAge', function(timestamp) {
  var date = new Date();
  var value = Math.ceil(
    (date.getTime() -
      timestamp * Vue.prototype.$constants.THOUSAND_MILLISECONDS) /
      Vue.prototype.$constants.DAY_IN_MILLISECONDS,
  );
  return numeral(value).format('0,0') + ' days';
});

Vue.filter('getPercentageICOActiveAddresses', function(num) {
  if (num) {
    return parseFloat(
      (num * 100) / Vue.prototype.$constants.ALL_ICO_ACTIVE_ADDRESSES,
    ).toFixed(2);
  }
});

Vue.filter('formatInteger', (num) => {
  return numeral(num).format('0,0');
});
