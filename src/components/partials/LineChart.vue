<script>
import { Line } from "vue-chartjs";
import ceil from "lodash/ceil"
import { mapState } from 'vuex'

export default {
  name: "LineChart",
  extends: Line,
  props: ["chartData", "balance"],
  watch: {
    balance: {
      immediate: true,
	    handler() {
        if (this.data.length > 0) {
          this.initChart();
        }
      }
    },
    chartData: {
      immediate: true,
      deep: true,
      handler(data) {
        if (data !== null) {
          if (data.length > 0) {
            this.setData(data);
          }

          if (this.balance) {
            this.initChart();
          }
        }
      }
    }
  },
	mounted() {
    this.setDates();
	},
  data() {
    return {
      data: [],
      oneMonthDateRange: {
        timestamps: [],
		    localeDateStrings: []
	    }
    };
  },
  methods: {
    setData(balances) {
      if (balances.length < 30) {
        balances.forEach(item => {
          const findedDay = new Date(item.timestamp * 1000).toLocaleDateString("en-US");
          const index = this.data.findIndex(item => item.day === findedDay);

          if (index > -1) {
            item.day = findedDay;

            for (let i = index; i < this.data.length; i += 1) {
              if (!this.data[i].balance) {
                this.data[i].balance = item.balance;
              }
            }
          }
        });
      } else {
        this.data = balances;
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
                stepSize: 20,
                callback: value => `${value} XTZ`
              }
            }
          ],
	        
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

      const isDataEmpty = this.data.every(item => item.balance === null);

      
      return this.renderChart(
        {
	        labels: this.oneMonthDateRange.localeDateStrings,
          datasets: [
            {
              label: "Balance",
              data: this.data.map(({ balance }) =>  balance ? balance / 1000000 : isDataEmpty ? this.balance / 1000000 : null),
              // data: this.data.map(({ balance }) => balance / 1000000),
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
      const now = new Date();
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
      const oneMonthAgo = now.setMonth(now.getMonth() - 1);
      const day = 60 * 60 * 24 * 1000;
      const dates = [];

      for (let i = 0; i < 30; i += 1) {
        let timestamp = oneMonthAgo + day * i;
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
    }
  },
  computed: {
    ...mapState('app', {
      info: state => state.priceInfo,
    })
  },
};
</script>

<style lang="scss" scoped></style>
