<template>
  <header class="main-header">
    <b-navbar toggleable="xl" :sticky="true">
      <b-navbar-brand href="#">
        <router-link
          :to="{ name: 'network', params: { network: currentNetwork } }"
        >
          <Logo />
        </router-link>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item-dropdown :text="$tc('common.block', 2)">
            <b-dropdown-item
              :to="{ name: 'blocks', params: { network: currentNetwork } }"
            >
              {{ $tc('common.block', 2) }}
            </b-dropdown-item>
            <b-dropdown-item
              :to="{ name: 'snapshots', params: { network: currentNetwork } }"
            >
              {{ $tc('common.snapshot', 2) }}
            </b-dropdown-item>
            <b-dropdown-item
              :to="{
                name: 'baking_rights',
                params: { network: currentNetwork },
              }"
            >
              {{ $tc('common.bakingRights', 2) }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown :text="$t('header.operations')">
            <b-dropdown-item
              :to="{ name: 'txs', params: { network: currentNetwork } }"
            >
              {{ $tc('opTypes.tx', 2) }}
            </b-dropdown-item>
            <b-dropdown-item
              :to="{
                name: 'endorsements',
                params: { network: currentNetwork },
              }"
            >
              {{ $tc('opTypes.endorsement', 2) }}
            </b-dropdown-item>
            <b-dropdown-item
              :to="{
                name: 'delegations',
                params: { network: currentNetwork },
              }"
            >
              {{ $tc('opTypes.delegation', 2) }}
            </b-dropdown-item>
            <b-dropdown-item
              :to="{
                name: 'originations',
                params: { network: currentNetwork },
              }"
            >
              {{ $tc('opTypes.origination', 2) }}
            </b-dropdown-item>
            <b-dropdown-item
              :to="{
                name: 'activations',
                params: { network: currentNetwork },
              }"
            >
              {{ $tc('opTypes.activation', 2) }}
            </b-dropdown-item>
            <b-dropdown-item
              :to="{
                name: 'double_baking',
                params: { network: currentNetwork },
              }"
            >
              {{ $tc('opTypes.doubleBaking', 2) }}
            </b-dropdown-item>
            <b-dropdown-item
              :to="{
                name: 'double_endorsement',
                params: { network: currentNetwork },
              }"
            >
              {{ $tc('opTypes.doubleEndorsement', 2) }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown :text="$tc('common.baker', 2)">
            <b-dropdown-item
              :to="{ name: 'bakers', params: { network: currentNetwork } }"
            >
              {{ $t('header.allBakers') }}
            </b-dropdown-item>
            <b-dropdown-item
              :to="{
                name: 'public_bakers',
                params: { network: currentNetwork },
              }"
            >
              {{ $t('header.publicBakers') }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown :text="$tc('common.acc', 2)">
            <b-dropdown-item
              :to="{
                name: 'top_accounts',
                params: { network: currentNetwork },
              }"
            >
              {{ $t('common.topAcc') }}
            </b-dropdown-item>
            <b-dropdown-item
              :to="{ name: 'accounts', params: { network: currentNetwork } }"
            >
              {{ $tc('common.acc', 2) }}
            </b-dropdown-item>
            <b-dropdown-item
              :to="{ name: 'contracts', params: { network: currentNetwork } }"
            >
              {{ $tc('common.contract', 2) }}
            </b-dropdown-item>
            <b-dropdown-item
              :to="{ name: 'assets', params: { network: currentNetwork } }"
            >
              {{ $t('common.assets') }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown
            :text="$t('header.governance')"
            :disabled="currentNetwork !== 'mainnet'"
          >
            <b-dropdown-item :to="{ name: 'protocol_amendment' }">
              {{ $t('common.protocolAmendments') }}
            </b-dropdown-item>

            <b-dropdown-item :to="{ name: 'protocols' }">
              {{ $t('listTypes.protocolsList') }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown
            :text="$t('header.charts')"
            :disabled="currentNetwork !== 'mainnet'"
          >
            <b-dropdown-item :to="{ name: 'general_charts' }">
              {{ $t('header.general') }}
            </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'baking_charts' }">
              {{ $t('common.baking') }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown :text="$t('header.resources')">
            <b-dropdown-item :to="{ name: 'glossary' }">
              {{ $t('glossary.title') }}
            </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'feedback' }">
              {{ $t('feedback.title') }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown
            :text="$t(`nets.${currentNetwork}`)"
            right
            :disabled="!networkChangable"
          >
            <b-dropdown-item
              v-for="network in networkList"
              class="pointer"
              :key="generateKey()"
              @click="changeRouteNetwork(network)"
            >
              {{ $t(`nets.${network}`) }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown class="date-switcher">
            <template slot="button-content">
              <font-awesome-icon icon="cog" />
            </template>
            <b-dropdown-text>
              {{ $t('header.dateFormat') }}
              <DateFormatSwitcher class="pointer" :is-switch-only="true" />
            </b-dropdown-text>
            <b-dropdown-text>
              <CurrencySwitcher />
            </b-dropdown-text>
          </b-nav-item-dropdown>
          <LanguageSwitcher />
          <b-nav-form v-if="isSearchVisible" class="search">
            <Search :placeholder="$t('search.placeholder')" />
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </header>
</template>

<script>
  import { mapMutations, mapState, mapGetters } from 'vuex';
  import { SET_APP_NETWORK } from '@/store/mutations.types.js';
  import network from '../../../mixins/network';
  import Search from '../Search';
  import uuid from '@/mixins/uuid';
  import DateFormatSwitcher from '@/components/partials/DateFormatSwitcher';
  import CurrencySwitcher from '@/components/partials/CurrencySwitcher';
  import LanguageSwitcher from '@/components/partials/LanguageSwitcher';
  import Logo from '../icons/Logo';

  export default {
    name: 'TopMenu',
    components: {
      Search,
      DateFormatSwitcher,
      CurrencySwitcher,
      LanguageSwitcher,
      Logo,
    },
    mixins: [network, uuid],
    data() {
      return {
        isSearchVisible: true,
      };
    },
    computed: {
      ...mapState('app', {
        network: (state) => state.network,
      }),
      ...mapGetters('app', {
        currentNetwork: 'getAppNetwork',
        networkList: 'getAppNetworkList',
        networkChangable: 'getAppNetworkChangable',
      }),
    },
    watch: {
      $route: {
        deep: true,
        immediate: true,
        handler(to) {
          this.isSearchVisible = to.name !== 'network';
        },
      },
    },
    methods: {
      ...mapMutations('app', [SET_APP_NETWORK]),
      isActive(...args) {
        return args.includes(this.$route.name);
      },
      changeRouteNetwork(network) {
        const { currentNetwork } = this;

        if (currentNetwork !== network) {
          this[SET_APP_NETWORK](network);
          this.$router.push({ name: 'network', params: { network } });
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  .header-middle,
  .search {
    display: inline-block;
  }

  .pointer {
    cursor: pointer;
  }

  .main-nav .dropdown-item,
  .main-nav .dropdown-toggle {
    text-transform: capitalize;
  }
</style>
