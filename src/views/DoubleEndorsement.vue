<template>
  <PageContentContainer page-name="Double-endorsement page">
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
                      {{ $t('listTypes.dblEndorsementsList') }}
                    </h4>
                  </template>
                  <template #right-content class="text">
                    <Counter show-line :count="count.double_endorsement" />
                  </template>
                </CardHeader>

                <b-card-body>
                  <DoubleEndorsementList />
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
  import DoubleEndorsementList from '../components/double_endorsement/DoubleEndorsementList';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';

  export default {
    name: 'DoubleEndorsement',
    components: {
      PageContentContainer,
      Breadcrumbs,
      DoubleEndorsementList,
      CardHeader,
      Counter,
    },
    computed: {
      ...mapState('operations', {
        count: (state) => state.counts,
      }),
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'double_endorsement',
            text: this.$t('pageTypes.dblEndorsementsPage'),
          },
        ];
      },
    },
  };
</script>
