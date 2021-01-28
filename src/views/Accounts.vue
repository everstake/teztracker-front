<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <b-container fluid>
        <b-row>
          <b-col lg="12">
            <b-card no-body>
              <CardHeader>
                <template #left-content class="text">
                  <h4 class="tz-title--bold">
                    {{ $t('listTypes.accsList') }}
                  </h4>
                </template>
                <template #right-content class="text">
                  <Counter show-line :count="count" :loading="loading" />
                </template>
              </CardHeader>

              <b-card-body>
                <AccountsList
                  :loading="loading"
                  :limit="limit"
                  :items="items"
                  :count="count"
                  :page="page"
                  @onLimitChange="handleLimitChange"
                  @onPageChange="handlePageChange"
                />
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </section>
  </div>
</template>

<script>
  import { mapMutations, mapState } from 'vuex';
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import AccountsList from '../components/accounts/AccountsList';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';
  import { SET_ACCOUNTS } from '@/store/mutations.types';
  import reloadNavigationList from '@/mixins/reloadNavigationList';
  import wsListsHandler from '@/mixins/wsListsHandler';

  export default {
    name: 'Accounts',
    components: {
      Breadcrumbs,
      AccountsList,
      Counter,
      CardHeader,
    },
    mixins: [reloadNavigationList, wsListsHandler],
    data() {
      return {
        // Expected in wsListHandler.js mixin
        subscriptionChannel: 'accounts',
      };
    },
    computed: {
      ...mapState('user', ['favorites', 'notes']),
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          { toRouteName: 'accounts', text: this.$t('pageTypes.accsPage') },
        ];
      },
    },
    methods: {
      ...mapMutations('accounts', [SET_ACCOUNTS]),
      async reload() {
        const options = { page: this.page, limit: this.limit, favorites: this.favorites.map((fav) => fav.accountId) };
        await this.$api
          .getAccounts(options)
          .then((data) => {
            this.items = data.data;
            this.count = data.count;
            this[SET_ACCOUNTS](data);
          })
          .catch(() => {});
      },
      handleNoteSave(payload) {
        const foundIndex = this.items.findIndex(
            (item) => item.accountId === payload.accountId,
        );
        if (foundIndex > -1) {
          this.items = [
            ...this.items.slice(0, foundIndex),
            { ...this.items[foundIndex], accountName: payload.alias },
            ...this.items.slice(foundIndex + 1),
          ];
        }
      },
    },
    created() {
      this.$eventBus.$on('onNoteSave', (payload) => this.handleNoteSave(payload));
    },
    watch: {
      notes: {
        immediate: true,
        handler(notes) {
          if (notes.length) {
            this.items = this.items.map((item) => {
              const foundNote = notes.find(
                  ({ address }) => address === item.accountId,
              );
              if (foundNote) {
                return { ...item, accountName: foundNote.alias };
              } else {
                return item;
              }
            });
          }
        },
      },
    },
  };
</script>
