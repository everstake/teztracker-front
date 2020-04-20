<script>
import { Pie, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  name: "PieChart",
  extends: Pie,
  mixins: [reactiveProp],
  props: {
    options: {
      type: Object,
      default() {
        return {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            labels: {
              fontFamily: "Montserrat Alternates",
              fontColor: "#2d2e2c"
            }
          },
          tooltips: {
            // enabled: Boolean(this.customTooltip),
            titleFontFamily: "Montserrat Alternates",
            bodyFontFamily: "Montserrat Alternates",
            displayColors: false,
            backgroundColor: "rgba(33, 37, 41, 0.8)",
            bodyAlign: "center",
            titleAlign: "center",
            cornerRadius: 4
          },
          elements: {
            arc: {
              // backgroundColor: "rgba(48, 146, 130, 0.15)",
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
