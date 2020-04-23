<script>
import { Line, mixins } from "vue-chartjs";
import numeral from "numeral";
const { reactiveProp } = mixins;

export default {
  name: "LineChart",
  extends: Line,
  mixins: [reactiveProp],
  props: {
    customTooltip: {
      type: Function,
      default() {
        return null;
      }
    },
    yTicksStepSize: {
      type: Number,
      default: 0
    },
    yAxesType: {
      type: String,
      default: "linear"
    },
    yAxesBeginAtZero: {
      type: Boolean,
      default: true
    },
    xAxesMaxTicksLimit: {
      type: Number,
      default: 0
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
        return `${data.datasets[0].label}: ${numeral(tooltipItem.value).format(
          "0,0[.]000000"
        )}`;
      }
    },
    options: {
      type: Object,
      default() {
        return {
          responsive: true,
          maintainAspectRatio: false,
          onResize(chart, size) {
            const lessTicks = size.width < 575;
            console.log(size.width);
            console.log(lessTicks);

            if (lessTicks) {
              // TODO: Find a way to get rid of the hardcoded value
              //  The value from props, data or computed doesn't work
              chart.options.scales.xAxes[0].ticks.maxTicksLimit = 10;
            } else {
              // TODO: Find a way to get rid of the hardcoded value
              //  The value from props, data or computed doesn't work
              chart.options.scales.xAxes[0].ticks.maxTicksLimit = 15;
            }
          },
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
                  beginAtZero: this.yAxesBeginAtZero,
                  stepSize: this.yTicksStepSize,
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
                  maxTicksLimit: this.xAxesMaxTicksLimit,
                  fontColor: "#2d2e2c",
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
            cornerRadius: 4,
            callbacks: {
              label: this.tooltipsLabelCallback
            }
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
