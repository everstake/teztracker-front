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
    ticksStepSize: {
      type: Number,
      default: 0
    },
    xAxesMaxTicksLimit: {
      type: Number,
      default: 0
    },
    yAxesType: {
      type: String,
      default: "linear"
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
              fontColor: "#212529"
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
                  fontColor: "#212529",
                  beginAtZero: true,
                  stepSize: this.ticksStepSize,
                  callback(label) {
                    if (label > 999999) {
                      return `${label / 1000 / 1000}M`;
                    }
                    if (label > 999) {
                      return `${label / 1000}K`;
                    }

                    return label;
                  }
                }
              }
            ],
            xAxes: [
              {
                gridLines: {
                  drawOnChartArea: false
                },
                ticks: {
                  maxTicksLimit: this.xAxesMaxTicksLimit,
                  fontColor: "#212529",
                  fontFamily: "Montserrat Alternates"
                }
              }
            ]
          },
          tooltips: {
            enabled: Boolean(this.customTooltip),
            titleFontFamily: "Montserrat Alternates",
            bodyFontFamily: "Montserrat Alternates",
            displayColors: false,
            backgroundColor: "rgba(33, 37, 41, 0.8)",
            bodyAlign: "center",
            titleAlign: "center",
            cornerRadius: 4
          },
          elements: {
            line: {
              borderColor: "rgba(48, 146, 130, 0.6)",
              borderWidth: 2,
              fill: true,
              backgroundColor: "rgba(48, 146, 130, 0.15)",
              cubicInterpolationMode: "monotone"
            },
            point: {
              borderColor: "rgb(48, 146, 130)",
              backgroundColor: "rgb(48, 146, 130, 1)",
              radius: 2,
              hitRadius: 6,
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
