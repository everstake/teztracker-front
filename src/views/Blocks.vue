<template>
  <PageContentContainer page-name="Blocks page">
    <template #breadcrumbs>
      <Breadcrumbs :crumbs="crumbs" />
    </template>

    <template #content>
      <section>
        <b-container fluid>
          <b-row>
            <b-col lg="12">
              <b-card no-body>
                <CardHeader>
                  <template #left-content class="text">
                    <h4 class="tz-title--bold">
                      {{ $t('listTypes.blocksList') }}
                    </h4>
                  </template>
                  <template #right-content class="text">
                    <Counter show-line :count="count.blocks" />
                  </template>
                </CardHeader>

                <b-card-body>
                  <BlocksList />
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
        </b-container>
      </section>
    </template>
  </PageContentContainer>
</template>

<script>
  import { mapState } from 'vuex';
  import PageContentContainer from '../layouts/PageContentContainer';
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import BlocksList from '../components/blocks/BlocksList';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';

  export default {
    name: 'Blocks',
    components: {
      PageContentContainer,
      Breadcrumbs,
      BlocksList,
      CardHeader,
      Counter,
    },
    computed: {
      ...mapState('blocks', {
        count: (state) => state.counts,
      }),
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          { toRouteName: 'blocks', text: this.$t('pageTypes.blocksPage') },
        ];
      },
    },
  };
</script>
