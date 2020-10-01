import { mapState } from 'vuex';
import ceil from 'lodash/ceil';

export default {
  computed: {
    ...mapState({
      info: (state) => state.priceInfo,
    }),
  },
  methods: {
    $_convert(tzAmount) {
      let result = 0;
      if (tzAmount || tzAmount > 0) {
        const tez = tzAmount / this.$constants.XTZ;
        result = ceil(tez * this.info.price, this.$constants.USD_PRECISION);
      }
      return '$' + result;
    },
  },
};
