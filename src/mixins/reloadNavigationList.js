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
  async beforeRouteUpdate(to, from, next) {
    await this.executeReload(to.params.page);
    next();
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
      const { INITIAL_CURRENT_PAGE } = this.$constants;
      const pageFalsy = !page;
      const pageNotValid = !this.isPageValid(page);

      if (pageFalsy || pageNotValid) {
        this.page = INITIAL_CURRENT_PAGE;
      } else {
        this.page = Number(page);
      }
    },
    updateLimit(limit) {
      const { PER_PAGE_SNAPSHOTS, PER_PAGE_OPTIONS } = this.$constants;
      const { name: routeName } = this.$route;
      const limitFalsy = !limit;
      const limitNotValid = !this.isLimitValid(limit);
      const limitNotAllowed =
        Number(limit) !== PER_PAGE_SNAPSHOTS &&
        !PER_PAGE_OPTIONS.includes(Number(limit));

      if (limitFalsy || limitNotValid || limitNotAllowed) {
        this.limit = this.getDefaultLimit(routeName);
      } else {
        this.limit = Number(limit);
      }
    },
    async executeReload(pageBeforeRouteUpdate) {
      this.loading = true;
      if (pageBeforeRouteUpdate) {
        this.page = Number(pageBeforeRouteUpdate);
      } else {
        this.page = this.$constants.INITIAL_CURRENT_PAGE;
      }

      await this.reload();
      this.loading = false;
    },
    getDefaultLimit(routeName) {
      const { PER_PAGE, PER_PAGE_SNAPSHOTS } = this.$constants;

      if (routeName === 'snapshots') {
        return PER_PAGE_SNAPSHOTS;
      }

      return PER_PAGE;
    },
    async handleLimitChange(limit) {
      const { INITIAL_CURRENT_PAGE, PER_PAGE, PER_PAGE_SNAPSHOTS } = this.$constants;
      const { name: routeName, params, query } = this.$route;
      const limitNotDefault =
        PER_PAGE !== limit &&
        PER_PAGE_SNAPSHOTS !== limit
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
      }
    },
  },
};
