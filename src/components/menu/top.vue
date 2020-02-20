<template>
  <header class="main-header">
    <div class="logo">
      <router-link :to="{ name: 'index' }">
        <Logo />
      </router-link>
    </div>

    <div class="header-middle">
      <nav class="main-nav">
        <ul>
          <li v-bind:class="{ active: isActive('index') }">
            <router-link :to="{ name: 'index' }">Dashboard</router-link>
          </li>
          <li>
            <a
              class="dropdown-toggle"
              data-toggle="dropdown"
              href="#"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
              >Blocks</a
            >
            <div class="dropdown-menu">
              <router-link class="dropdown-item" :to="{ name: 'blocks' }"
                >Blocks</router-link
              >
              <router-link class="dropdown-item" :to="{ name: 'snapshots' }"
                >Snapshots</router-link
              >
              <router-link class="dropdown-item" :to="{ name: 'baking_rights' }"
                >Baking Rights</router-link
              >
            </div>
          </li>
          <li>
            <a
              class="dropdown-toggle"
              data-toggle="dropdown"
              href="#"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
              >Operations</a
            >
            <div class="dropdown-menu">
              <router-link class="dropdown-item" :to="{ name: 'txs' }"
                >Transactions</router-link
              >
              <router-link class="dropdown-item" :to="{ name: 'endorsements' }"
                >Endorsements</router-link
              >
              <router-link class="dropdown-item" :to="{ name: 'delegations' }"
                >Delegations</router-link
              >
              <router-link class="dropdown-item" :to="{ name: 'originations' }"
                >Originations</router-link
              >
              <router-link class="dropdown-item" :to="{ name: 'activations' }"
                >Activations</router-link
              >
              <router-link class="dropdown-item" :to="{ name: 'double_baking' }"
                >Double-baking</router-link
              >
              <router-link
                class="dropdown-item"
                :to="{ name: 'double_endorsement' }"
                >Double-endorsement</router-link
              >
            </div>
          </li>
          <li v-bind:class="{ active: isActive('bakers') }">
            <router-link :to="{ name: 'bakers' }">Bakers</router-link>
          </li>
          <li>
            <a
              class="dropdown-toggle"
              data-toggle="dropdown"
              href="#"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
              >Accounts</a
            >
            <div class="dropdown-menu">
              <router-link class="dropdown-item" :to="{ name: 'accounts' }"
                >Accounts</router-link
              >
              <router-link class="dropdown-item" :to="{ name: 'contracts' }"
                >Contracts</router-link
              >
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
              href="#"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
              >{{ currentNetwork }}</a
            >
            <div class="dropdown-menu">
              <li class="dropdown-item pointer" @click="useMainNet()">
                Mainnet
              </li>
              <li class="dropdown-item pointer" @click="useBabylon()">
                Babylon net
              </li>
              <li class="dropdown-item pointer" @click="useCarthage()">
                Carthage net
              </li>
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
import Search from "../search/search";
// import { ACTIONS } from "../../store";
import OverlayHamburgerMenu from "./Overlay";
import Logo from "../icons/logo";

export default {
  name: "TopMenu",
  data() {
    return {
      // menuConfig
    };
  },
  props: {},
  components: {
    Search,
    OverlayHamburgerMenu,
    Logo
  },
  computed: {
    currentNetwork: function() {
      switch (this.$route.params.network) {
        case "mainnet":
          return "Mainnet";
          break;
        case "babylonnet":
          return "Babylonnet";
          break;
        case "carthage":
          return "Carthage";
          break;
        default:
          return "Mainnet";
      }
      // return this.$route.params.network === "mainnet"
      //   ? "Mainnet"
      //   : "Babylonnet";
    }
  },
  methods: {
    isActive(...args) {
      return args.includes(this.$route.name);
    },
    useMainNet() {
      window.location = "/mainnet";
    },
    useBabylon() {
      window.location = "/babylonnet";
    },
    useCarthage() {
      window.location = "/carthage";
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../styles/scss/common";

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
.main-header {
  display: flex;
  justify-content: space-between;
}
@media screen {
}
</style>
