<template>
  <div>
    <ChartsNav :chart-links="chartLinks" />

    <Breadcrumbs :crumbs="crumbs" />

    <b-container fluid>
      <h4 class="tz-title--bold mt-4 mb-3">
        General Charts
      </h4>

      <b-row>
        <b-col xl="6">
          <a :name="chartLinks.general.address.link" />
          <ChartAddress />
        </b-col>

        <b-col xl="6">
          <a :name="chartLinks.general.newAddress.link" />
          <ChartNewAddress />
        </b-col>
      </b-row>

      <b-row>
        <b-col xl="6">
          <a :name="chartLinks.general.addressWithLowBalance.link" />
          <ChartAddressWithLowBalance />
        </b-col>

        <b-col xl="6">
          <a :name="chartLinks.general.activeAddress.link" />
          <ChartActiveAddress />
        </b-col>
      </b-row>

      <b-row>
        <b-col xl="6">
          <a :name="chartLinks.general.inactiveAddress.link" />
          <ChartInactiveAddress />
        </b-col>

        <b-col xl="6">
          <a :name="chartLinks.general.smartContracts.link" />
          <ChartSmartContracts />
        </b-col>
      </b-row>

      <b-row>
        <b-col xl="6">
          <a :name="chartLinks.general.newSmartContract.link" />
          <ChartNewSmartContract />
        </b-col>
      </b-row>

      <h4 class="tz-title--bold mt-4 mb-3">
        Baker efficiency charts
      </h4>

      <b-row>
        <b-col xl="6">
          <a :name="chartLinks.efficiency.lostBlocks.link" />
          <ChartLostBlocks />
        </b-col>

        <b-col xl="6">
          <a :name="chartLinks.efficiency.endorsements.link" />
          <ChartLostEndorsements />
        </b-col>
      </b-row>

      <b-row>
        <b-col xl="6">
          <a :name="chartLinks.efficiency.lostRewards.link" />
          <ChartLostRewards />
        </b-col>
      </b-row>

      <h4 class="tz-title--bold mt-4 mb-3">
        Decentralization / Centralization data
      </h4>

      <b-row>
        <b-col xl="6">
          <a :name="chartLinks.decentralCentral.chart1.link" />
          <ChartHolding />
        </b-col>

        <b-col xl="6">
          <a :name="chartLinks.decentralCentral.chart2.link" />
          <ChartNetworkHolding />
        </b-col>
      </b-row>

      <b-row>
        <b-col xl="6">
          <a :name="chartLinks.decentralCentral.chart3.link" />
          <ChartHoldingQuorumStartVoting />
        </b-col>

        <b-col xl="6">
          <a :name="chartLinks.decentralCentral.chart4.link" />
          <ChartHoldingQuorumVoting />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import Breadcrumbs from '@/components/partials/Breadcrumbs.vue';
  import ChartAddress from '@/components/charts/baking/ChartAddress';
  import ChartNewAddress from '@/components/charts/baking/ChartNewAddress';
  import ChartAddressWithLowBalance from '@/components/charts/baking/ChartAddressWithLowBalance';
  import ChartActiveAddress from '@/components/charts/baking/ChartActiveAddress';
  import ChartInactiveAddress from '@/components/charts/baking/ChartInactiveAddress';
  import ChartSmartContracts from '@/components/charts/baking/ChartSmartContracts';
  import ChartNewSmartContract from '@/components/charts/baking/ChartNewSmartContract';
  import ChartLostBlocks from '@/components/charts/baking/ChartLostBlocks';
  import ChartLostEndorsements from '@/components/charts/baking/ChartLostEndorsements';
  import ChartLostRewards from '@/components/charts/baking/ChartLostRewards';
  import ChartHolding from '@/components/charts/baking/ChartHolding';
  import ChartNetworkHolding from '@/components/charts/baking/ChartNetworkHolding';
  import ChartHoldingQuorumStartVoting from '@/components/charts/baking/ChartHoldingQuorumStartVoting';
  import ChartHoldingQuorumVoting from '@/components/charts/baking/ChartHoldingQuorumVoting';
  import ChartsNav from '@/components/charts/general/ChartsNav';

  export default {
    name: 'ChartsBaking',
    components: {
      Breadcrumbs,
      ChartAddress,
      ChartNewAddress,
      ChartAddressWithLowBalance,
      ChartActiveAddress,
      ChartInactiveAddress,
      ChartSmartContracts,
      ChartNewSmartContract,
      ChartLostBlocks,
      ChartLostEndorsements,
      ChartLostRewards,
      ChartHolding,
      ChartNetworkHolding,
      ChartHoldingQuorumStartVoting,
      ChartHoldingQuorumVoting,
      ChartsNav,
    },
    data() {
      return {
        chartLinks: {
          general: {
            address: { link: 'address', title: 'Number of address' },
            newAddress: { link: 'newAddress', title: 'Number of new address' },
            addressWithLowBalance: {
              link: 'addressWithLowBalance',
              title: 'Number of address (balance <1 xtz)',
            },
            activeAddress: {
              link: 'activeAddress',
              title: 'Number of active addresses',
            },
            inactiveAddress: {
              link: 'inactiveAddress',
              title: 'Number of inactive addresses',
            },
            smartContracts: {
              link: 'smartContracts',
              title: 'Number of Smart Contracts',
            },
            newSmartContract: {
              link: 'newSmartContract',
              title: 'Number of new SC',
            },
          },
          efficiency: {
            lostBlocks: { link: 'lostBlocks', title: 'Lost blocks' },
            endorsements: { link: 'endorsements', title: 'Lost endorsements' },
            lostRewards: { link: 'lostRewards', title: 'Lost rewards' },
          },
          decentralCentral: {
            chart1: { link: 'chart1', title: 'Chart 1' },
            chart2: { link: 'chart2', title: 'Chart 2' },
            chart3: { link: 'chart3', title: 'Chart 3' },
            chart4: { link: 'chart4', title: 'Chart 4' },
          },
        },
        showNavigation: false,
      };
    },
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'baking_charts',
            text: this.$t('pageTypes.bakingChartsPage'),
          },
        ];
      },
    },
    mounted() {
      window.document.querySelector('html').style = 'scroll-behavior: smooth;';
    },
    unmounted() {
      window.document.querySelector('html').style = 'scroll-behavior: auto;';
    },
  };
</script>
