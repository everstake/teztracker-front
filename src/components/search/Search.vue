<template>
  <form
    :class="error ? 'search-form--invalid' : ''"
    action
    id="search-form"
    v-on:submit.prevent="onSubmit"
  >
    <input
      type="text"
      v-model.trim="searchQuery"
      placeholder="Search for block, txn or address"
      class="search-query"
      @input="error = ''"
      :readonly="loading"
    />

    <span v-if="error" class="search-form--error">{{ error }}</span>

    <button type="submit" class="button-search" :disabled="loading">
      <font-awesome-icon
        class="icon-white"
        :icon="loading ? 'spinner' : 'search'"
        :spin="loading"
      />
    </button>
  </form>
</template>

<script>
import isFinite from "lodash/isFinite";
import startsWith from "lodash/startsWith";
import some from "lodash/some";
import flatten from "lodash/flatten";

export default {
  name: "Search",
  data() {
    return {
      searchQuery: "",
      error: "",
      loading: false
    };
  },
  methods: {
    onSubmit: function() {
      this.loading = true;

      const searchStr = this.searchQuery;
      const isFormValid = this.validateForm();

      if (!isFormValid) {
        this.loading = false;
        return;
      }

      // block id
      if (isFinite(parseInt(searchStr))) {
        setTimeout(() => (this.loading = false), 100);

        return this.$router.push({
          name: "block",
          params: { level: searchStr }
        });
      }
      //block hash
      for (const prefix of this.$constants.SEARCH_PREFIXES.block) {
        if (startsWith(searchStr, prefix)) {
          setTimeout(() => (this.loading = false), 100);

          return this.$router.push({
            name: "block",
            params: { level: searchStr }
          });
        }
      }
      //transactions
      for (const prefix of this.$constants.SEARCH_PREFIXES.operation) {
        if (startsWith(searchStr, prefix)) {
          setTimeout(() => (this.loading = false), 100);

          return this.$router.push({
            name: "tx",
            params: { txhash: searchStr }
          });
        }
      }
      //account
      for (const prefix of this.$constants.SEARCH_PREFIXES.account) {
        if (startsWith(searchStr, prefix)) {
          setTimeout(() => (this.loading = false), 100);

          return this.$router.push({
            name: "account",
            params: { account: searchStr }
          });
        }
      }

      this.loading = false;
      this.searchQuery = "";

      return this.$router.push({
        name: "404"
      });
    },
    findQueryPrefix(searchQuery) {
      const prefixesArray = flatten(Object.values(this.$constants.SEARCH_PREFIXES));
      let findedPrefix = null;

      const findId = () => {
        if (isFinite(parseInt(searchQuery))) {
          findedPrefix = parseInt(searchQuery);
          return true;
        }

        return false;
      };

      const findPrefix = () => {
        return some(prefixesArray, prefix => {
          if (startsWith(searchQuery, prefix)) {
            findedPrefix = prefix;
            return true;
          }

          return false;
        });
      };

      const queryHasPrefix = findId() || findPrefix();
      return queryHasPrefix ? findedPrefix : false;
    },
    validateForm() {
      const { searchQuery } = this;
      const queryIncludesPrefix = this.findQueryPrefix(searchQuery);

      if (searchQuery === "") {
        this.error = "Search string should not be empty.";
        return false;
      }

      if (!queryIncludesPrefix) {
        this.error = `Search for an ${Object.keys(this.$constants.SEARCH_PREFIXES).join(" or ")}.`;
        return false;
      }

      return true;
    }
  }
};
</script>

<style scoped>
.icon-white {
  color: white;
}
</style>
