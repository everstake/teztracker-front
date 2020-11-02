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
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler($route) {
        const {
          params: { page },
          query: { limit },
        } = $route;
        this.updateNavigationParams(page, limit);
        await this.executeReload();
      },
    },
  },
  methods: {
    updateNavigationParams(page, limit) {
      const { name: routeName } = this.$route;

      if (page) {
        const pageValid = this.isPageNumberValid(page);

        if (pageValid) {
          this.page = Number(page);
        } else {
          this.page = this.$constants.INITIAL_CURRENT_PAGE;
        }
      } else {
        this.page = this.$constants.INITIAL_CURRENT_PAGE;
      }

      if (limit) {
        const limitNumber = Number(limit);
        const limitSnapshot = limitNumber === this.$constants.PER_PAGE_SNAPSHOTS;
        const limitMatched = this.$constants.PER_PAGE_OPTIONS.includes(limitNumber);
        const limitAllowed = limitSnapshot || limitMatched;

        if (limitAllowed) {
          this.limit = Number(limit);
        } else {
          this.limit = this.getDefaultLimit(routeName);
        }
      } else {
        this.limit = this.getDefaultLimit(routeName);
      }
    },
    async executeReload() {
      this.loading = true;
      await this.reload();
      this.loading = false;
    },
    isPageNumberValid(value) {
      const number = Number(value);
      return typeof number === 'number' && number > 0;
    },
    getDefaultLimit(routeName) {
      if (routeName === 'snapshots') {
        return this.$constants.PER_PAGE_SNAPSHOTS;
      }

      return this.$constants.PER_PAGE;
    },
    async handlePageChange(page) {
      const { name: routeName, params, query } = this.$route;
      this.page = page;
      this.updateNavigationParams(this.page, this.limit);
      const pageNotInitial = this.$constants.INITIAL_CURRENT_PAGE === this.page ? undefined : this.page;
      const limitNotInitial = this.getDefaultLimit(routeName) === this.limit ? undefined : this.limit;
      const route = {
        name: routeName,
        params: { ...params, page: pageNotInitial },
        query: { ...query, limit: limitNotInitial },
      };
      this.$router.replace(route);
    },
    async handleLimitChange(limit) {
      const { name: routeName, params, query } = this.$route;
      this.limit = limit;
      this.updateNavigationParams(this.page, this.limit);
      const limitNotInitial = this.getDefaultLimit(routeName) === this.limit ? undefined : this.limit;
      const route = {
        name: routeName,
        params: { ...params, page: undefined },
        query: { ...query, limit: limitNotInitial },
      };
      this.$router.replace(route);
    },
  },
};
