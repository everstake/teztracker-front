<template>
  <div
    :class="error ? 'search-form--invalid' : ''"
    class="search__form"
  >
    <b-form-input
      type="text"
      v-model.trim="searchQuery"
      placeholder="Search for block, txn or address"
      class="search-query"
      @input="error = ''"
      :readonly="loading"
    />

    <span v-if="error" class="search-form--error">{{ error }}</span>

    <b-button type="submit" class="button-search" :disabled="loading">
      <font-awesome-icon
        class="icon-white"
        :icon="loading ? 'spinner' : 'search'"
        :spin="loading"
        @click="onSubmit"
      />
    </b-button>
  </div>
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
    resolveSearch(props, status) {
      if (status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.push({ name: status });
      }

      this.$router.push({ ...props });
    },
    async onSubmit() {
      this.loading = true;

      const searchStr = this.searchQuery;
      const isFormValid = this.validateForm();
      let routerSettings;
      let requestStatus;

      if (!isFormValid) {
        this.loading = false;
        return;
      }

      // block id
      if (isFinite(parseInt(searchStr))) {
        const { status } = await this.$api.getBlock({ block: searchStr });
        routerSettings = { name: "block", params: { level: searchStr } };
        requestStatus = status;
      }

      //block hash
      for (const prefix of this.$constants.SEARCH_PREFIXES.block) {
        if (startsWith(searchStr, prefix)) {
          const { status } = await this.$api.getBlock({ block: searchStr });
          routerSettings = { name: "block", params: { level: searchStr } };
          requestStatus = status;
        }
      }
      //transactions
      for (const prefix of this.$constants.SEARCH_PREFIXES.operation) {
        if (startsWith(searchStr, prefix)) {
          const { status } = await this.$api.getTransactions({ txhash: searchStr });
          routerSettings = { name: "tx", params: { txhash: searchStr } };
          requestStatus = status;
        }
      }
      //account
      for (const prefix of this.$constants.SEARCH_PREFIXES.account) {
        if (startsWith(searchStr, prefix)) {
          const { status } = await this.$api.getAccount({ account: searchStr });
          routerSettings = { name: "account", params: { account: searchStr } };
          requestStatus = status;
        }
      }

      this.searchQuery = "";
      this.loading = false;

      this.resolveSearch(routerSettings, requestStatus);
    },
    findQueryPrefix(searchQuery) {
      const prefixesArray = flatten(
        Object.values(this.$constants.SEARCH_PREFIXES)
      );
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
        this.error = `Search for an ${Object.keys(
          this.$constants.SEARCH_PREFIXES
        ).join(" or ")}.`;
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

.search__form {
  display: block;
}
</style>
