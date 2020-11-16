<template>
  <div class="list assets-holders">
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect
        :limit="limit"
        @onLimitChange="
          (limit) => $emit('onLimitChange', { name: 'holders', limit })
        "
        :loading="loading"
      />
    </div>

    <div v-if="loading && !loaded" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="5"
        :columns="6"
        :table-props="{ borderless: true, responsive: true }"
        animation="none"
        class="table-skeleton"
      />
    </div>
    <b-table
      v-else
      responsive
      show-empty
      :items="items"
      :fields="fields"
      :current-page="page"
      :per-page="0"
      borderless
      class="transactions-table"
      :tbody-tr-class="$_defineRowClass"
    />

    <PaginationSelect
      :total-rows="count"
      :per-page="limit"
      :current-page="page"
      :loading="loading"
      @onPageChange="(page) => $emit('onPageChange', { name: 'holders', page })"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import LimitSelect from '@/components/partials/LimitSelect';
  import PaginationSelect from '@/components/partials/PaginationSelect';
  import defineRowClass from '@/mixins/defineRowClass';

  export default {
    name: 'AssetTabHolders',
    components: {
      LimitSelect,
      PaginationSelect,
    },
    mixins: [defineRowClass],
    props: {
      block: {
        type: Object,
      },
      account: {
        type: String,
      },
      currency: String,
      precision: [String, Number],
      count: Number,
      items: Array,
      loading: Boolean,
      loaded: Boolean,
      limit: Number,
      page: Number,
    },
    computed: {
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
      fields() {
        return [
          {
            key: 'balance',
            label: this.$t('common.balance'),
          },
          {
            key: 'address',
            label: this.$t('bakerSingle.address'),
          },
        ];
      },
    },
    methods: {
      getAccountName(row, rowHash) {
        return `${row.item[`${rowHash}Name`] ||
          row.item[rowHash].slice(0, 15)}...`;
      },
    },
    created() {
      const itemsNotFetched = !this.loaded;
      const { page, limit } = this;
      if (itemsNotFetched) {
        this.$emit('onReload', { name: 'holders', page, limit });
      }
    },
  };
</script>
