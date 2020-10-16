<template>
  <PageContentContainer page-name="Baking Rights">
    <template #breadcrumbs>
      <Breadcrumbs :crumbs="crumbs" />
    </template>

    <template #content>
      <section>
        <b-container fluid>
          <b-row>
            <b-col lg="12">
              <b-card class="mb-3" no-body>
                <CardHeader>
                  <template #left-content class="text">
                    <h4 class="tz-title--bold">
                      {{ $t('listTypes.futureBakingRightsList') }}
                    </h4>
                  </template>
                  <template #right-content class="text">
                    <Counter show-line :count="count.future_baking_rights" />
                  </template>
                </CardHeader>

                <b-card-body>
                  <FutureBakingRightsList />
                </b-card-body>
              </b-card>

              <b-card no-body>
                <CardHeader>
                  <template #left-content class="text">
                    <h4 class="tz-title--bold">
                      {{ $t('listTypes.pastBakingRightsList') }}
                    </h4>
                  </template>
                  <template #right-content class="text">
                    <Counter show-line :count="count.baking_rights" />
                  </template>
                </CardHeader>

                <b-card-body>
                  <BakingRightsList />
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
  import BakingRightsList from '../components/baking_rights/BakingRightsList';
  import FutureBakingRightsList from '../components/baking_rights/FutureBakingRightsList';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';

  export default {
    name: 'BakingRights',
    components: {
      PageContentContainer,
      Breadcrumbs,
      BakingRightsList,
      FutureBakingRightsList,
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
          {
            toRouteName: 'baking_rights',
            text: this.$t('common.bakingRights'),
          },
        ];
      },
    },
  };
</script>
