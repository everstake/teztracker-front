<template>
  <section>
    <b-container fluid>
      <b-row>
        <b-col lg="12">
          <b-card no-body>
            <CardHeader>
              <template #left-content class="text">
                <h4 class="tz-title--bold">
                  {{
                    type === 'sender'
                      ? $t('listTypes.biggestSender')
                      : $t('listTypes.biggestReceiver')
                  }}
                </h4>
              </template>
            </CardHeader>

            <b-card-body>
              <div class="d-flex justify-content-between mb-2">
                <div class="limit">
                  <label for="select" class="mb-1">
                    {{ $t('common.period') }}
                  </label>

                  <b-select
                    id="select"
                    :value="period"
                    size="sm"
                    :options="selectOptions"
                    class="limit"
                    :class="{
                      'page__el--loading': loading,
                      'limit--loading': loading,
                    }"
                    @input="handleSelectChange"
                  />
                </div>
              </div>

              <div class="list">
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
                    <span>{{ item.amount | denominate }}</span>
                  </template>

                  <template #cell(address)="{ item }">
                    <IdentIcon :seed="item.accountId" />

                    <b-link
                      :to="{
                        name: 'account',
                        params: { account: item.accountId },
                      }"
                    >
                      {{ item.accountId | longhash }}
                    </b-link>

                    <BtnCopy :text-to-copy="item.accountId" />
                  </template>
                </b-table>

                <PaginationNav
                  :limit="10"
                  :page="page"
                  :count="500"
                  :loading="loading"
                  @onPageChange="onPageChange"
                />
              </div>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
  import PaginationNav from '@/components/partials/PaginationNav';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import CardHeader from '@/components/partials/CardHeader';

  export default {
    name: 'BiggestMoversTable',
    components: {
      PaginationNav,
      BtnCopy,
      IdentIcon,
      CardHeader,
    },
    props: {
      type: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        loading: false,
        accounts: null,
        items: null,
        page: 1,
        limit: 10,
        period: 'C',
        selectOptions: [
          { value: 'C', text: 'cycle' },
          { value: 'W', text: 'week' },
          { value: 'M', text: 'month' },
        ],
        fields: [
          { key: 'number', label: this.$t('common.ordinalNumber') },
          { key: 'address', label: this.$t('common.address') },
          { key: 'balance', label: this.$t('common.balance') },
        ],
      };
    },
    mounted() {
      this.fetch();
    },
    methods: {
      async fetch() {
        this.loading = true;

        this.page = 1;

        try {
          const { data } = await this.$api.getWhaleMovers({
            side: this.type,
            limit: 500,
            period: this.period,
          });

          this.accounts = data;

          this.items = data.slice(0, this.limit);
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
      handleSelectChange(value) {
        this.period = value;
        this.fetch();
      },
    },
  };
</script>
