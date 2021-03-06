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
                    {{ $t('listTypes.topAccountsList') }}
                  </h4>
                </template>
                <template #right-content class="text">
                  <Counter show-line :count="count" :loading="loading" />
                </template>
              </CardHeader>

              <b-card-body>
                <TopAccountsList
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
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import TopAccountsList from '../components/accounts/TopAccountsList';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';
  import reloadNavigationList from '@/mixins/reloadNavigationList';
  import { mapState } from 'vuex';

  export default {
    name: 'TopAccounts',
    components: {
      Breadcrumbs,
      TopAccountsList,
      Counter,
      CardHeader,
    },
    mixins: [reloadNavigationList],
    computed: {
      ...mapState('user', ['favorites', 'notes']),
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'top_accounts',
            text: this.$t('pageTypes.topAccountsPage'),
          },
        ];
      },
    },
    methods: {
      async reload() {
        const options = {
          page: this.page,
          limit: this.limit,
          favorites: this.favorites.map((fav) => fav.accountId)
        };
        await this.$api
          .getTopAccounts(options)
          .then((data) => {
            this.items = data.data;
            this.count = data.count;
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
      this.$eventBus.$on('onNoteSave', (payload) =>
        this.handleNoteSave(payload),
      );
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
