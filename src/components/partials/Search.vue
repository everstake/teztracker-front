<template>
  <b-form
    :class="error ? 'search-form--invalid' : ''"
    class="search__form"
    @submit.prevent="onSubmit"
  >
    <div class="search-form__input">
      <b-form-input
        ref="searchInput"
        type="text"
        v-model.trim="searchQuery"
        :placeholder="placeholder"
        class="search-query"
        @input="handleInputChange"
        :readonly="loading && !publicBakersSearchFetching"
        autocomplete="off"
        autofocus
      />

      <b-button @click="onSubmit" class="button-search" :disabled="loading">
        <font-awesome-icon
          :class="loading ? 'spinner' : 'icon-white'"
          :icon="loading ? 'spinner' : 'search'"
          :spin="loading"
        />
      </b-button>
    </div>
    <div
      v-if="filterpublicBakersSearchBySearchQuery.length > 0 && searchQuery !== ''"
      class="search-form__dropdown"
    >
      <ul class="search-form__list">
        <li
          v-for="baker in filterpublicBakersSearchBySearchQuery"
          :key="generateKey()"
          @click="handleDropdownClick(baker.accountId)"
          :class="{
            'search-form__item--selectable': true,
            'search-form__item--active': baker.class === 'active',
          }"
          class="search-form__item"
        >
          {{ baker.name }}
        </li>
      </ul>
    </div>
  </b-form>
</template>

<script>
  import isFinite from 'lodash/isFinite';
  import startsWith from 'lodash/startsWith';
  import numeral from 'numeral';
  import { mapActions, mapState } from 'vuex';
  import { GET_PUBLIC_BAKERS_SEARCH } from '@/store/actions.types';
  import uuid from '@/mixins/uuid';

  export default {
    name: 'Search',
    mixins: [uuid],
    data() {
      return {
        searchQuery: '',
        error: '',
        loading: false,
        publicBakersSearchFetching: false,
        publicBakersSearchDefaultLimit: 200,
      };
    },
    props: {
      placeholder: {
        type: String,
        default() {
          return this.$t('search.placeholder');
        },
      },
    },
    methods: {
      ...mapActions('accounts', [GET_PUBLIC_BAKERS_SEARCH]),
      async searchByPublicBaker(accountId) {
        const data = await this.$api.getAccount({ account: accountId });
        const status = data.status;
        let routerSettings;
        if (data.data.is_baker) {
          routerSettings = { name: 'baker', params: { baker: accountId } };
        } else {
          routerSettings = { name: 'account', params: { account: accountId } };
        }
        const requestStatus = status;
        this.resolveSearch(routerSettings, requestStatus);
      },
      async fetchpublicBakersSearch(limit) {
        this.publicBakersSearchFetching = true;
        await this[GET_PUBLIC_BAKERS_SEARCH]({ limit });
        this.publicBakersSearchFetching = false;
      },
      async handleDropdownClick(accountId) {
        if (this.loading) {
          return;
        }

        this.loading = true;

        const findedIndex = this.publicBakersSearch.findIndex(
          (baker) => baker.accountId === accountId,
        );
        const findedEntry = this.publicBakersSearch[findedIndex];
        this.$set(this.publicBakersSearch, findedIndex, {
          ...findedEntry,
          class: 'active',
        });
        await this.searchByPublicBaker(accountId);
        delete findedEntry.class;
        this.$set(this.publicBakersSearch, findedIndex, findedEntry);

        this.loading = false;
      },
      async handleInputChange() {
        const { publicBakersSearchDefaultLimit } = this;
        this.error = '';

        if (!this.publicBakersSearchFetching && !this.publicBakersSearchFetched && !this.loading) {
          await this.fetchpublicBakersSearch(publicBakersSearchDefaultLimit);
        }
      },
      resolveSearch(props, status) {
        if (status !== this.$constants.STATUS_SUCCESS) {
          return this.$router.push({ name: status });
        }

        this.$router.push({ ...props });
      },
      async onSubmit() {
        if (this.loading) {
          return;
        }

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
          const searchStrFormatted = numeral(searchStr).format('0');
          const { status } = await this.$api.getBlock({
            block: searchStrFormatted,
          });
          routerSettings = {
            name: 'block',
            params: { level: searchStrFormatted },
          };
          requestStatus = status;
        }

        // block hash
        for (const prefix of this.$constants.SEARCH_PREFIXES.block) {
          if (startsWith(searchStr, prefix)) {
            const res = await this.$api.getBlock({ block: searchStr });
            const { status } = res;

            if (res.data.block) {
              const { level } = res.data.block;
              routerSettings = { name: 'block', params: { level } };
            }
            requestStatus = status;
            this.searchQuery = '';
          }
        }
        // transactions
        for (const prefix of this.$constants.SEARCH_PREFIXES.operation) {
          if (startsWith(searchStr, prefix)) {
            const { status } = await this.$api.getTransactions({
              txhash: searchStr,
            });
            routerSettings = { name: 'tx', params: { txhash: searchStr } };
            requestStatus = status;
            this.searchQuery = '';
          }
        }
        // account
        for (const prefix of this.$constants.SEARCH_PREFIXES.account) {
          if (startsWith(searchStr, prefix)) {
            const { status, data } = await this.$api.getAccount({
              account: searchStr,
            });
            const isBaker = data.is_baker;

            if (isBaker) {
              routerSettings = { name: 'baker', params: { baker: searchStr } };
              requestStatus = status;
            } else {
              routerSettings = {
                name: 'account',
                params: { account: searchStr },
              };
              requestStatus = status;
            }

            this.searchQuery = '';
          }
        }

        // baker
        for (const prefix of this.$constants.SEARCH_PREFIXES.account) {
          if (startsWith(searchStr, prefix)) {
            const data = await this.$api.getAccount({ account: searchStr });
            const status = data.status;
            if (data.data.is_baker) {
              routerSettings = { name: 'baker', params: { baker: searchStr } };
            } else {
              routerSettings = {
                name: 'account',
                params: { account: searchStr },
              };
            }
            requestStatus = status;
            this.searchQuery = '';
          }
        }

        if (routerSettings === null && requestStatus === null) {
          if (this.filterpublicBakersSearchBySearchQuery.length > 0) {
            this.$set(this.filterpublicBakersSearchBySearchQuery, 0, {
              ...this.filterpublicBakersSearchBySearchQuery[0],
              class: 'active',
            });
            const data = await this.$api.getAccount({
              account: this.filterpublicBakersSearchBySearchQuery[0].accountId,
            });
            const status = data.status;
            if (data.data.is_baker) {
              routerSettings = {
                name: 'baker',
                params: {
                  baker: this.filterpublicBakersSearchBySearchQuery[0].accountId,
                },
              };
              requestStatus = status;
            } else {
              routerSettings = {
                name: 'account',
                params: {
                  baker: this.filterpublicBakersSearchBySearchQuery[0].accountId,
                },
              };
              requestStatus = status;
            }
          } else {
            const { publicBakersSearchDefaultLimit } = this;
            const fetchedBakersSize = this.publicBakersSearch.length;

            if (fetchedBakersSize === publicBakersSearchDefaultLimit) {
              await this.fetchpublicBakersSearch(this.publicBakersSearchCount);
            } else {
              this.error = 'Public baker not found.';
              this.$refs.searchInput.$el.focus();
            }
          }
        }

        this.loading = false;

        this.resolveSearch(routerSettings, requestStatus);
      },
      validateForm() {
        const { searchQuery } = this;

        if (searchQuery === '') {
          this.error = 'Search string should not be empty.';
          return false;
        }

        return true;
      },
    },
    computed: {
      publicBakersSearchFetched() {
        return this.publicBakersSearch.length > 0;
      },
      filterpublicBakersSearchBySearchQuery() {
        const { publicBakersSearch } = this;
        const { searchQuery } = this;

        if (publicBakersSearch && publicBakersSearch.length > 0) {
          return publicBakersSearch.filter(({ name }) => {
            return name.toLowerCase().includes(searchQuery.toLowerCase());
          });
        } else {
          return [];
        }
      },
      ...mapState('accounts', {
        publicBakersSearch: (state) => state.publicBakersSearch,
        publicBakersSearchCount: (state) => state.counts.publicBakersSearch,
      }),
    },
  };
</script>

<style lang="scss" scoped>
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

  .search-form {
    position: relative;

    &__input {
      margin-bottom: 5px;
      position: relative;
    }

    &__dropdown {
      z-index: 3;
      position: absolute;
      left: 0;
      right: 0;
      max-height: 200px;
      overflow: auto;
      background-color: #fff;
      border: 1px solid #d8d8d8;
      border-radius: 3px;
    }

    &__list {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    &__item {
      font-size: 14px;
      color: #212529;
      padding: 10px 20px;

      &--selectable,
      &--active {
        cursor: pointer;
      }

      &:hover,
      &:focus {
        color: #16181b;
        text-decoration: none;
        background-color: #f8f9fa;
      }

      &:active {
        color: #fff;
        background-color: $color-brand;
      }

      &--active,
      &--active:hover,
      &--active:focus {
        color: #fff;
        background-color: $color-brand;
      }
    }
  }
</style>
