<template>
  <b-card no-body class="blocks-card">
    <CardHeader>
      <template v-slot:left-content class="text">
        <div class="d-flex align-items-center flex-wrap">
          <h4 class="tz-title--bold">
            {{ $t('listTypes.blocksList') }}
          </h4>

          <IconTooltip :tooltip-txt="$t('tooltips.blocks')" />
        </div>
      </template>
      <template v-slot:right-content class="text">
        <Counter show-line :count="count" :loading="loading" />
      </template>
    </CardHeader>

    <b-card-body>
      <div v-if="loading" class="table-skeleton">
        <b-skeleton-table
          responsive
          :rows="10"
          :columns="3"
          :table-props="{ borderless: true, responsive: true }"
          animation="none"
        />
      </div>
      <BlocksTable
        v-else
        :loading="loading"
        :limit="limit"
        :items="items"
        :count="count"
        :page="page"
        :props-fields="fields"
      />

      <div class="blocks-card__actions">
        <router-link
          class="blocks-card__link link fs-14"
          :to="{ name: 'blocks' }"
        >
          {{ $t('common.viewAll') }}
        </router-link>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
  import CardHeader from '../partials/CardHeader';
  import Counter from '../partials/Counter';
  import BlocksTable from '@/components/partials/tables/BlocksTable';
  import IconTooltip from '@/components/partials/IconTooltip';
  import wsListsHandler from '@/mixins/wsListsHandler';

  export default {
    name: 'BlocksCard',
    components: {
      BlocksTable,
      CardHeader,
      Counter,
      IconTooltip,
    },
    mixins: [wsListsHandler],
    data() {
      return {
        limit: 10,
        items: [],
        count: 0,
        page: 1,
        loading: true,
        // Expected in wsListHandler.js mixin
        subscriptionChannel: 'blocks',
      };
    },
    computed: {
      fields() {
        if (!this.$i18n.locale) return [];
        return [
          { key: 'level', label: this.$t('common.blockId') },
          { key: 'timestamp', label: this.$t('common.timestamp') },
          { key: 'baker', label: this.$tc('common.baker', 1) },
        ];
      },
    },
    async created() {
      await this.reload();
    },
    methods: {
      async reload() {
        const { page, limit } = this;
        this.loading = true;
        await this.$api.getBlocks({ page, limit }).then((data) => {
          this.items = data.data;
          this.count = data.count;
        });
        this.loading = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .blocks-card__actions {
    text-align: center;
    margin-bottom: 10px;
  }

  .blocks-card__link {
    font-weight: bold;
  }

  .blocks-card >>> .table-skeleton tr {
    height: 52px;
  }
</style>
