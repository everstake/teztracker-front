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
                    {{ $t('listTypes.protocolsList') }}
                  </h4>
                </template>
                <template #right-content class="text">
                  <Counter show-line :count="protocolsCount" :loading="loading" />
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
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';
  import ProtocolsList from '@/components/protocol/ProtocolsList';

  export default {
    name: 'Protocols',
    components: {
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
