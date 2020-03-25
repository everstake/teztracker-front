<script>
import { Line } from "vue-chartjs";

export default {
  name: "LineChart",
  extends: Line,
  props: ["chartData"],
  watch: {
    chartData: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val !== null) {
          this.setDates();

	        val.forEach(item => {
            const findedDay = new Date(item.timestamp * 1000).toLocaleDateString("en-US");
            const index = this.data.findIndex(item => item.day === findedDay);

            if (index > -1) {
              item.day = findedDay;

              this.data = [
                ...this.data.slice(0, index),
	              item,
	              ...this.data.slice(index + 1)
              ]

            }
          });

          this.initChart();
        }
      }
    }
  },
  data() {
    return {
      data: []
    };
  },
  methods: {
    initChart() {
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              display: false,
              stacked: true,
              gridLines: {
                display: false
              },
              ticks: {
                suggestedMin: 0,
                suggestedMax: 100,
                beginAtZero: true,
                stepSize: 20
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
                return `${line} XTZ`;
              })
            ]

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
	        labels: [...this.data.map(item => item.day.split('/')[1])],
          datasets: [
            {
              label: "Balance",
              data: this.data.map(item => item.balance / 1000000),
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
        let date = oneMonthAgo + day * i;

        dates.push({
          timestamp: date,
          day: new Date(date).toLocaleDateString("en-US"),
	        balance: 0
        });
      }

      this.data = dates;
    }
  }
};
</script>

<style lang="scss" scoped></style>
