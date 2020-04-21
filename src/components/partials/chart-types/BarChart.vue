<script>
import { Bar, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  name: "BarChart",
  extends: Bar,
  mixins: [reactiveProp],
  props: {
    yAxesType: {
      type: String,
      default: "linear"
    },
    yAxesMaxTicksLimit: {
      type: Number,
      default: 14
    },
    yTicksCallback: {
      type: Function,
      default(label) {
        if (label > 999999) {
          return `${label / 1000 / 1000}M`;
        }
        if (label > 999) {
          return `${label / 1000}K`;
        }

        return label;
      }
    },
    tooltipsLabelCallback: {
      type: Function,
      default(tooltipItem, data) {
        return `${data.datasets[0].label}: ${tooltipItem.value}`;
      }
    },
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
          scales: {
            yAxes: [
              {
                type: this.yAxesType,
                display: true,
                gridLines: {
                  drawOnChartArea: true,
                  color: "rgba(33, 37, 41, 0.1)"
                },
                ticks: {
                  fontFamily: "Montserrat Alternates",
                  fontColor: "#2d2e2c",
                  beginAtZero: true,
                  maxTicksLimit: this.yAxesMaxTicksLimit,
                  callback: this.yTicksCallback
                }
              }
            ],
            xAxes: [
              {
                gridLines: {
                  drawOnChartArea: false
                },
                ticks: {
                  maxTicksLimit: 10,
                  fontColor: "#2d2e2c",
                  fontFamily: "Montserrat Alternates",
                  beginAtZero: true
                }
              }
            ]
          },
          tooltips: {
            titleFontFamily: "Montserrat Alternates",
            bodyFontFamily: "Montserrat Alternates",
            displayColors: false,
            backgroundColor: "rgba(33, 37, 41, 0.8)",
            bodyAlign: "center",
            titleAlign: "center",
            cornerRadius: 4,
            callbacks: {
              label: this.tooltipsLabelCallback
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
