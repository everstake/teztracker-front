<template>
  <header class="main-header">
    <div class="logo">
      <router-link :to="{ name: 'network' }">TZTracker</router-link>
    </div>
    <div class="header-middle">
      <nav class="main-nav">
        <ul>
          <li v-bind:class="{ active: isActive('index') }">
            <router-link :to="{ name: 'network' }">Dashboard</router-link>
          </li>
          <li>
            <a
              class="dropdown-toggle"
              data-toggle="dropdown"
              href="/"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
            >Blocks</a>
            <div class="dropdown-menu">
              <router-link class="dropdown-item" :to="{ name: 'blocks' }">Blocks</router-link>
              <router-link class="dropdown-item" :to="{ name: 'snapshots' }">Snapshots</router-link>
              <router-link class="dropdown-item" :to="{ name: 'baking_rights' }">Baking Rights</router-link>
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
            >Operations</a>
            <div class="dropdown-menu">
              <router-link class="dropdown-item" :to="{ name: 'txs' }">Transactions</router-link>
              <router-link class="dropdown-item" :to="{ name: 'endorsements' }">Endorsements</router-link>
              <router-link class="dropdown-item" :to="{ name: 'delegations' }">Delegations</router-link>
              <router-link class="dropdown-item" :to="{ name: 'originations' }">Originations</router-link>
              <router-link class="dropdown-item" :to="{ name: 'activations' }">Activations</router-link>
              <router-link class="dropdown-item" :to="{ name: 'double_baking' }">Double-baking</router-link>
              <router-link
                class="dropdown-item"
                :to="{ name: 'double_endorsement' }"
              >Double-endorsement</router-link>
            </div>
          </li>
          <li v-bind:class="{ active: isActive('bakers') }">
            <router-link :to="{ name: 'bakers' }">Bakers</router-link>
          </li>
          <li>
            <a
              class="dropdown-toggle"
              data-toggle="dropdown"
              href="/"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
            >Accounts</a>
            <div class="dropdown-menu">
              <router-link class="dropdown-item" :to="{ name: 'accounts' }">Accounts</router-link>
              <router-link class="dropdown-item" :to="{ name: 'contracts' }">Contracts</router-link>
            </div>
          </li>
        </ul>
      </nav>

      <nav class="main-nav right-block">
        <ul>
          <li>
            <a
              class="dropdown-toggle"
              data-toggle="dropdown"
              href="/"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
            >{{currentNetwork}}</a>
            <div class="dropdown-menu">
              <li
                class="dropdown-item pointer"
                v-for="network in this.getAppNetworkList"
                @click="changeRouteNetwork(network)"
              >{{ network }}</li>
            </div>
          </li>
        </ul>
      </nav>
    </div>
    <div class="search">
      <Search />
    </div>
  </header>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';
import { SET_APP_NETWORK } from '@/store/mutations.types.js';
import network from "../../mixins/network";
import Search from "../search/Search";
export default {
  name: "TopMenu",
  mixins: [network],
  props: {},
  components: {
    Search
  },
  computed: {
    ...mapState('app', {
      network: state => state.app.network
    }),
    ...mapGetters('app', ['getAppNetwork', 'getAppNetworkList']),
    currentNetwork: function() {
      return this.getAppNetwork;
    }
  },
  methods: {
    ...mapMutations('app', [SET_APP_NETWORK]),
    isActive(...args) {
      return args.includes(this.$route.name);
    },
    changeRouteNetwork(network) {
      this[SET_APP_NETWORK](network);
      this.$router.push({ name: this.$route.name, params: { network } });
    }
  }
};
</script>

<style scoped lang="scss">
.pointer {
  cursor: pointer;
}

.main-nav .dropdown-item,
.main-nav .dropdown-toggle {
  text-transform: capitalize;
}
</style>
