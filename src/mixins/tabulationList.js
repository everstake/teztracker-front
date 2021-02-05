export default {
  data() {
    return {
      items: [],
      loading: false,
      loaded: false,
      count: 0,
      page: 1,
      limit: this.$constants.PER_PAGE,
    };
  },
  methods: {
    handlePageChange(page) {
      this.page = page;
      this.reload(this.limit, page);
    },
    handleLimitChange(limit) {
      this.page = 1;
      const page = this.page;
      this.limit = limit;
      this.reload(limit, page);
    },
  },
  async created() {
    if (!this.loaded) {
      await this.reload(this.limit, this.page);
    }
  },
};
