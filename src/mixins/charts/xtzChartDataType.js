export default {
  methods: {
    $_yTicksCallback(label) {
      if (label > 999999) {
        return `${label / 1000 / 1000}M XTZ`;
      }
      if (label > 999) {
        return `${label / 1000}K XTZ`;
      }

      return `${label} XTZ`;
    },
    $_tooltipsLabelCallback(tooltipItem, data) {
      return `${data.datasets[0].label}: ${tooltipItem.value} XTZ`;
    }
  }
};
