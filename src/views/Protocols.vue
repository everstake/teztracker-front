<template>
  <PageContentContainer page-name="Protocols page">
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
                      {{ $t('listTypes.protocolsList') }}
                    </h4>
                  </template>
                  <template #right-content class="text">
                    <Counter show-line :count="protocolsCount" />
                  </template>
                </CardHeader>

                <b-card-body>
                  <ProtocolsList />
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
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';
  import ProtocolsList from '@/components/protocol/ProtocolsList';

  export default {
    name: 'Protocols',
    components: {
      PageContentContainer,
      Breadcrumbs,
      CardHeader,
      ProtocolsList,
      Counter,
    },
    computed: {
      ...mapState('period', {
        protocolsCount: (state) => state.counts.protocols,
      }),
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'protocols',
            text: this.$t('pageTypes.protocolsPage'),
          },
        ];
      },
    },
  };
</script>
