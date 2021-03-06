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
                    {{ $t('listTypes.publicBakersList') }}
                  </h4>
                </template>
                <template #right-content class="text">
                  <Counter show-line :count="count" :loading="loading" />
                </template>
              </CardHeader>

              <b-card-body>
                <BakersListPublic
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
  import BakersListPublic from '../components/bakers/BakersListPublic';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';
  import { SET_PUBLIC_BAKERS } from '@/store/mutations.types';
  import reloadNavigationList from '@/mixins/reloadNavigationList';

  export default {
    name: 'BakersPublic',
    components: {
      Breadcrumbs,
      BakersListPublic,
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
            toRouteName: 'public_bakers',
            text: this.$t('pageTypes.publicBakersPage'),
          },
        ];
      },
    },
    methods: {
      ...mapMutations('accounts', [SET_PUBLIC_BAKERS]),
      async reload() {
        const options = { page: this.page, limit: this.limit, favorites: this.favorites.map((fav) => fav.accountId) };
        await this.$api
          .getPublicBakers(options)
          .then((data) => {
            this.items = data.data;
            this.count = data.count;
            this[SET_PUBLIC_BAKERS](data);
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
            { ...this.items[foundIndex], bakerInfo: { ...this.items[foundIndex].bakerInfo, name: payload.alias } },
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
                return { ...item, bakerInfo: {...item.bakerInfo, name: foundNote.alias } };
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
