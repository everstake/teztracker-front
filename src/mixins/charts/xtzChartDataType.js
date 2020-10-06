import numeral from 'numeral';

export default {
  methods: {
    // TODO: Separate mixin
    $_yTicksCallback(label) {
      if (label > 999999) {
        return `${label / 1000 / 1000}M XTZ`;
      }
      if (label > 999) {
        return `${label / 1000}K XTZ`;
      }

      return `${numeral(label).format('0,0[.][000000]')} XTZ`;
    },
    $_tooltipsLabelCallback(tooltipItem, data) {
      return `${data.datasets[0].label}: ${numeral(tooltipItem.value).format(
        '0,0[.]000000',
      )} XTZ`;
    },
  },
};
