export default {
  data() {
    return {
      perPage: this.$constants.PER_PAGE
    };
  },
  methods: {
    $_setPerPage(value) {
      this.perPage = value;
    }
  }
};
