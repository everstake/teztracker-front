export default {
  computed: {
    $_network() {
      switch (this.$route.params.network) {
        case 'mainnet':
          return this.$t('nets.mainnet');
        case 'delphi':
          return this.$t('nets.delphi');
        default:
          return 'Mainnet';
      }
    },
  },
};
