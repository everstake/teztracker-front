<template>
  <StatisticsCard
    :title="level"
    subtitle="Block information"
    :fields="blockRestructured"
  >
    <template #value="slotProps">
      <template v-if="slotProps.field.key === 'Timestamp'">
        {{ slotProps.field.value | timeformat($constants.TIME_FORMAT) }}
      </template>
      <template v-else-if="slotProps.field.key === 'Volume'">
        {{ slotProps.field.value | tezos }}
      </template>
      <router-link
        v-else-if="slotProps.field.key === 'Baker'"
        class="baker"
        :to="{ name: 'baker', params: { baker: slotProps.field.value } }"
      >
        {{ slotProps.field.value }}
      </router-link>
    </template>
  </StatisticsCard>
</template>

<script>
import StatisticsCard from "@/layouts/StatisticsCard";

export default {
  name: "BlockSingle",
  components: {
    StatisticsCard
  },
  props: {
    block: {
      type: Object,
      required: true
    }
  },
  computed: {
    level() {
      return this.$route.params.level;
    },
    blockRestructured() {
      return [
        { key: "Hash", value: this.block.hash },
        { key: "Timestamp", value: this.block.timestamp },
        { key: "Volume", value: this.block.volume },
        { key: "Cycle", value: this.block.metaCycle },
        { key: "Baker", value: this.block.baker },
      ]
    }
  }
};
</script>
