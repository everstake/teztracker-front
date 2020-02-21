export default {
  computed: {
    $_network() {
      switch (this.$route.params.network) {
        case "mainnet":
          return "Mainnet";
        case "babylonnet":
          return "Babylonnet";
        case "carthage":
          return "Carthage";
        default:
          return "Mainnet";
      }
    }
  }
};
