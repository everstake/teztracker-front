<template>
  <header class="main-header">
    <div class="logo">
      <router-link
        :to="{ name: 'network', params: { network: currentNetwork } }"
      >
        <Logo />
      </router-link>
    </div>

    <div class="header-middle">
      <nav class="main-nav">
        <ul class="main-nav__list">
          <li v-bind:class="{ active: isActive('index') }">
            <router-link
              :to="{ name: 'network', params: { network: currentNetwork } }"
              >Dashboard</router-link
            >
          </li>
          <li>
            <b-dropdown id="blocks" variant="link" class="custom-dropdown">
              <template #button-content>
                Blocks
                <font-awesome-icon icon="angle-down" class="ml-1" />
              </template>

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
            </b-dropdown>
          </li>
          <li>
            <b-dropdown id="operations" variant="link" class="custom-dropdown">
              <template #button-content>
                Operations
                <font-awesome-icon icon="angle-down" class="ml-1" />
              </template>

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
            </b-dropdown>
          </li>
          <li v-bind:class="{ active: isActive('bakers') }">
            <router-link
              :to="{ name: 'bakers', params: { network: currentNetwork } }"
              >Bakers</router-link
            >
          </li>
          <li>
            <b-dropdown id="accounts" variant="link" class="custom-dropdown">
              <template #button-content>
                Accounts
                <font-awesome-icon icon="angle-down" class="ml-1" />
              </template>

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
            </b-dropdown>
          </li>
          <li v-if="currentNetwork === 'mainnet'">
            <b-dropdown id="governance" variant="link" class="custom-dropdown">
              <template #button-content>
                Governance
                <font-awesome-icon icon="angle-down" class="ml-1" />
              </template>

              <b-dropdown-item
                :to="{ name: 'protocol_amendment' }"
              >
                Protocol Amendments
              </b-dropdown-item>

              <b-dropdown-item
                :to="{ name: 'protocols' }"
              >
                Protocols list
              </b-dropdown-item>
            </b-dropdown>
          </li>
        </ul>
      </nav>

      <nav class="main-nav right-block" v-if="networkChangable">
        <ul>
          <li>
            <b-dropdown id="blocks" variant="link" class="custom-dropdown">
              <template #button-content>
                <span class="text-capitalize">
                  {{ currentNetwork }}
                  <font-awesome-icon icon="angle-down" class="ml-1" />
                </span>
              </template>

              <b-dropdown-item-button
                v-for="network in networkList"
                @click="changeRouteNetwork(network)"
                class="dropdown-item pointer"
                :key="generateKey()"
              >
                <span class="text-capitalize">
                  {{ network }}
                </span>
              </b-dropdown-item-button>
            </b-dropdown>
          </li>
        </ul>
      </nav>
    </div>
    <div class="search">
      <Search />
    </div>

    <OverlayHamburgerMenu />
  </header>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';
import { SET_APP_NETWORK } from '@/store/mutations.types.js';
import network from "../../../mixins/network";
import Search from "../Search";
import OverlayHamburgerMenu from "./Overlay";
import uuid from '@/mixins/uuid'
import Logo from "../icons/Logo";

export default {
  name: "TopMenu",
  components: {
    Search,
    OverlayHamburgerMenu,
    Logo
  },
  mixins: [network, uuid],
  computed: {
    ...mapState("app", {
      network: state => state.app.network
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
  display: none;
  @include for-regular-desktops-up {
    display: block;
  }
}
.pointer {
  cursor: pointer;
}

.main-nav .dropdown-item,
.main-nav .dropdown-toggle {
  text-transform: capitalize;
}

.main-header {
  display: flex;
  justify-content: space-between;
}
</style>
