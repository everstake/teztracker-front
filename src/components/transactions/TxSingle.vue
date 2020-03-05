<template>
  <StatisticsCard
    :title="opHash"
    subtitle="Transaction information"
    :fields="txInfoRestructured"
  >
    <template #value="slotProps">
      <router-link
        v-if="slotProps.field.key === 'Included in Block'"
        class="link"
        :to="{ name: 'block', params: { level } }"
      >
        {{ slotProps.field.value }}
      </router-link>
      <template v-else-if="slotProps.field.key === 'Timestamp'">
        {{ slotProps.field.value | timeformat($constants.TIME_FORMAT) }}
      </template>
      <template v-else-if="slotProps.field.key === 'Fee'">
        {{ slotProps.field.value | tezos }}
        ({{ $_convert(slotProps.field.value) }})
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
  props: ["timestamp", "opHash", "level", "fee"],
  mixins: [convert],
  components: {
    StatisticsCard
  },
  computed: {
    ...mapState('app', {
      info: state => state.priceInfo
    }),
    txInfoRestructured() {
      return [
        { key: "Included in Block", value: this.level },
        { key: "Timestamp", value: this.timestamp },
        { key: "Operation hash", value: this.opHash },
        { key: "Fee", value: this.fee }
      ];
    }
  },
  async created() {
    await this[GET_APP_INFO]();
  },
  methods: {
    ...mapActions('app', [GET_APP_INFO])
  }
};
</script>
