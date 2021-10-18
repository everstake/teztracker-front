<template>
  <div class="chart">
    <div class="top-content">
      <slot name="top-content" />
    </div>

    <div class="diagram-wrapper">
      <svg viewBox="0 0 36 36" class="circular-chart color">
        <path
          class="circle-bg"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          class="circle"
          :stroke-dasharray="`${progressPercent}, 100`"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>

      <div class="inner-content">
        <slot name="inner-content-top" />

        <div class="percent">{{ progressPercent }}%</div>

        <slot name="inner-content-bottom" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CircleDiagram',
    props: {
      progressPercent: {
        type: Number,
        required: true,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .chart {
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    height: 320px;
  }

  .diagram-wrapper {
    position: relative;

    width: 80%;
    height: 80%;
  }

  .inner-content {
    position: absolute;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 5px;

    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);

    .percent {
      font-size: 21px;
      font-weight: bold;
      color: #309282;
    }
  }

  .circular-chart {
    display: block;
    margin: 10px auto;
    max-width: 100%;
    max-height: 100%;
  }

  .circle-bg {
    fill: none;
    stroke: #dfeeeb;
    stroke-width: 2.8;
  }

  .circle {
    fill: none;
    stroke-width: 2.8;
    stroke-linecap: round;
    animation: progress 1s ease-out forwards;
  }

  .circular-chart.color .circle {
    stroke: #309282;
  }

  @keyframes progress {
    0% {
      stroke-dasharray: 0 100;
    }
  }
</style>
