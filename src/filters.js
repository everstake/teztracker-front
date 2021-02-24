import Vue from 'vue';
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

Vue.filter('timeformat', (ts, format) => {
  return Vue.prototype.$helpers.timeformat(ts, format);
});

Vue.filter('longhash', function(hash, fromStart, fromEnd) {
  return Vue.prototype.$helpers.truncateHash(hash, fromStart, fromEnd);
});

Vue.filter('tezos', (amount, currency = 'ꜩ') =>
  Vue.prototype.$helpers.tezos(amount, currency, true),
);

Vue.filter(
  'formatCurrencyWithPrecision',
  (amount, currency = 'ꜩ', precision) => {
    const formatWithPrecision = Vue.prototype.$helpers.formatPrecision(
      precision,
    );
    const formattedAmount = numeral(
      Number(amount) / Vue.prototype.$constants.XTZ,
    ).format(formatWithPrecision);
    return `${formattedAmount} ${currency}`;
  },
);

Vue.filter('currencyPrecision', function(
  amount,
  currency = 'ꜩ',
  precision = 6,
) {
  const noAmount = !amount || amount === 0;
  const noPrecision = !precision || precision === 0 || precision < 0;

  if (noAmount) {
    return `0 ${currency}`;
  }

  if (noPrecision) {
    return `${amount} ${currency}`;
  }

  const formatWithPrecision = Vue.prototype.$helpers.formatPrecision(precision);

  if (amount > 0) {
    const formattedAmount = numeral(
      Number(amount) / Vue.prototype.$constants.XTZ,
    ).format(formatWithPrecision);
    return `${formattedAmount} ${currency}`;
  }

  return `0 ${currency}`;
});

Vue.filter('tezosToFixed', function(amount) {
  if (amount > 0) {
    if (numeral(amount / Vue.prototype.$constants.XTZ).format('0,0') == 0) {
      return `${numeral(amount / Vue.prototype.$constants.XTZ).format(
        '0,0[.]000000',
      )} ꜩ`;
    } else {
      return `${numeral(amount / Vue.prototype.$constants.XTZ).format(
        '0,0',
      )} ꜩ`;
    }
  }
  return '0 ꜩ';
});

Vue.filter('tezosCapacity', function(amount) {
  return `${numeral(amount).format('0,0[.]000000')} ꜩ`;
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

Vue.filter('formatCurrency', (amount, calcXTZ = true) =>
  Vue.prototype.$helpers.formatCurrency(amount, calcXTZ),
);

Vue.filter('denominate', (amount, calcXTZ = true) =>
  Vue.prototype.$helpers.denominate(amount, calcXTZ),
);
