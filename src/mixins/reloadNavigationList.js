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
  async beforeRouteEnter(to, from, next) {
    const {
      name: routeName,
      params: { page: routePage },
      query: { limit: routeLimit },
    } = to;

    next((vm) => {
      const { PER_PAGE, PER_PAGE_SNAPSHOTS, PER_PAGE_OPTIONS } = vm.$constants;
      let page, limit;
      const routePageFalsy = !routePage;
      const routeLimitFalsy = !routeLimit;
      const routePageNotNumber = typeof parseInt(routePage) !== 'number';
      const limitNotNumber = typeof parseInt(routeLimit) !== 'number';
      const routePageNotAllowed = Number(routePage) <= 0;
      const routeLimitNotAllowed =
        Number(routeLimit) !== PER_PAGE_SNAPSHOTS &&
        !PER_PAGE_OPTIONS.includes(Number(routeLimit));

      if (routePageFalsy || routePageNotNumber || routePageNotAllowed) {
        page = 1;
      } else {
        page = Number(routePage);
      }

      if (routeLimitFalsy || limitNotNumber || routeLimitNotAllowed) {
        limit = routeName === 'snapshots' ? PER_PAGE_SNAPSHOTS : PER_PAGE;
      } else {
        limit = Number(routeLimit);
      }
      vm.page = page;
      vm.limit = limit;
      vm.executeReload();
    });
  },
  async beforeRouteUpdate(to, from, next) {
    const {
      name: routeName,
      params: { page: routePage },
      query: { limit: routeLimit },
    } = to;
    const { PER_PAGE, PER_PAGE_SNAPSHOTS, PER_PAGE_OPTIONS } = this.$constants;
    let page, limit;
    const routePageFalsy = !routePage;
    const routeLimitFalsy = !routeLimit;
    const routePageNotNumber = typeof parseInt(routePage) !== 'number';
    const limitNotNumber = typeof parseInt(routeLimit) !== 'number';
    const routePageNotAllowed = Number(routePage) < 0;
    const routeLimitNotAllowed =
      Number(routeLimit) !== PER_PAGE_SNAPSHOTS &&
      !PER_PAGE_OPTIONS.includes(Number(routeLimit));

    if (routePageFalsy || routePageNotNumber || routePageNotAllowed) {
      page = 1;
    } else {
      page = Number(routePage);
    }

    if (routeLimitFalsy || limitNotNumber || routeLimitNotAllowed) {
      limit = routeName === 'snapshots' ? PER_PAGE_SNAPSHOTS : PER_PAGE;
    } else {
      limit = Number(routeLimit);
    }

    this.page = page;
    this.limit = limit;

    await this.executeReload();
    next();
  },
  methods: {
    isNumberParameterValid(number) {
      if (!number || isNaN(number)) return false;
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
    async executeReload() {
      this.loading = true;
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
      const { name: routeName, params, query } = this.$route;
      let routeLimit = query.limit || this.getDefaultLimit(routeName);
      if (routeLimit == limit) {
        return;
      }
      const {
        INITIAL_CURRENT_PAGE,
        PER_PAGE,
        PER_PAGE_SNAPSHOTS,
      } = this.$constants;
      const limitDefault = limit === PER_PAGE || limit === PER_PAGE_SNAPSHOTS;
      const route = {
        name: routeName,
        params: { ...params, page: INITIAL_CURRENT_PAGE },
        query: { ...query, limit: limitDefault ? undefined : limit },
      };
      this.$router.replace(route);
    },
    async handlePageChange() {},
  },
};
