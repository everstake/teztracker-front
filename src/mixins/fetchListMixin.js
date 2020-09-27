export default {
  data() {
    return {
      currentPage: this.$constants.INITIAL_CURRENT_PAGE
    };
  },
  watch: {
    currentPage: {
      async handler(value) {
        await this.reload(value);
      }
    },
    async perPage() {
      await this.reload();
    }
  },
  async created() {
    await this.reload();
  }
};
