export default {
  computed: {
    $_network() {
      switch (this.$route.params.network) {
        case 'mainnet':
          return this.$t('nets.mainnet');
        case 'delphinet':
          return this.$t('nets.delphinet');
        default:
          return 'Mainnet';
      }
    },
  },
};
