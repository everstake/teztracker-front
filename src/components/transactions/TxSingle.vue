<template>
  <StatisticsCard
    :title="opHash"
    :subtitle="$t('infoTypes.txInfo')"
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
      <template v-else-if="slotProps.field.key === $t('statusTypes.status')">
        <span
          :class="{
            'text-danger': slotProps.field.value === $t('statusTypes.status'),
            'text-success': slotProps.field.value !== $t('statusTypes.status')
          }"
        >
          {{ slotProps.field.value }}
        </span>
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
  props: ["timestamp", "opHash", "level", "fee", "status"],
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
        { key: this.$t("hashTypes.opHash"), value: this.opHash }
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
