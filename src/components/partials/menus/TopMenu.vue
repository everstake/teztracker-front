<template>
  <header class="main-header">
    <div class="logo">
      <router-link :to="{ name: 'network', params: { network: currentNetwork } }">
        <Logo />
      </router-link>
    </div>

    <div class="header-middle">
      <nav class="main-nav">
        <ul>
          <li v-bind:class="{ active: isActive('index') }">
            <router-link :to="{ name: 'network', params: { network: currentNetwork } }">Dashboard</router-link>
          </li>
          <li>
            <a
              class="dropdown-toggle"
              data-toggle="dropdown"
              href="/"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span class="d-flex align-items-center">
                Blocks
                <font-awesome-icon
                  icon="angle-down"
                  class="ml-1"
                />
              </span>
            </a>
            <div class="dropdown-menu">
              <router-link class="dropdown-item" :to="{ name: 'blocks', params: { network: currentNetwork } }">Blocks</router-link>
              <router-link class="dropdown-item" :to="{ name: 'snapshots', params: { network: currentNetwork } }">Snapshots</router-link>
              <router-link class="dropdown-item" :to="{ name: 'baking_rights', params: { network: currentNetwork } }">Baking Rights</router-link>
            </div>
          </li>
          <li>
            <a
              class="dropdown-toggle"
              data-toggle="dropdown"
              href="/"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span class="d-flex align-items-center">
                Operations
                <font-awesome-icon
                  icon="angle-down"
                  class="ml-1"
                />
              </span>
            </a>
            <div class="dropdown-menu">
              <router-link class="dropdown-item" :to="{ name: 'txs', params: { network: currentNetwork } }">Transactions</router-link>
              <router-link class="dropdown-item" :to="{ name: 'endorsements', params: { network: currentNetwork } }">Endorsements</router-link>
              <router-link class="dropdown-item" :to="{ name: 'delegations', params: { network: currentNetwork } }">Delegations</router-link>
              <router-link class="dropdown-item" :to="{ name: 'originations', params: { network: currentNetwork } }">Originations</router-link>
              <router-link class="dropdown-item" :to="{ name: 'activations', params: { network: currentNetwork } }">Activations</router-link>
              <router-link class="dropdown-item" :to="{ name: 'double_baking', params: { network: currentNetwork } }">Double-baking</router-link>
              <router-link
                class="dropdown-item"
                :to="{ name: 'double_endorsement', params: { network: currentNetwork } }"
              >Double-endorsement</router-link>
            </div>
          </li>
          <li v-bind:class="{ active: isActive('bakers') }">
            <router-link :to="{ name: 'bakers', params: { network: currentNetwork } }">Bakers</router-link>
          </li>
          <li>
            <a
              class="dropdown-toggle"
              data-toggle="dropdown"
              href="/"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span class="d-flex align-items-center">
                Accounts
                <font-awesome-icon
                  icon="angle-down"
                  class="ml-1"
                />
              </span>
            </a>
            <div class="dropdown-menu">
              <router-link class="dropdown-item" :to="{ name: 'accounts', params: { network: currentNetwork } }">Accounts</router-link>
              <router-link class="dropdown-item" :to="{ name: 'contracts', params: { network: currentNetwork } }">Contracts</router-link>
            </div>
          </li>
          <li v-if="currentNetwork === 'mainnet'">
            <a
              class="dropdown-toggle"
              data-toggle="dropdown"
              href="/"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Protocol Amendments
              <font-awesome-icon
                icon="angle-down"
                class="ml-1"
              />
            </a>
            <div class="dropdown-menu">
              <router-link class="dropdown-item" :to="{ name: 'protocol_amendment' }">All amendments</router-link>
            </div>
          </li>
        </ul>
      </nav>

      <nav class="main-nav right-block" v-if="networkChangable">
        <ul>
          <li>
            <a
              class="dropdown-toggle"
              data-toggle="dropdown"
              href="/"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span class="d-flex align-items-center">
                {{ currentNetwork }}
                <font-awesome-icon
                  icon="angle-down"
                  class="ml-1"
                />
              </span>
            </a>
            <div class="dropdown-menu">
              <div v-for="network in networkList" :key="generateKey()" @click="changeRouteNetwork(network)" class="dropdown-item pointer">
                {{ network }}
              </div>
            </div>
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
    ...mapState('app', {
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
