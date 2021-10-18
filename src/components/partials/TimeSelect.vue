<template>
  <b-form-select
    v-model="selected"
    class="select"
    size="sm"
    :options="options"
  />
</template>

<script>
  import chartWithDateSelect, {
    timeType,
  } from '@/mixins/charts/chartWithDateSelect';

  export default {
    name: 'TimeSelect',
    mixins: [chartWithDateSelect],
    props: {
      timeOptions: {
        type: Array,
        required: false,
        default() {
          return Object.values(timeType);
        },
      },
      initialValue: {
        type: String,
        default: timeType.last24Hours,
      },
    },
    data() {
      return {
        selected: this.initialValue,
        options: [
          { value: timeType.last24Hours, text: 'last 24 hours' },
          { value: timeType.lastWeek, text: 'last week' },
          { value: timeType.lastMonth, text: 'last month' },
          { value: timeType.last6Months, text: 'last 6 months' },
        ].filter((el) => this.timeOptions.includes(el.value)),
      };
    },
    watch: {
      selected(value) {
        const from = this.getSecondsTimestamp(this.getDateFrom(value));
        const to = this.getSecondsTimestamp(new Date());

        this.$emit('onChange', {
          type: value,
          payload: { from, to },
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .select {
    border: 1px solid #363735;
  }
</style>
