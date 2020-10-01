<script>
  import { Pie, mixins } from 'vue-chartjs';
  const { reactiveProp } = mixins;

  export default {
    name: 'PieChart',
    extends: Pie,
    mixins: [reactiveProp],
    props: {
      tooltipsLabelCallback: {
        type: Function,
        default(tooltipItem, data) {
          return `${data.labels[tooltipItem.index]}: ${
            data.datasets[0].data[tooltipItem.index]
          }`;
        },
      },
      options: {
        type: Object,
        default() {
          return {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 0.9,
            legend: {
              labels: {
                fontFamily: 'Montserrat Alternates',
                fontColor: '#2d2e2c',
                boxWidth: 12,
                usePointStyle: true,
              },
            },
            tooltips: {
              titleFontFamily: 'Montserrat Alternates',
              bodyFontFamily: 'Montserrat Alternates',
              displayColors: false,
              backgroundColor: 'rgba(33, 37, 41, 0.8)',
              bodyAlign: 'center',
              titleAlign: 'center',
              cornerRadius: 4,
              callbacks: {
                label: this.tooltipsLabelCallback,
              },
            },
          };
        },
      },
    },
    mounted() {
      this.renderChart(this.chartData, this.options);
    },
  };
</script>
