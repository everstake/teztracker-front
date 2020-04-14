<template>
  <StatisticsCard
    :title="opHash"
    :subtitle="$t(`infoTypes.${kind}Info`)"
    :fields="txInfoRestructured"
  >
    <template #value="slotProps">
      <router-link
        v-if="slotProps.field.key === $t('common.includedInBlock')"
        class="link"
        :to="{ name: 'block', params: { level } }"
      >
        {{ slotProps.field.value }}
      </router-link>
      <template v-else-if="slotProps.field.key === $t('common.timestamp')">
        {{ slotProps.field.value | timeformat(dateFormat) }}
      </template>
      <template v-else-if="slotProps.field.key === $t('common.fee')">
        {{ slotProps.field.value | tezos }}
        ({{ $_convert(slotProps.field.value) }})
      </template>
      <template v-else-if="slotProps.field.key === $t('txSingle.confirmations')">
        {{ slotProps.field.value | formatInteger }}
      </template>
      <template v-else-if="slotProps.field.key === $t('statusTypes.status')">
        <span
          :class="{
            'text-danger': slotProps.field.value === $t('statusTypes.failed'),
            'text-success': slotProps.field.value === $t('statusTypes.success')
          }"
        >
          {{ slotProps.field.value }}
        </span>
      </template>
      <template v-else-if="slotProps.field.key === $t('common.endorser')">
        <router-link
          class="link"
          :to="{ name: 'baker', params: { baker: slotProps.field.value.id } }"
        >
          {{ slotProps.field.value.name }}
        </router-link>
      </template>
      <template v-else-if="slotProps.field.key === $t('txSingle.deposit')">
        {{ slotProps.field.value | tezos }}
      </template>
      <template v-else-if="slotProps.field.key === $t('txSingle.reward')">
        {{ slotProps.field.value | tezos }}
      </template>
      <template v-else-if="slotProps.field.key === $tc('common.acc', 1)">
        <router-link
          class="link"
          :to="{ name: 'account', params: { account: slotProps.field.value } }"
        >
          {{ slotProps.field.value }}
        </router-link>
      </template>
      <template v-else-if="slotProps.field.key === $t('txSingle.amountClaimed')">
        {{ slotProps.field.value | tezos }}
      </template>
    </template>
  </StatisticsCard>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { GET_APP_INFO } from "@/store/actions.types";
import StatisticsCard from "@/layouts/StatisticsCard";
import convert from "../../mixins/convert";

export default {
  name: "TxSingle",
  props: [
    "timestamp",
    "opHash",
    "level",
    "fee",
    "status",
    "kind",
    "cycle",
    "confirmations",
    "secret",
    "account",
    "delegate",
    "delegateName",
    "slots",
    "endorsementDeposit",
    "endorsementReward",
    "reward",
    "claimedAmount"
  ],
  mixins: [convert],
  components: {
    StatisticsCard
  },
  computed: {
    ...mapState("app", {
      info: state => state.priceInfo,
      dateFormat: state => state.dateFormat
    }),
    txInfoRestructured() {
      const res = [
        { key: this.$t("common.includedInBlock"), value: this.level },
        { key: this.$t("common.timestamp"), value: this.timestamp },
        { key: this.$t("hashTypes.opHash"), value: this.opHash },
        { key: this.$tc("common.cycle", 1), value: this.cycle },
        { key: this.$t("txSingle.confirmations"), value: this.confirmations }
      ];
      if (this.fee) {
        res.push({ key: this.$t("common.fee"), value: this.fee });
      }
      if (this.status) {
        res.push({
          key: this.$t("statusTypes.status"),
          value: this.mapOperationStatus(this.status)
        });
      }
      if (this.secret) {
        res.push({ key: this.$t("txSingle.secret"), value: this.secret });
      }
      if (this.account) {
        res.push({ key: this.$tc("common.acc", 1), value: this.account });
      }
      if (this.delegate && this.kind === "endorsement") {
        res.push({
          key: this.$t("common.endorser"),
          value: { name: this.delegateName || this.delegate, id: this.delegate }
        });
      }
      if (this.slots) {
        res.push({ key: this.$t("txSingle.slotsEndorsed"), value: this.slots });
      }
      if (this.endorsementDeposit) {
        res.push({
          key: this.$t("txSingle.deposit"),
          value: this.endorsementDeposit
        });
      }
      if (this.endorsementReward) {
        res.push({
          key: this.$t("txSingle.reward"),
          value: this.endorsementReward
        });
      } else if (this.reward) {
        res.push({
          key: this.$t("txSingle.reward"),
          value: this.reward
        });
      }
      if (this.claimedAmount && this.kind === 'activation') {
        res.push({
          key: this.$t("txSingle.amountClaimed"),
          value: this.claimedAmount
        });
      }
      return res;
    }
  },
  async created() {
    await this[GET_APP_INFO]();
  },
  methods: {
    ...mapActions("app", [GET_APP_INFO]),
    mapOperationStatus(status) {
      return status === "applied"
        ? this.$t("statusTypes.success")
        : this.$t("statusTypes.failed");
    }
  }
};
</script>
