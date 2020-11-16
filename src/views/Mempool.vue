<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <b-container fluid>
        <b-row>
          <b-col lg="12">
            <b-card no-body>
              <CardHeader>
                <template #left-content class="text">
                  <h4 class="tz-title--bold">
                    {{ $t('listTypes.mempoolList') }}
                  </h4>
                </template>
              </CardHeader>

              <b-card-body>
                <div v-if="loading && items.length === 0" class="table-skeleton">
                  <b-skeleton-table
                    responsive
                    :rows="10"
                    :columns="5"
                    :table-props="{ borderless: true, responsive: true }"
                    animation="none"
                    class="table-skeleton"
                  />
                </div>
                <MempoolTable v-else :items="itemsPrepared" />
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </section>
  </div>
</template>

<script>
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import CardHeader from '@/components/partials/CardHeader';
  import MempoolTable from '@/components/partials/tables/MempoolTable';

  export default {
    name: 'Mempool',
    components: {
      Breadcrumbs,
      CardHeader,
      MempoolTable,
    },
    data() {
      return {
        items: [],
        loading: false,
      };
    },
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          { toRouteName: 'mempool', text: this.$t('pageTypes.mempoolPage') },
        ];
      },
      itemsPrepared() {
        if (!this.items || !this.items.length) return [];

        return this.items.map((item) => {
          item.kind = item.contents.map((contentObj) => contentObj.kind);
          return item;
        });
      },
    },
    created() {
      this.reload();
    },
    methods: {
      async reload() {
        this.loading = true;
        await this.$api
          .getMempool()
          .then((data) => {
            this.items = data.data;
          })
          .catch(() => {});
        this.loading = false;
      },
    },
  };
</script>
