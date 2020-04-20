<template>
  <b-card no-body>
    <CardHeader>
      <template #left-content class="text">
        <h4 class="tz-title--bold">
          {{ $t("charts.rollsDist") }}
        </h4>
      </template>
    </CardHeader>

    <div class="card-divider"></div>

    <b-card-body>
      <PieChart :chart-data="chartData" />
    </b-card-body>
  </b-card>
</template>

<script>
import CardHeader from "../../partials/CardHeader";
import PieChart from "../../partials/chart-types/PieChart.vue";

export default {
  name: "ChartRollsDistribution",
  components: {
    CardHeader,
    PieChart
  },
  data() {
    return {
      totalRolls: 707687567 / 8,
      twentyColors: [
        "#0A6858",
        "#168774",
        "#309282",
        "#4DA798",
        "#7FCABE",
        "#1C7062",
        "#328678",
        "#519E91",
        "#80C0B6",
        "#B7E1DA",
        "#338D7E",
        "#09312A",
        "#17443D",
        "#274E48",
        "#3C6A63",
        "#5A837C",
        "#0EC0A2",
        "#30CDB3",
        "#54DAC4",
        "#84E9D8"
        
      ],
      bakers: [
        {
          name: "Baker A",
          address: "Baker A",
          rolls: 28472
        },
        {
          name: "Baker B",
          address: "Baker B",
          rolls: 22067
        },
        {
          name: "Baker C",
          address: "Baker C",
          rolls: 20385
        },
        {
          name: "Baker D",
          address: "Baker D",
          rolls: 5865
        },
        {
          name: "Baker E",
          address: "Baker E",
          rolls: 5857
        },
        {
          name: "Baker F",
          address: "Baker F",
          rolls: 5280
        },
        {
          name: "Baker G",
          address: "Baker G",
          rolls: 5083
        },
        {
          name: "Baker H",
          address: "Baker H",
          rolls: 4831
        },
        {
          name: "Baker I",
          address: "Baker I",
          rolls: 4751
        },
        {
          name: "Baker J",
          address: "Baker J",
          rolls: 3750
        },
        {
          name: "Baker K",
          address: "Baker K",
          rolls: 3603
        },
        {
          name: "Baker L",
          address: "Baker L",
          rolls: 3566
        },
        {
          name: "Baker M",
          address: "Baker M",
          rolls: 3376
        },
        {
          name: "Baker N",
          address: "Baker N",
          rolls: 3200
        },
        {
          name: "Baker O",
          address: "Baker O",
          rolls: 3140
        },
        {
          name: "Baker P",
          address: "Baker P",
          rolls: 2941
        },
        {
          name: "Baker Q",
          address: "Baker Q",
          rolls: 2933
        },
        {
          name: "Baker R",
          address: "Baker R",
          rolls: 2900
        },
        {
          name: "Baker S",
          address: "Baker S",
          rolls: 2509
        },
        {
          name: "Baker T",
          address: "Baker T",
          rolls: 2421
        }
      ]
    };
  },
  computed: {
    bakersData() {
      return this.bakers.map(baker => {
        return baker.rolls / 8 * 100 / this.totalRolls;
      });
    },
    chartData() {
      return {
        datasets: [
          {
            data: this.bakersData,
            backgroundColor: this.twentyColors,
            borderWidth: 1,
            weight: 10
          }
        ],
        labels: this.bakers.map(baker => baker.name || baker.address)
      };
    }
  }
};
</script>

<style scoped></style>
