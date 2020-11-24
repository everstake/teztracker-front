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
                      {{ $t('listTypes.protocolsList') }}
                    </h4>

                    <IconTooltip :tooltip-txt="$t('tooltips.protocols')" />
                  </div>
                </template>
                <template #right-content class="text">
                  <Counter
                    show-line
                    :count="protocolsCount"
                    :loading="loading"
                  />
                </template>
              </CardHeader>

              <b-card-body>
                <ProtocolsList :loading="loading" @onLoading="handleLoading" />
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
  import IconTooltip from '@/components/partials/IconTooltip';
  import ProtocolsList from '@/components/protocol/ProtocolsList';

  export default {
    name: 'Protocols',
    components: {
      Breadcrumbs,
      CardHeader,
      ProtocolsList,
      Counter,
      IconTooltip,
    },
    data() {
      return {
        loading: false,
      };
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
    methods: {
      handleLoading(payload) {
        this.loading = payload;
      },
    },
  };
</script>
