export default {
  data() {
    return {
      page: null,
      limit: null,
      limitSelected: null,
      items: [],
      count: null,
      loading: false,
    };
  },
  async created() {
    const { INITIAL_CURRENT_PAGE, PER_PAGE, PER_PAGE_SNAPSHOTS } = this.$constants;
    const { name: routeName, params, query, params: { page: routePage }, query: { limit: routeLimit } } = this.$route;
    const page =
      INITIAL_CURRENT_PAGE !== routePage ? routePage : undefined;
    const limit =
      PER_PAGE !== routeLimit &&
      PER_PAGE_SNAPSHOTS !== routeLimit
        ? routeLimit
        : undefined;

    if (!page || !limit) {
      const route = {
        name: routeName,
        params: { ...params, page },
        query: { ...query, limit },
      };
      this.$router.replace(route);
    }
    this.updatePage(page);
    this.updateLimit(limit);
    await this.executeReload();
  },
  methods: {
    isLimitValid(limit) {
      const number = Number(limit);
      return typeof number === 'number' && number > 0;
    },
    isPageValid(page) {
      const number = Number(page);
      return typeof number === 'number' && number > 0;
    },
    updatePage(page) {
      const pageFalsy = !page;
      const pageNotValid = !this.isPageValid(page);

      if (pageFalsy || pageNotValid) {
        this.page = this.$constants.INITIAL_CURRENT_PAGE;
      } else {
        this.page = Number(page);
      }
    },
    updateLimit(limit) {
      const { name: routeName } = this.$route;
      const limitFalsy = !limit;
      const limitNotValid = !this.isLimitValid(limit);
      const limitNotAllowed =
        Number(limit) !== this.$constants.PER_PAGE_SNAPSHOTS &&
        !this.$constants.PER_PAGE_OPTIONS.includes(Number(limit));

      if (limitFalsy || limitNotValid || limitNotAllowed) {
        this.limit = this.getDefaultLimit(routeName);
      } else {
        this.limit = Number(limit);
      }
    },
    async executeReload() {
      this.loading = true;
      await this.reload();
      this.loading = false;
    },
    getDefaultLimit(routeName) {
      if (routeName === 'snapshots') {
        return this.$constants.PER_PAGE_SNAPSHOTS;
      }

      return this.$constants.PER_PAGE;
    },
    async handleLimitChange(limit) {
      const { INITIAL_CURRENT_PAGE } = this.$constants;
      const { name: routeName, params, query } = this.$route;
      const limitNotDefault =
        this.$constants.PER_PAGE !== limit &&
        this.$constants.PER_PAGE_SNAPSHOTS !== limit
          ? limit
          : undefined;
      const route = {
        name: routeName,
        params: { ...params, page: undefined },
        query: { ...query, limit: limitNotDefault },
      };
      this.$router.replace(route);
      this.updateLimit(limitNotDefault);
      this.updatePage(INITIAL_CURRENT_PAGE);
      await this.executeReload();
    },
    async handlePageChange(page) {
      if (page !== this.page) {
        this.updatePage(page);
        await this.executeReload();
      }
    },
  },
};
