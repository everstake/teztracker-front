<template>
  <b-table
    responsive
    show-empty
    :items="items"
    :fields="fields"
    :current-page="1"
    :per-page="0"
    borderless
    class="transactions-table"
    :empty-text="$t('common.noData')"
  >
    <template #cell(id)="row">
      <span>{{ row.index + 1 }}</span>
    </template>
    <template #cell(baker)="row">
      <span>
        <IdentIcon :seed="row.item.baker" />

        <router-link
          :to="{
            name: 'baker',
            params: {
              baker: row.item.baker,
              network: getAppNetwork,
              lang: $i18n.locale,
            },
          }"
        >
          <template v-if="row.item.alias">
            {{ row.item.alias }}
          </template>
          <template v-else>
            {{ row.item.baker | longhash }}
          </template>
        </router-link>
      </span>
    </template>
    <template #cell(services)="row">
      <div v-if="row.item.providers" class="providers">
        <span v-if="!row.item.providers.some(({ provider }) => provider)"
          >-</span
        >
        <div
          v-for="({ provider }, index) in row.item.providers"
          :key="index + generateKey()"
        >
          <img
            v-if="provider && provider.includes('baking-bad')"
            class="providers__img"
            src="@/assets/icons/baking-bad.jpg"
            alt="Baking bad"
          />

          <img
            v-if="provider && provider.includes('tezos-nodes')"
            class="providers__img"
            src="@/assets/icons/tezos-nodes.jpg"
            alt="Tezos nodes"
          />

          <img
            v-if="provider && provider.includes('tzstats')"
            class="providers__img"
            src="@/assets/icons/tzstats.jpg"
            alt="Tzstats"
          />
        </div>
      </div>
    </template>
    <template #cell(fee)="row">
      <span v-if="getAvarageOf('fee', row.item.providers)"
        >{{
          (getAvarageOf('fee', row.item.providers) * 100)
            .toString()
            .slice(0, 4)
        }}%</span
      >
      <span v-else>-</span>
    </template>
    <template #cell(details)="row">
      <b-button size="sm" variant="success" @click="row.toggleDetails">
        {{
          row.detailsShowing
            ? $t('mempoolList.hideDetails')
            : $t('mempoolList.showDetails')
        }}
      </b-button>
    </template>
    <template #cell(roi)="row">
      <span v-if="getAvarageOf('yield', row.item.providers)"
        >{{
          getAvarageOf('yield', row.item.providers)
            .toString()
            .slice(0, 4)
        }}%</span
      >
      <span v-else>-</span>
    </template>
    <template #cell(efficiency)="row">
      <span v-if="getAvarageOf('efficiency', row.item.providers)"
        >{{
          getAvarageOf('efficiency', row.item.providers)
            .toString()
            .slice(0, 4)
        }}%</span
      >
      <span v-else>-</span>
    </template>
    <template #cell(available_capacity)="row">
      <span>{{
        formattedAvailableCapacity(
          getAvarageOf('available_capacity', row.item.providers),
        )
      }}</span>
    </template>
    <template #cell(payout_accuracy)="row">
      <span
        v-if="
          !row.item.providers
            .filter((item) => item.payout_accuracy)
            .map((item) => item.payout_accuracy).length
        "
        >-</span
      >
      <span v-else>{{
        row.item.providers
          .filter((item) => item.payout_accuracy)
          .map((item) => item.payout_accuracy)[0]
      }}</span>
    </template>
    <template #row-details="row">
      <b-table
        responsive
        show-empty
        :items="row.item.providers"
        :fields="innerTableFields"
        :current-page="1"
        :per-page="0"
        borderless
        class="transactions-table"
        :empty-text="$t('common.noData')"
      >
        <template #cell(baker)="row">
          <span v-if="row.item.name">{{ row.item.name }}</span>
          <span v-else>-</span>
        </template>
        <template #cell(services)="row">
          <div v-if="row.item.provider" class="providers">
            <span v-if="!row.item.provider">-</span>
            <img
              v-if="row.item.provider === 'baking-bad'"
              class="providers__img"
              src="@/assets/icons/baking-bad.jpg"
              alt="Baking bad"
            />

            <img
              v-if="row.item.provider === 'tezos-nodes'"
              class="providers__img"
              src="@/assets/icons/tezos-nodes.jpg"
              alt="Tezos nodes"
            />

            <img
              v-if="row.item.provider === 'tzstats'"
              class="providers__img"
              src="@/assets/icons/tzstats.jpg"
              alt="Tzstats"
            />
          </div>
        </template>
        <template #cell(fee)="row">
          <span v-if="row.item.fee">{{ row.item.fee * 100 }}%</span>
          <span v-else>-</span>
        </template>
        <template #cell(roi)="row">
          <span v-if="row.item.yield"
            >{{ row.item.yield.toString().slice(0, 4) }}%</span
          >
          <span v-else>-</span>
        </template>
        <template #cell(efficiency)="row">
          <span v-if="row.item.efficiency"
            >{{ row.item.efficiency.toString().slice(0, 4) }}%</span
          >
          <span v-else>-</span>
        </template>
        <template #cell(available_capacity)="row">
          <span v-if="row.item.available_capacity">{{ formattedAvailableCapacity(row.item.available_capacity) }}</span>
          <span v-else>-</span>
        </template>
        <template #cell(payout_accuracy)="row">
          <span v-if="row.item.payout_accuracy">{{
            row.item.payout_accuracy
          }}</span>
          <span v-else>-</span>
        </template>
      </b-table>
    </template>
  </b-table>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import uuid from '@/mixins/uuid';
  import numeral from 'numeral';

  export default {
    name: 'DelegateComparisonTable',
    props: {
      items: Array,
      limit: Number,
      propsFields: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    mixins: [uuid],
    components: {
      IdentIcon,
    },
    data() {
      return {
        innerTableFields: [
          { key: 'baker', label: this.$tc('common.baker', 1) },
          { key: 'services', label: 'Services' },
          { key: 'fee', label: 'Fee' },
          { key: 'roi', label: 'ROI' },
          { key: 'available_capacity', label: 'Free space' },
          { key: 'efficiency', label: 'Efficiency' },
          { key: 'payout_accuracy', label: 'Payout accuracy' },
        ],
      };
    },
    computed: {
      ...mapState({
        dateFormat: (state) => state.app.dateFormat,
      }),
      ...mapGetters('app', ['getAppNetwork']),
      fields() {
        const propsFields = this.propsFields.length > 0;
        if (!this.$i18n.locale) return [];
        if (propsFields) {
          return this.propsFields;
        } else {
          return [
            {
              key: 'id',
              label: '#',
              tdClass: 'ordinal-number',
              thClass: 'ordinal-number',
            },
            { key: 'baker', label: this.$tc('common.baker', 1) },
            { key: 'services', label: 'Services' },
            { key: 'fee', label: 'Fee' },
            { key: 'roi', label: 'ROI' },
            { key: 'available_capacity', label: 'Free space' },
            { key: 'efficiency', label: 'Efficiency' },
            { key: 'payout_accuracy', label: 'Payout accuracy' },
            { key: 'details', label: 'Show details' },
          ];
        }
      },
    },
    methods: {
      getAvarageOf(key, array) {
        if (!array) return false;
        const filteredArray = array
          .filter((item) => item[key])
          .map((item) => item[key]);
        if (!filteredArray.length) return false;
        const sum = filteredArray.reduce((a, b) => a + b, 0);
        const avarage = sum / filteredArray.length;
        return `${avarage.toString()}`;
      },
      formattedAvailableCapacity(n) {
        return numeral(n / 1000000).format('0,0');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .providers {
    display: flex;
  }

  .providers__img {
    margin-left: 2px;
    margin-right: 2px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }
</style>
