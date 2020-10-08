export default {
  data() {
    return {
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
    };
  },
  methods: {
    $_handleCurrentPageChange(page) {
      this.currentPage = page;
    },
  },
};
