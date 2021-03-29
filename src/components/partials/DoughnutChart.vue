<script>
  import { Doughnut } from 'vue-chartjs';

  export default {
    name: 'DoughnutChart',
    props: {
      options: { required: true },
      backgroundColors: Array,
      showTooltips: { type: Boolean, default: true },
      labelCallback: {type:Function, default: (data) => data},
    },
    extends: Doughnut,
    mounted() {
      this.initChart();
    },
    watch: {
      options() {
        this.initChart();
      },
    },
    methods: {
      initChart() {
        let { data = [], backgroundColors = [], legend = {} } = this.options;
        const { labelCallback } = this;
        const vm = this;

        if (this.options.data !== undefined) {
          backgroundColors = this.backgroundColors.slice(
            0,
            this.options.data.length,
          );
        }

        data = [...data.map((p) => (p < 1 ? '1' : p))];

        const options = {
          cutoutPercentage: 90,
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 1,
          legend: {
            ...legend,
            labels: {
              padding: 30,
              usePointStyle: true,
              fontSize: 16,
              fontFamily: 'Montserrat Alternates',
            },
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
                if (vm.$props.options.percents) {
                  return bodyItem.lines.map((line) => `${line}%`);
                }
                return bodyItem.lines;
              }

              tooltipModel.body[0].lines = [
                ...tooltipModel.body[0].lines.map((line) => {
                  if (line.substr(line.length - 3) === ': 1') {
                    line = `${line.slice(1, -2)} >1`;
                  }

                  return labelCallback(line);
                }),
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
              tooltipEl.style.left =
                position.left + window.pageXOffset + tooltipModel.caretX + 'px';
              tooltipEl.style.top =
                position.top + window.pageYOffset + tooltipModel.caretY + 'px';
              tooltipEl.style.fontFamily = 'Montserrat Alternates';
              tooltipEl.style.fontSize = 16 + 'px';
              tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
              tooltipEl.style.padding =
                tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
              tooltipEl.style.pointerEvents = 'none';
            },
          },
        };

        return this.renderChart(
          {
            datasets: [
              {
                data: data,
                backgroundColor: backgroundColors,
              },
            ],
            labels: this.options.labels,
          },
          options,
        );
      },
    },
  };
</script>

<style lang="scss" scoped></style>
