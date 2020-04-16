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
                // type: "logarithmic",
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
            enabled: Boolean(this.customTooltip),
            titleFontFamily: "Montserrat Alternates"
          },
          elements: {
            line: {
              borderColor: "rgba(48, 146, 130, 0.6)",
              borderWidth: 2,
              fill: true,
              backgroundColor: "rgba(48, 146, 130, 0.15)",
              tension: 0.2
              // cubicInterpolationMode: 'monotone',
            },
            point: {
              borderColor: "rgb(48, 146, 130)",
              backgroundColor: "rgb(48, 146, 130, 1)",
              radius: 2,
              hitRadius: 10,
              hoverRadius: 4,
              hoverBorderWidth: 2
            }
          }
        };
      }
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>

<style scoped></style>
