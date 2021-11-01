<template>
  <section>
    <b-container fluid>
      <b-row>
        <b-col lg="12">
          <b-card no-body>
            <CardHeader>
              <template #left-content class="text">
                <h4 class="tz-title--bold">
                  {{ $t('listTypes.biggestTransfers') }}
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
                <div v-if="loading || !transfers" class="table-skeleton">
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

                  <template #cell(timestamp)="{ item }">
                    <span>{{ item.timestamp | timeformat(dateFormat) }}</span>
                  </template>

                  <template #cell(source)="{ item }">
                    <div class="d-flex align-items-center">
                      <IdentIcon :seed="item.source" />

                      <b-link
                        :to="{
                          name: 'account',
                          params: { account: item.source },
                        }"
                      >
                        {{ item.source | longhash }}
                      </b-link>

                      <BtnCopy :text-to-copy="item.source" />
                    </div>
                  </template>

                  <template #cell(destination)="{ item }">
                    <div class="d-flex align-items-center">
                      <IdentIcon :seed="item.destination" />

                      <b-link
                        :to="{
                          name: 'account',
                          params: { account: item.destination },
                        }"
                      >
                        {{ item.destination | longhash }}
                      </b-link>

                      <BtnCopy :text-to-copy="item.destination" />
                    </div>
                  </template>

                  <template #cell(amount)="{ item }">
                    <span>{{ item.amount | denominate }}</span>
                  </template>
                </b-table>

                <PaginationNav
                  :limit="limit"
                  :page="page"
                  :count="
                    transfers ? Math.ceil(transfers.length / limit) * limit : 0
                  "
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
  import { mapState } from 'vuex';

  export default {
    name: 'BiggestMoversTable',
    components: {
      PaginationNav,
      BtnCopy,
      IdentIcon,
      CardHeader,
    },
    data() {
      return {
        loading: false,
        transfers: null,
        items: null,
        page: 1,
        limit: 15,
        period: 'C',
        selectOptions: [
          { value: 'C', text: 'cycle' },
          { value: 'W', text: 'week' },
          { value: 'M', text: 'month' },
        ],
        fields: [
          { key: 'number', label: this.$t('common.ordinalNumber') },
          { key: 'source', label: this.$t('common.source') },
          { key: 'destination', label: this.$t('common.destination') },
          { key: 'amount', label: this.$t('common.amount') },
          { key: 'timestamp', label: this.$t('common.timestamp') },
        ],
      };
    },
    computed: {
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
    },
    mounted() {
      this.fetch();
    },
    methods: {
      async fetch() {
        this.loading = true;

        this.page = 1;

        try {
          const response = await this.$api.getWhaleTransfers({
            limit: 500,
            period: this.period,
          });

          this.transfers = response.data;

          this.items = response.data.slice(0, this.limit);
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        }

        this.loading = false;
      },
      onPageChange(page) {
        this.page = page;

        this.items = this.transfers.slice(
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
