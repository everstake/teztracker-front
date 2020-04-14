export default {
  computed: {
    $_network() {
      switch (this.$route.params.network) {
        case "mainnet":
          return this.$t("nets.mainnet");
        case "babylonnet":
          return this.$t("nets.babylonnet");
        case "carthagenet":
          return this.$t("nets.carthagenet");
        default:
          return "Mainnet";
      }
    }
  }
};
