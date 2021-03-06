<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <div v-if="loading">
        <b-container fluid>
          <b-row>
            <b-col sm="12" md="6" lg="4" class="mb-4">
              <div class="protocol-amendment__card">
                <div class="protocol-amendment__loading font font--regular">
                  {{ $t('common.loading') }}
                </div>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </div>

      <div v-else>
        <b-container fluid>
          <b-row>
            <b-col
              v-for="(protocol, index) in protocols"
              :key="index + generateKey()"
              sm="12"
              md="6"
              lg="4"
              class="protocol-amendment__col"
            >
              <ProtocolAmendmentCard
                :id="protocol.period"
                :name="protocol.title"
                :period="
                  protocol.period === currentPeriodId
                    ? $t('protocolPeriods.current')
                    : $t('protocolPeriods.past')
                "
                @handleClick="handleProtocolClick(protocol.period)"
              />
            </b-col>
          </b-row>
        </b-container>
      </div>
    </section>
  </div>
</template>

<script>
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import ProtocolAmendmentCard from '@/components/protocol/ProtocolAmendmentCard';
  import uuid from '@/mixins/uuid';
  import uniqBy from 'lodash/uniqBy';

  export default {
    name: 'ProtocolAmendment',
    components: {
      Breadcrumbs,
      ProtocolAmendmentCard,
    },
    mixins: [uuid],
    data() {
      return {
        protocols: [],
        currentPeriodId: null,
        loading: true,
      };
    },
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'protocol_amendment',
            text: this.$t('common.protocolAmendments'),
          },
        ];
      },
    },
    async created() {
      const protocols = await this.$api.getProposals({});
      const periods = await this.$api.getPeriods({});
      const sortedProtocols = protocols.data.sort((a, b) =>
        a.period < b.period ? 1 : -1,
      );
      const uniqProtocols = uniqBy(sortedProtocols, 'period');

      const mappedProtocols = uniqProtocols.map((protocol) => {
        if (protocol.title.includes(protocol.hash.slice(0, 8))) {
          protocol.title = protocol.title.split(' ')[0];

          if (protocol.period === 21) {
            protocol.title = `${protocol.title} 1.0`;
          }

          if (protocol.period === 22) {
            protocol.title = `${protocol.title} 2.0`;
          }
        }
        return protocol;
      });

      this.currentPeriodId = Math.max(
        ...periods.data.map((period) => period.id),
      );
      this.protocols = mappedProtocols;

      this.loading = false;
    },
    methods: {
      async handleProtocolClick(id) {
        const data = await this.$api.getPeriod({ id });
        const { status } = data;

        if (status !== this.$constants.STATUS_SUCCESS) {
          return this.$router.replace({ name: status });
        }

        this.$router.push({ name: 'period', params: { id, network: 'mainnet' } });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .protocol-amendment {
    &__col {
      margin-bottom: 30px;
    }
  }
</style>
