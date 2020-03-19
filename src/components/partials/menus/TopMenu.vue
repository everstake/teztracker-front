<template>
  <header class="main-header">
    <b-navbar toggleable="lg" :sticky="true">
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
          <b-nav-item-dropdown text="Blocks">
            <b-dropdown-item
              :to="{ name: 'blocks', params: { network: currentNetwork } }"
            >
              Blocks
            </b-dropdown-item>
            <b-dropdown-item
              :to="{ name: 'snapshots', params: { network: currentNetwork } }"
            >
              Snapshots
            </b-dropdown-item>
            <b-dropdown-item
              :to="{
                name: 'baking_rights',
                params: { network: currentNetwork }
              }"
            >
              Baking Rights
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="Operations">
            <b-dropdown-item
              :to="{ name: 'txs', params: { network: currentNetwork } }"
            >
              Transactions
            </b-dropdown-item>
            <b-dropdown-item
              :to="{
            name: 'endorsements',
            params: { network: currentNetwork }
          }"
            >
              Endorsements
            </b-dropdown-item>
            <b-dropdown-item
              :to="{
            name: 'delegations',
            params: { network: currentNetwork }
          }"
            >
              Delegations
            </b-dropdown-item>
            <b-dropdown-item
              :to="{
            name: 'originations',
            params: { network: currentNetwork }
          }"
            >
              Originations
            </b-dropdown-item>
            <b-dropdown-item
              :to="{
            name: 'activations',
            params: { network: currentNetwork }
          }"
            >
              Activations
            </b-dropdown-item>
            <b-dropdown-item
              :to="{
            name: 'double_baking',
            params: { network: currentNetwork }
          }"
            >
              Double-baking
            </b-dropdown-item>
            <b-dropdown-item
              :to="{
            name: 'double_endorsement',
            params: { network: currentNetwork }
          }"
            >
              Double-endorsement
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="Bakers">
            <b-dropdown-item
              :to="{ name: 'bakers', params: { network: currentNetwork } }"
            >
              All bakers
            </b-dropdown-item>
            <b-dropdown-item
              :to="{ name: 'public_bakers', params: { network: currentNetwork } }"
            >
              Public bakers
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="Accounts">
            <b-dropdown-item
              :to="{ name: 'accounts', params: { network: currentNetwork } }"
            >
              Accounts
            </b-dropdown-item>
            <b-dropdown-item
              :to="{ name: 'contracts', params: { network: currentNetwork } }"
            >
              Contracts
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="Governance" :disabled="currentNetwork !== 'mainnet'">
            <b-dropdown-item
              :to="{ name: 'protocol_amendment' }"
            >
              Protocol amendments
            </b-dropdown-item>
    
            <b-dropdown-item
              :to="{ name: 'protocols' }"
            >
              Protocols list
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown class="date-switcher">
            <template slot="button-content">
              <font-awesome-icon icon="cog" />
            </template>
            <b-form-group
              label="Table date format"
            >
              <DateFormatSwitcher class="pointer" :isSwitchOnly="true" />
            </b-form-group>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown class="text-capitalize" :text="currentNetwork" right :disabled="!networkChangable">
            <b-dropdown-item
              v-for="network in networkList"
              @click="changeRouteNetwork(network)"
              class="pointer"
              :key="generateKey()"
            >
              {{ network }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-form v-if="isSearchVisible" class="search">
            <Search :placeholder="'Block, txn or address'" />
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </header>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';
import { SET_APP_NETWORK } from '@/store/mutations.types.js';
import network from "../../../mixins/network";
import Search from "../Search";
import uuid from '@/mixins/uuid'
import DateFormatSwitcher from "@/components/partials/DateFormatSwitcher";
import Logo from "../icons/Logo";

export default {
  name: "TopMenu",
  components: {
    Search,
    DateFormatSwitcher,
    Logo
  },
  mixins: [network, uuid],
  data() {
    return {
      isSearchVisible: true
    };
  },
  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler(to) {
        if (to.name === 'network') {
          this.isSearchVisible = false;
        }
      }
    }
  },
  computed: {
    ...mapState("app", {
      network: state => state.network
    }),
    ...mapGetters('app', {
      currentNetwork: 'getAppNetwork',
      networkList: 'getAppNetworkList',
      networkChangable: 'getAppNetworkChangable'
    })
  },
  methods: {
    ...mapMutations('app', [SET_APP_NETWORK]),
    isActive(...args) {
      return args.includes(this.$route.name);
    },
    changeRouteNetwork(network) {
      this[SET_APP_NETWORK](network);

      if (this.$route.name === '404' || this.$route.name === '500') {
        this.$router.push({ name: 'network', params: { network } });
      } else {
        this.$router.push({ name: this.$route.name, params: { network } });
      }
    }
  }
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
