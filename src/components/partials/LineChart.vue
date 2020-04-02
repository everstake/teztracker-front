<script>
import { Line } from "vue-chartjs";
import ceil from "lodash/ceil";
import { mapState } from 'vuex';
import moment from 'moment';

export default {
  name: "LineChart",
  extends: Line,
  props: ["chartData", "balance"],
  watch: {
    chartData: {
      immediate: true,
      deep: true,
      handler(data) {
        if (data !== null) {
          this.updatedData = data;
        }
      }
    },
    isNeededDataReceived: {
      immediate: false,
	    handler(status) {
        if (status) {
          console.log('this.chartData', this.chartData)
          console.log('this.balance', this.balance)
          this.updateData();
          this.initChart();
        }
	    }
    }
  },
  computed: {
    ...mapState('app', {
      info: state => state.priceInfo
    }),
	  isNeededDataReceived() {
      if (this.chartData === null || this.balance === undefined) {
        return false;
      };
      return this.balance >= 0 && this.chartData.length > 0;
    }
  },
	created() {
    if (this.data.length === 0) {
      this.setDates();
    }
	},
  data() {
    return {
      data: [],
	    updatedData: [],
	    finalData: [],
	    previousBalance: null,
      oneMonthDateRange: {
        timestamps: [],
		    localeDateStrings: []
	    }
    };
  },
  methods: {
    updateData() {
      const props = this.updatedData.sort((a, b) => a.timestamp - b.timestamp);
      // handle 1 operation but without balance
      if (props.length === 1 && !props[0].balance) {
        this.data = this.data.map(operation => ({...operation, balance: 0}))
        return;
      }

      // handle 0 operations
      if (props.length === 0) {
        this.data = this.data.map(operation => ({...operation, balance: (this.balance / 1000000).toFixed()}))
        return;
      }

      // handle 1 operation
      if (props.length === 1) {
        const operationInThisMonth = this.data.some(operation => operation.day === new Date(props[0].timestamp * 1000).toLocaleDateString("en-US"));
        let currentBalance = operationInThisMonth ?  0 : props[0].balance / 1000000;

        this.data = this.data.map(operation => {
          const operationDay = new Date(operation.timestamp).toLocaleDateString("en-US");
          const updatedDay = new Date(props[0].timestamp * 1000).toLocaleDateString("en-US");
          const updatedDayIndex = this.data.findIndex(item => item.day === operationDay);

          for (let i = 0; i < updatedDayIndex; i += 1) {
            this.data[i].balance = currentBalance;
          }

          for (let i = updatedDayIndex; i < this.data.length; i += 1) {
            if (updatedDay === operationDay) {
              currentBalance = props[0].balance / 1000000;
            }
          }
          return { ...operation, balance: currentBalance };
        });
        return;
      }

	    // handle <30 and >30 operations
      if (props.length < 30) {
        let currentBalance = props[0].balance / 1000000;
        let firstOperationDay = new Date(props[1].timestamp * 1000).toLocaleDateString("en-US");
        const firstOperationIndex = this.data.findIndex(item => item.day === firstOperationDay);

        for (let i = 0; i < firstOperationIndex; i += 1) {
          this.data[i].balance = currentBalance;
        }

        for (let i = firstOperationIndex; i < this.data.length; i += 1) {
          const dataDay = this.data[i].day;
          props.forEach(item => {
            const propsDay = new Date(item.timestamp * 1000).toLocaleDateString("en-US");

            if (propsDay === dataDay) {
              currentBalance = item.balance / 1000000;
            }

            this.data[i].balance = currentBalance;
          });
        }
      } else {
        const indexes = [];

        props.forEach((operation, propsIndex) => {
          const day = new Date(operation.timestamp * 1000).toLocaleDateString("en-US")
          const a = moment(day,'M/D/YYYY');

          let dataIndex = this.data.findIndex(item => {
            const b = moment(item.day,'M/D/YYYY');
            const diffDays = b.diff(a, 'days');
            return diffDays === 0;
          });

          if (dataIndex > -1) {
	          indexes.push({propsIndex, dataIndex})
          }
        });

        this.data = this.data.map((item, index) => {
          const findedIndex = indexes.find(({ dataIndex }) => index === dataIndex);
          const result = props[findedIndex.propsIndex].balance;

          return {
            ...item,
            balance: result / 1000000
          };
        })
      }
    },
    initChart() {
      const { price } = this.info;
      const options = {
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
                beginAtZero: true,
                callback: value => `${value} XTZ`
              }
            }
          ]
        },
        tooltips: {
          enabled: false,

          custom: function(tooltipModel) {
            var tooltipEl = document.getElementById('chartjs-tooltip');

            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-tooltip';
              tooltipEl.innerHTML = '<table></table>';
              document.body.appendChild(tooltipEl);
            }

            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0;
              return;
            }

            tooltipEl.classList.remove('above', 'below', 'no-transform');
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign);
            } else {
              tooltipEl.classList.add('no-transform');
            }

            function getBody(bodyItem) {
              return bodyItem.lines;
            }

            tooltipModel.body[0].lines = [
              ...tooltipModel.body[0].lines.map(line => {
                let result = 0;
                if (line || line > 0) {
                  const tez = line.split(' ')[1];
                  result = ceil(tez * price, 2);
                }
                return `${line} XTZ ($${result})`;
              })
            ];

            if (tooltipModel.body) {
              var titleLines = tooltipModel.title || [];
              var bodyLines = tooltipModel.body.map(getBody);

              var innerHtml = '<thead>';

              titleLines.forEach(function(title) {
                innerHtml += '<tr><th>' + title + '</th></tr>';
              });
              innerHtml += '</thead><tbody>';

              bodyLines.forEach(function(body, i) {
                var colors = tooltipModel.labelColors[i];
                var style = 'background:' + colors.backgroundColor;
                style += '; border-color:' + colors.borderColor;
                style += '; border-width: 2px';
                var span = '<span style="' + style + '"></span>';
                innerHtml += '<tr><td>' + span + body + '</td></tr>';
              });
              innerHtml += '</tbody>';

              var tableRoot = tooltipEl.querySelector('table');
              tableRoot.innerHTML = innerHtml;
            }

            var position = this._chart.canvas.getBoundingClientRect();

            tooltipEl.style.transition = 'all .1s ease-in-out';
            tooltipEl.style.borderRadius = '5px';
            tooltipEl.style.backgroundColor = '#000';
            tooltipEl.style.color = '#fff';
            tooltipEl.style.opacity = 1;
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
            tooltipEl.style.fontFamily = 'Montserrat Alternates';
            tooltipEl.style.fontSize = 16 + 'px';
            tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
            tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
            tooltipEl.style.pointerEvents = 'none';

            if (position.left + window.pageXOffset + tooltipModel.caretX + tooltipEl.offsetWidth > window.innerWidth) {
              tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX - tooltipEl.offsetWidth + 'px';
            } else {
              tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
            }

          }
        }
      };
      return this.renderChart(
        {
	        labels: this.data.map(({ day }) => day),
          datasets: [
            {
              label: "Balance",
	            data: this.data.map(({ balance }) => balance),
              backgroundColor: [
                "rgb(224, 239, 236)"
              ],
              borderColor: ["#309182"],
              borderWidth: 3
            }
          ]
        },
        options
      );
    },
    setDates() {
      const thirdyDaysAgoDate = this.getThirdyDaysAgoDate();
      const day = 60 * 60 * 24 * 1000;
      const dates = [];

      for (let i = 0; i < 30; i += 1) {
        let timestamp = thirdyDaysAgoDate + day * i;
        const toLocaleDateString = new Date(timestamp).toLocaleDateString("en-US");

        this.oneMonthDateRange.timestamps.push(timestamp);
        this.oneMonthDateRange.localeDateStrings.push(toLocaleDateString);

        dates.push({
          timestamp,
          day: toLocaleDateString,
	        balance: null
        });
      }

      this.data = dates;
    },
	  getThirdyDaysAgoDate() {
      const now = new Date();
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
      return now.setDate(now.getDate() - 29);
	  }
  },
};
</script>
