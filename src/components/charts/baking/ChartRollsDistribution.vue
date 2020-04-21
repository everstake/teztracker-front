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
      <PieChart
        :chart-data="chartData"
        :tooltips-label-callback="tooltipsLabelCallback"
      />
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
      palette: [
        "#0B6E4B",
        "#178E64",
        "#339B76",
        "#51B08F",
        "#83CFB4",
        "#0A6858",
        "#168774",
        "#309282",
        "#4DA798",
        "#7FCABE",
        "#0B5C64",
        "#167881",
        "#2F848C",
        "#4C9AA1",
        "#7EC0C7",
        "#0F4B68",
        "#1B6386",
        "#357392",
        "#528BA7",
        "#83B3CA",
        "#09312A",
        "#17443D",
        "#274E48",
        "#3C6A63",
        "#5A837C"
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
        return `${(((baker.rolls / 8) * 100) / this.totalRolls).toFixed(6)}`;
      });
    },
    chartData() {
      return {
        datasets: [
          {
            data: this.bakersData,
            backgroundColor: this.palette,
            borderWidth: 1
          }
        ],
        labels: this.bakers.map(baker => baker.name || baker.address)
      };
    }
  },
  methods: {
    tooltipsLabelCallback(tooltipItem, data) {
      return `${data.labels[tooltipItem.index]}: ${data.datasets[0].data[tooltipItem.index]}%`;
    }
  }
};
</script>

<style scoped></style>
