<template>
  <form action id="search-form" v-on:submit.prevent="onSubmit">
    <input
      type="text"
      v-model.trim="searchQuery"
      class="search-query"
      placeholder="Search for block, txn or address"
    />
    <button type="submit" class="button-search">
      <font-awesome-icon class="icon-white" icon="search" />
    </button>
  </form>
</template>
<script>
import _ from "lodash";

const prefixes = {
  account: ["tz", "KT"],
  operation: ["o"],
  block: ["B"]
};

export default {
  name: "Search",
  data() {
    return {
      searchQuery: ""
    };
  },
  methods: {
    onSubmit: function() {
      this.$emit('onSubmit', false);

      const searchStr = this.$data.searchQuery;
      this.$data.searchQuery = "";
      if (_.isFinite(parseInt(searchStr))) {
        // block id
        return this.$router.push({
          name: "block",
          params: { level: searchStr }
        });
      }
      //block hash
      for (const prefix of prefixes.block) {
        if (_.startsWith(searchStr, prefix)) {
          return this.$router.push({
            name: "block",
            params: { level: searchStr }
          });
        }
      }
      //transactions
      for (const prefix of prefixes.operation) {
        if (_.startsWith(searchStr, prefix)) {
          return this.$router.push({
            name: "tx",
            params: { txhash: searchStr }
          });
        }
      }
      //account
      for (const prefix of prefixes.account) {
        if (_.startsWith(searchStr, prefix)) {
          return this.$router.push({
            name: "account",
            params: { account: searchStr }
          });
        }
      }

      return this.$router.push({
        name: "404"
      });

    }
  }
};
</script>

<style scoped>
.icon-white {
  color: white;
}
</style>
