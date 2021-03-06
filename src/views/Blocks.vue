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
                      {{ $t('listTypes.blocksList') }}
                    </h4>

                    <IconTooltip :tooltip-txt="$t('tooltips.blocks')" />
                  </div>
                </template>
                <template #right-content class="text">
                  <Counter show-line :count="count" :loading="loading" />
                </template>
              </CardHeader>

              <b-card-body>
                <BlocksList
                  :loading="loading"
                  :limit="limit"
                  :items="items"
                  :count="count"
                  :page="page"
                  @onLimitChange="handleLimitChange"
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
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import BlocksList from '../components/blocks/BlocksList';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';
  import IconTooltip from '@/components/partials/IconTooltip';
  import { SET_BLOCK } from '@/store/mutations.types';
  import reloadNavigationTable from '@/mixins/reloadNavigationList';
  import wsListHandler from '@/mixins/wsListsHandler';

  export default {
    name: 'Blocks',
    components: {
      Breadcrumbs,
      BlocksList,
      CardHeader,
      Counter,
      IconTooltip,
    },
    mixins: [reloadNavigationTable, wsListHandler],
    data() {
      return {
        // Expected in wsListHandler.js mixin
        subscriptionChannel: 'blocks',
      };
    },
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          { toRouteName: 'blocks', text: this.$t('pageTypes.blocksPage') },
        ];
      },
    },
    methods: {
      ...mapMutations('blocks', [SET_BLOCK]),
      async reload() {
        const { page, limit } = this;
        await this.$api
          .getBlocks({ page, limit })
          .then((data) => {
            this.items = data.data;
            this.count = data.count;
            this[SET_BLOCK](data);
          })
          .catch(() => {});
      },
    },
  };
</script>
