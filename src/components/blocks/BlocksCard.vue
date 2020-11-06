<template>
  <b-card no-body class="blocks-card">
    <CardHeader>
      <template v-slot:left-content class="text">
        <h4 class="tz-title--bold">
          {{ $t('listTypes.blocksList') }}
        </h4>
      </template>
      <template v-slot:right-content class="text">
        <Counter show-line :count="count" />
      </template>
    </CardHeader>

    <b-card-body>
      <BlocksTable
        :loading="loading"
        :limit="limit"
        :items="items"
        :count="count"
        :page="page"
        :props-fields="fields"
      />

      <div class="blocks-card__actions">
        <router-link class="blocks-card__link link fs-14" :to="{ name: 'blocks' }">
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
  import reloadNavigationList from '@/mixins/reloadNavigationList';

  export default {
    name: 'BlocksCard',
    components: {
      BlocksTable,
      CardHeader,
      Counter,
    },
    mixins: [reloadNavigationList],
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
    methods: {
      async reload() {
        const { page, limit } = this;
        this.loading = true;
        const data = await this.$api.getBlocks({ page, limit });
        this.loading = false;
        this.items = data.data;
        this.count = data.count;
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
</style>
