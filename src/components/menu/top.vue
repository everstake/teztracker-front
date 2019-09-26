<template>
  <header class="main-header">
    <div class="logo">
      <router-link :to="{ name: 'index' }">TZTracker</router-link>
    </div>
    <div class="header-middle">
      <nav class="main-nav">
        <ul>
          <li v-bind:class="{ active: isActive('index') }">
            <router-link :to="{ name: 'index' }">Dashboard</router-link>
          </li>
          <li v-bind:class="{ active: isActive('blocks') }">
            <router-link :to="{ name: 'blocks' }">Blocks</router-link>
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
            </div>
          </li>
          <li v-bind:class="{ active: isActive('bakers') }">
            <router-link :to="{ name: 'bakers' }">Bakers</router-link>
          </li>
          <li v-bind:class="{ active: isActive('accounts') }">
            <router-link :to="{ name: 'accounts' }">Accounts</router-link>
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
import Search from "../search/search";
export default {
  name: "TopMenu",
  props: {},
  components: {
    Search
  },
  methods: {
    isActive(...args) {
      return args.includes(this.$route.name);
    }
  }
};
</script>

<style scoped></style>
