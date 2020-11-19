<template>
  <b-table
    responsive
    show-empty
    :items="items"
    :fields="fields"
    :current-page="page"
    :per-page="0"
    borderless
    class="transactions-table"
    :empty-text="$t('common.noData')"
  >
    <template #cell(txhash)="row">
      <span class="d-flex align-items-center">
        <b-link
          :to="{
            name: 'tx',
            params: { txhash: row.item.operationGroupHash },
          }"
        >
          {{ row.item.operationGroupHash | longhash }}
        </b-link>

        <BtnCopy :text-to-copy="row.item.operationGroupHash" />
      </span>
    </template>
    <template #cell(level)="row">
      <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
        {{ row.item.blockLevel | formatInteger }}
      </b-link>
    </template>
    <template #cell(timestamp)="row">
      {{ row.item.timestamp | timeformat(dateFormat) }}
    </template>
    <template #cell(baker)="row">
      <span class="d-flex align-items-center">
        <IdentIcon :seed="row.item.doubleOperationDetails.evidence_baker" />

        <router-link
          class="baker"
          :to="{
            name: 'baker',
            params: { baker: row.item.doubleOperationDetails.evidence_baker },
          }"
        >
          <template v-if="row.item.doubleOperationDetails.evidence_baker_name">
            {{ row.item.doubleOperationDetails.evidence_baker_name }}
          </template>
          <template v-else>
            {{ row.item.doubleOperationDetails.evidence_baker | longhash }}
          </template>
        </router-link>

        <BtnCopy
          v-if="!row.item.doubleOperationDetails.evidence_baker_name"
          :text-to-copy="row.item.doubleOperationDetails.evidence_baker"
        />
      </span>
    </template>
    <template #cell(baker_rewards)="row">
      {{ row.item.doubleOperationDetails.baker_reward | denominate }}
    </template>
    <template #cell(offender)="row">
      <span class="d-flex align-items-center">
        <IdentIcon :seed="row.item.doubleOperationDetails.offender" />

        <router-link
          class="baker"
          :to="{
            name: 'baker',
            params: { baker: row.item.doubleOperationDetails.offender },
          }"
        >
          <template v-if="row.item.doubleOperationDetails.offender_name">
            {{ row.item.doubleOperationDetails.offender_name }}
          </template>
          <template v-else>
            {{ row.item.doubleOperationDetails.offender | longhash }}
          </template>
        </router-link>

        <BtnCopy
          v-if="!row.item.doubleOperationDetails.offender_name"
          :text-to-copy="row.item.doubleOperationDetails.offender"
        />
      </span>
    </template>
    <template #cell(denounced_level)="row">
      <b-link
        :to="{
          name: 'block',
          params: { level: row.item.doubleOperationDetails.denounced_level },
        }"
      >
        {{ row.item.doubleOperationDetails.denounced_level | formatInteger }}
      </b-link>
    </template>
    <template #cell(lost_deposits)="row">
      {{ row.item.doubleOperationDetails.lost_deposits | denominate }}
    </template>
    <template #cell(lost_rewards)="row">
      {{ row.item.doubleOperationDetails.lost_rewards | denominate }}
    </template>
  </b-table>
</template>

<script>
  import { mapState } from 'vuex';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';

  export default {
    name: 'DoubleBakingTable',
    props: {
      items: Array,
      page: Number,
      limit: Number,
      propsFields: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    components: {
      BtnCopy,
      IdentIcon,
    },
    computed: {
      ...mapState({
        dateFormat: (state) => state.app.dateFormat,
      }),
      fields() {
        const propsFields = this.propsFields.length > 0;
        if (!this.$i18n.locale) return [];
        if (propsFields) {
          return this.propsFields;
        } else {
          return [
            { key: 'level', label: this.$t('common.blockId') },
            { key: 'txhash', label: this.$t('hashTypes.opHash') },
            { key: 'baker', label: this.$t('dblBakingList.accuser') },
            {
              key: 'baker_rewards',
              label: this.$t('dblBakingList.bakerRewards'),
            },
            { key: 'offender', label: this.$t('dblBakingList.offender') },
            { key: 'denounced_level', label: this.$t('common.denouncedLvl') },
            {
              key: 'lost_deposits',
              label: this.$t('dblBakingList.lostDeposits'),
            },
            {
              key: 'lost_rewards',
              label: this.$t('dblBakingList.lostRewards'),
            },
            { key: 'timestamp', label: this.$t('common.timestamp') },
          ];
        }
      },
    },
  };
</script>
