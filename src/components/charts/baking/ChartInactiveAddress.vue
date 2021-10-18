<template>
  <CommonChart
    :initial-time="initialTime"
    :loading="loading"
    :data="data"
    :date-points="datePoints"
    label="Number of inactive addresses"
    title="Number of inactive addresses"
    @onChangeOptions="handleChangeOptions"
  />
</template>

<script>
  import chartWithDateSelect, {
    timeType,
  } from '@/mixins/charts/chartWithDateSelect';
  import CommonChart from '@/components/partials/CommonChart';

  export default {
    name: 'ChartInactiveAddress',
    components: { CommonChart },
    mixins: [chartWithDateSelect],
    props: {
      initialTime: {
        type: String,
        default: timeType.last6Months,
      },
    },
    data() {
      return {
        loading: false,
        data: null,
        datePoints: null,
      };
    },
    mounted() {
      this.fetch(this.initialOptions);
    },
    methods: {
      async fetch(options) {
        this.loading = true;

        try {
          const response = await this.$api.getInactiveAccountsAgg(options);

          this.data = response.data.map((el) => ({
            x: el.date,
            y: el.value,
          }));

          this.datePoints = response.data.map((el) => el.date);
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        }

        this.loading = false;
      },
      handleChangeOptions(options) {
        this.fetch(options);
      },
    },
  };
</script>
