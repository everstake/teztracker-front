<script>
import { Line, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  name: "LineChart",
  props: {
    customTooltip: {
      type: Function,
      default() {
        return null;
      }
    },
    options: {
      type: Object,
      default() {
        return {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                display: true,
                gridLines: {
                  display: false
                },
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          },
          tooltips: {
            enabled: Boolean(this.customTooltip)
          },
          elements: {
            line: {
              borderColor: ["#309182"],
              borderWidth: 3,
              fill: "black"
            },
            point: {

            }
          }
        };
      }
    }
  },
  // created() won't work
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>

<style scoped></style>
