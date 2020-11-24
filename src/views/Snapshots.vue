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
                  <div class="d-flex align-items-center flex-wrap">
                    <h4 class="tz-title--bold">
                      {{ $t('listTypes.snapshotsList') }}
                    </h4>

                    <IconTooltip :tooltip-txt="$t('tooltips.snapshots')" />
                  </div>
                </template>
                <template #right-content class="text">
                  <Counter show-line :count="count" :loading="loading" />
                </template>
              </CardHeader>

              <b-card-body>
                <SnapshotsList
                  :loading="loading"
                  :limit="limit"
                  :items="items"
                  :count="count"
                  :page="page"
                  @onPageChange="handlePageChange"
                />
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </section>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex';
  import { SET_SNAPSHOTS_COUNT } from '@/store/mutations.types';
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import SnapshotsList from '../components/snapshots/SnapshotsList';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';
  import IconTooltip from '@/components/partials/IconTooltip';
  import reloadNavigationList from '@/mixins/reloadNavigationList';

  export default {
    name: 'Snapshots',
    components: {
      Breadcrumbs,
      SnapshotsList,
      CardHeader,
      Counter,
      IconTooltip,
    },
    mixins: [reloadNavigationList],
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'snapshots',
            text: this.$t('pageTypes.snapshotsPage'),
          },
        ];
      },
    },
    methods: {
      ...mapMutations('blocks', [SET_SNAPSHOTS_COUNT]),
      async reload() {
        const { page, limit } = this;
        await this.$api.getSnapshots({ page, limit }).then((data) => {
          this.items = data.data;
          this.count = data.count;
          this[SET_SNAPSHOTS_COUNT](data.count);
        });
      },
    },
  };
</script>
