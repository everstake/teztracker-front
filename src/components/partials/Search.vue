<template>
  <b-form
    :class="error ? 'search-form--invalid' : ''"
    class="search__form"
    @submit.prevent="onSubmit"
  >
    <b-form-input
      type="text"
      v-model.trim="searchQuery"
      :placeholder="placeholder"
      class="search-query"
      @input="error = ''"
      :readonly="loading"
    />

    <!--    <span v-if="error" class="search-form&#45;&#45;error">{{ error }}</span>-->

    <b-button @click="onSubmit" class="button-search" :disabled="loading">
      <font-awesome-icon
        :class="loading ? 'spinner' : 'icon-white'"
        :icon="loading ? 'spinner' : 'search'"
        :spin="loading"
      />
    </b-button>
  </b-form>
</template>

<script>
import isFinite from "lodash/isFinite";
import startsWith from "lodash/startsWith";
import some from "lodash/some";
import flatten from "lodash/flatten";
import numeral from "numeral";
import { mapActions, mapState } from "vuex";
import { GET_PUBLIC_BAKERS } from "@/store/actions.types"

export default {
  name: "Search",
  data() {
    return {
      searchQuery: "",
      error: "",
      loading: false
    };
  },
  props: {
    placeholder: {
      type: String,
      default() { return this.$t('search.placeholder') }
    }
  },
  methods: {
    ...mapActions("accounts", [GET_PUBLIC_BAKERS]),
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
      let routerSettings = null;
      let requestStatus = null;

      if (!isFormValid) {
        this.loading = false;
        return;
      }

      // block id
      if (isFinite(parseInt(searchStr))) {
        const searchStrFormatted = numeral(searchStr).format("0");
        const { status } = await this.$api.getBlock({
          block: searchStrFormatted
        });
        routerSettings = {
          name: "block",
          params: { level: searchStrFormatted }
        };
        requestStatus = status;
      }

      //block hash
      for (const prefix of this.$constants.SEARCH_PREFIXES.block) {
        if (startsWith(searchStr, prefix)) {
          // const { status } = await this.$api.getBlock({ block: searchStr });
          const res = await this.$api.getBlock({ block: searchStr });
          const { status } = res;
          const { level } = res.data.block;
          // routerSettings = { name: "block", params: { level: searchStr } };
          routerSettings = { name: "block", params: { level } };
          requestStatus = status;
          this.searchQuery = "";
        }
      }
      //transactions
      for (const prefix of this.$constants.SEARCH_PREFIXES.operation) {
        if (startsWith(searchStr, prefix)) {
          const { status } = await this.$api.getTransactions({
            txhash: searchStr
          });
          routerSettings = { name: "tx", params: { txhash: searchStr } };
          requestStatus = status;
          this.searchQuery = "";
        }
      }
      //account
      for (const prefix of this.$constants.SEARCH_PREFIXES.account) {
        if (startsWith(searchStr, prefix)) {
          const { status } = await this.$api.getAccount({ account: searchStr });
          routerSettings = { name: "account", params: { account: searchStr } };
          requestStatus = status;
          this.searchQuery = "";
        }
      }


      if (routerSettings === null && requestStatus === null) {
        const fetchedBakersSize = this.publicBakers.length;
        const foundedBakerIndex = () => this.publicBakers.findIndex(baker => baker.bakerInfo.name.toLowerCase() === searchStr.trim().toLowerCase());

        if (fetchedBakersSize === 0) {
          await this[GET_PUBLIC_BAKERS]();
        }

        if (foundedBakerIndex() >= 0) {
          const { status } = await this.$api.getAccount({ account: this.publicBakers[foundedBakerIndex()].accountId });
          routerSettings = { name: "account", params: { account: this.publicBakers[foundedBakerIndex()].accountId } };
          requestStatus = status;
          this.searchQuery = "";
        } else {
          if (fetchedBakersSize <= 10) {
            await this[GET_PUBLIC_BAKERS]({ limit: this.publicBakersCount });
          }

          if (foundedBakerIndex() >= 0) {
            const { status } = await this.$api.getAccount({ account: this.publicBakers[foundedBakerIndex()].accountId });
            routerSettings = { name: "account", params: { account: this.publicBakers[foundedBakerIndex()].accountId } };
            requestStatus = status;
            this.searchQuery = "";
          } else {
            this.error = 'Public baker not found.'
          }
        }
      }

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
      // const queryIncludesPrefix = this.findQueryPrefix(searchQuery);

      if (searchQuery === "") {
        this.error = "Search string should not be empty.";
        return false;
      }

      // if (!queryIncludesPrefix) {
      //   this.error = `Search for an ${Object.keys(
      //     this.$constants.SEARCH_PREFIXES
      //   ).join(" or ")}.`;
      //   return false;
      // }

      return true;
    }
  },
  computed: {
    ...mapState("accounts", {
      publicBakers: state => state.publicBakers,
      publicBakersCount: state => state.counts.publicBakers
    })
  }
};
</script>

<style scoped>
.icon-white {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
}

.main-header .search-query {
  position: relative;
  display: inline-flex;
}

.main-header .search__form .search-query,
.main-header .search__form .search-query::placeholder {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.5);
}
</style>
