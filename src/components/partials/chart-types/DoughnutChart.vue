<script>
  import { Doughnut, mixins } from 'vue-chartjs';
  const { reactiveProp } = mixins;

  export default {
    name: 'DoughnutChart',
    extends: Doughnut,
    mixins: [reactiveProp],
    props: {
      tooltipsLabelCallback: {
        type: Function,
        default(tooltipItem, data) {
          return `${data.datasets[0].label}: ${tooltipItem.value}`;
        },
      },
      options: {
        type: Object,
        default() {
          return {
            cutoutPercentage: 90,
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1,
            legend: {
              labels: {
                padding: 30,
                usePointStyle: true,
                fontSize: 16,
                fontFamily: 'Montserrat Alternates',
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
      this.renderChart(
        {
          datasets: [
            {
              data: this.chartData,
              backgroundColor: ['#309282', '#9ea0a5'],
            },
          ],
          labels: this.options.labels,
        },
        this.options,
      );
    },
  };
</script>
