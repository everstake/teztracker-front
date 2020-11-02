export default {
  data() {
    return {
      txs: [],
      delegations: [],
      originations: [],
      endorsements: [],
      baking: {
        total: null,
        future: null,
        data: [],
        loading: false,
      },
      endorsing: {
        total: null,
        future: null,
        data: [],
        loading: false,
      },
      rewards: [],
      bonds: [],
      operations: [],
      blockOtherOperations: [],
      counts: {
        txs: 0,
        delegations: 0,
        originations: 0,
        endorsements: 0,
        baking: 0,
        rewards: 0,
        endorsing: 0,
        bonds: 0,
        operations: 0,
        blockOtherOperations: 0,
      },
      page: {
        txs: 1,
        delegations: 1,
        originations: 1,
        endorsements: 1,
        baking: 1,
        rewards: 1,
        endorsing: 1,
        bonds: 1,
        operations: 1,
        blockOtherOperations: 1,
      },
      limit: {
        txs: this.$constants.PER_PAGE,
        delegations: this.$constants.PER_PAGE,
        originations: this.$constants.PER_PAGE,
        endorsements: this.$constants.PER_PAGE,
        baking: this.$constants.PER_PAGE,
        endorsing: this.$constants.PER_PAGE,
        rewards: 20,
        bonds: 20,
        operations: this.$constants.PER_PAGE,
        blockOtherOperations: 100,
      },
      loading: {
        txs: false,
        delegations: false,
        originations: false,
        endorsements: false,
        baking: false,
        rewards: false,
        endorsing: false,
        bonds: false,
        operations: false,
        blockOtherOperations: false,
      },
      loaded: {
        txs: false,
        delegations: false,
        originations: false,
        endorsements: false,
        baking: false,
        rewards: false,
        endorsing: false,
        bonds: false,
        operations: false,
        blockOtherOperations: false,
      },
    };
  },
  methods: {
    async reloadTxs({ limit, page }) {
      this.loading.txs = true;
      const props = {
        page,
        limit,
        account_id: this.hash,
      };
      const data = await this.$api.getTransactions(props);
      if (data.status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.replace({
          name: data.status,
        });
      }
      this.$emit('onTransaction', 'setChartData');
      this.txs = data.data;
      this.counts.txs = data.count;
      this.loading.txs = false;
      this.loaded.txs = true;
    },
    async reloadDelegations({ limit, page }) {
      this.loading.delegations = true;
      const props = {
        page,
        limit,
        account_id: this.hash,
      };
      const data = await this.$api.getDelegations(props);
      if (data.status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.replace({
          name: data.status,
        });
      }
      this.delegations = data.data;
      this.counts.delegations = data.count;
      this.loading.delegations = false;
      this.loaded.delegations = true;
    },
    async reloadOriginations({ limit, page }) {
      this.loading.originations = true;
      const props = {
        page,
        limit,
        account_id: this.hash,
      };
      const data = await this.$api.getOriginations(props);
      this.originations = data.data;
      this.counts.originations = data.count;
      this.loading.originations = false;
      this.loaded.originations = true;
    },
    async reloadEndorsements({ limit, page }) {
      this.loading.endorsements = true;
      const props = {
        page,
        limit,
        account_id: this.hash,
      };
      const data = await this.$api.getEndorsements(props);
      if (data.status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.replace({
          name: data.status,
        });
      }
      this.counts.endorsements = data.count;
      this.endorsements = data.data;
      this.loading.endorsements = false;
      this.loaded.endorsements = true;
    },
    async reloadBaking({ limit, page }) {
      this.loading.baking = true;
      const props = {
        page,
        limit,
        account: this.hash,
      };

      if (page === 1) {
        const total = await this.$api.getAccountBakingTotal({
          account: this.hash,
        });
        const future = await this.$api.getAccountBakingFuture({
          account: this.hash,
        });
        const data = await this.$api.getAccountBaking(props);

        this.baking.total = { ...total.data, status: 'Total' };
        this.baking.future = future.data.map((item) => ({
          ...item,
          class: 'future',
        }));

        this.baking.data = [
          ...this.baking.future,
          { ...total.data, cycle: 'Total', class: 'total', status: 'Total' },
          ...data.data,
        ];

        this.counts.baking = data.count;
      } else {
        const data = await this.$api.getAccountBaking(props);
        this.baking.data = data.data;
      }

      this.loading.baking = false;
      this.loaded.baking = true;
    },
    async reloadRewards({ limit, page }) {
      this.loading.rewards = true;
      const props = {
        page,
        limit,
        account: this.hash,
      };

      const data = await this.$api.getAccountRewards(props);
      this.rewards = data.data;
      this.counts.rewards = data.count;
      this.loading.rewards = false;
      this.loaded.rewards = true;
    },
    async reloadBonds({ limit, page }) {
      this.loading.bonds = true;
      const props = {
        page,
        limit,
        account: this.hash,
      };

      const data = await this.$api.getAccountBonds(props);
      this.bonds = data.data;
      this.counts.bonds = data.count;
      this.loading.bonds = false;
      this.loaded.bonds = true;
    },
    async reloadEndorsing({ limit, page }) {
      this.loading.endorsing = true;
      const props = {
        page,
        limit,
        account: this.hash,
      };

      if (page === 1) {
        const total = await this.$api.getAccountEndorsingTotal({
          account: this.hash,
        });
        const future = await this.$api.getAccountEndorsingFuture({
          account: this.hash,
        });
        const data = await this.$api.getAccountEndorsing(props);

        this.endorsing.total = { ...total.data, status: 'Total' };
        this.endorsing.future = future.data.map((item) => ({
          ...item,
          class: 'future',
        }));
        this.endorsing.data = [
          ...this.endorsing.future,
          { ...total.data, cycle: 'Total', class: 'total', status: 'Total' },
          ...data.data,
        ];

        this.counts.endorsing = data.count;
      } else {
        const data = await this.$api.getAccountEndorsing(props);
        this.endorsing.data = data.data;
      }

      this.loading.endorsing = false;
      this.loaded.endorsing = true;
    },
    async reloadOperations({ limit, page }) {
      this.loading.operations = true;
      let result = [];
      let counter = 0;
      const types = ['endorsement', 'activate_account', 'double_endorsement_evidence'];
      const props = { page, limit, account_id: this.hash };

      for (let i = 0; i < types.length; i += 1) {
        const data = await this.$api.getOperations({ ...props, operation_kind: types[i] });

        result = [...result, ...data.data];
        counter += data.count;
      }

      this.operations = result;
      this.counts.operations = counter;
      this.loading.operations = false;
      this.loaded.operations = true;
    },
    async reloadBlockOtherOperations() {
      this.loading.otherOperations = true;
      const operationTypes = [
        'delegation',
        'origination',
        'activate_account',
        'double_baking_evidence',
        'double_endorsement_evidence',
      ];

      const blockHash = this.block.hash;

      const res = await this.$api.getOperations({
        block_id: blockHash,
        operation_kind: operationTypes,
        limit: 100,
      });

      if (res.status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.replace({
          name: res.status,
        });
      }

      this.blockOtherOperations = res.data;
      this.counts.blockOtherOperations = res.count;
      this.loading.otherOperations = false;
      this.loaded.blockOtherOperations = true;
    },
    async reload({ type, limit, page = 1 }) {
      if (type === 'txs') {
        await this.reloadTxs({ limit, page });
      }

      if (type === 'delegations') {
        await this.reloadDelegations({ limit, page });
      }

      if (type === 'originations') {
        await this.reloadOriginations({ limit, page });
      }

      if (type === 'endorsements') {
        await this.reloadEndorsements({ limit, page });
      }

      if (type === 'baking') {
        await this.reloadBaking({ limit, page });
      }

      if (type === 'rewards') {
        await this.reloadRewards({ limit, page });
      }

      if (type === 'bonds') {
        await this.reloadBonds({ limit, page });
      }

      if (type === 'endorsing') {
        await this.reloadEndorsing({ limit, page });
      }

      if (type === 'operations') {
        await this.reloadOperations({ limit, page });
      }

      if (type === 'blockOtherOperations') {
        await this.reloadBlockOtherOperations();
      }
    },
    handlePageChange({ type, page }) {
      const limit = this.limit[type];
      this.page[type] = page;
      this.reload({ type, limit, page });
    },
    handleLimitChange({ type, limit }) {
      this.page[type] = 1;
      const page = this.page[type];
      this.limit[type] = limit;
      this.reload({ type, limit, page });
    },
  },
};
