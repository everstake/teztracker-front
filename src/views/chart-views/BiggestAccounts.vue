<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <b-container fluid>
        <b-row>
          <b-col lg="12">
            <b-card no-body>
              <BiggestAccountsGraph />
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </section>

    <section>
      <b-container fluid>
        <b-row>
          <b-col lg="12">
            <b-card no-body>
              <CardHeader>
                <template #left-content class="text">
                  <h4 class="tz-title--bold">
                    {{ $t('common.biggestAccounts') }}
                  </h4>
                </template>

                <template #right-content class="text">
                  <Counter
                    show-line
                    :count="accounts ? accounts.length : 0"
                    :loading="loading"
                  />
                </template>
              </CardHeader>

              <b-card-body>
                <div v-if="loading || !accounts" class="table-skeleton">
                  <b-skeleton-table
                    responsive
                    :rows="3"
                    :columns="5"
                    :table-props="{ borderless: true, responsive: true }"
                    animation="none"
                    class="table-skeleton"
                  />
                </div>

                <b-table
                  v-else
                  show-empty
                  :items="items"
                  :fields="fields"
                  :current-page="page"
                  :per-page="0"
                  borderless
                  class="transactions-table table-responsive-md"
                >
                  <template #cell(number)="{ index }">
                    {{ index + 1 + limit * (page - 1) }}
                  </template>

                  <template #cell(balance)="{ item }">
                    <span>{{ item.balance | denominate }}</span>
                  </template>

                  <template #cell(address)="{ item }">
                    <IdentIcon :seed="item.address" />

                    <b-link
                      :to="{
                        name: 'account',
                        params: { account: item.address },
                      }"
                    >
                      {{ item.address | longhash }}
                    </b-link>

                    <BtnCopy :text-to-copy="item.address" />
                  </template>
                </b-table>

                <PaginationNav
                  :limit="10"
                  :page="page"
                  :count="accounts ? accounts.length : 0"
                  :loading="loading"
                  @onPageChange="onPageChange"
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
  import Breadcrumbs from '@/components/partials/Breadcrumbs';
  import BiggestAccountsGraph from '@/components/charts/biggestAccountsGraph/BiggestAccountsGraph';
  import PaginationNav from '@/components/partials/PaginationNav';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import CardHeader from '@/components/partials/CardHeader';
  import Counter from '@/components/partials/Counter';

  export default {
    name: 'BiggestAccounts',
    components: {
      Breadcrumbs,
      BiggestAccountsGraph,
      PaginationNav,
      BtnCopy,
      IdentIcon,
      CardHeader,
      Counter,
    },
    data() {
      return {
        loading: false,
        accounts: null,
        items: null,
        page: 1,
        limit: 10,
      };
    },
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'biggest_accounts',
            text: this.$t('common.biggestAccounts'),
          },
        ];
      },
      fields() {
        return [
          { key: 'number', label: this.$t('common.ordinalNumber') },
          { key: 'address', label: this.$t('common.address') },
          { key: 'balance', label: this.$t('common.balance') },
        ];
      },
    },
    mounted() {
      this.fetch();
    },
    methods: {
      async fetch() {
        this.loading = true;

        try {
          const { data } = await this.$api.getWhaleAccounts();
          this.accounts = data.accounts;

          this.items = data.accounts.slice(0, this.limit);
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        }

        this.loading = false;
      },
      onPageChange(page) {
        this.page = page;

        this.items = this.accounts.slice(
          (page - 1) * this.limit,
          page * this.limit,
        );
      },
    },
  };
</script>

<style lange="scss" scoped>
  .graph {
    padding: 30px;
  }
</style>
