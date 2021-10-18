<template>
  <div class="wrapper">
    <b-button
      size="sm"
      variant="custom"
      :class="['button', { active: type === chartTypes.line }]"
      @click="handleClick(chartTypes.line)"
    >
      <svg
        width="15"
        height="12"
        viewBox="0 0 15 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.40959 0L14.2616 2.64397L13.2839 4.20739L9.91182 2.32999L3.99694 11.2079L0 9.06235L0.900143 7.35532L3.65806 8.742L9.40959 0Z"
          fill="#363735"
        />
      </svg>
    </b-button>

    <b-button
      :class="['button', { active: type === chartTypes.histogram }]"
      variant="custom"
      size="sm"
      @click="handleClick(chartTypes.histogram)"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.10675 5.80615H2.18501V11.5365H0.10675V5.80615Z"
          fill="#363735"
        />
        <path
          d="M3.24829 3.40454H5.32655V11.5366H3.24829V3.40454Z"
          fill="#363735"
        />
        <path
          d="M6.38971 6.94385H8.46797V11.5365H6.38971V6.94385Z"
          fill="#363735"
        />
        <path
          d="M9.53131 0.244385H11.6096V11.5365H9.53131V0.244385Z"
          fill="#363735"
        />
      </svg>
    </b-button>
  </div>
</template>

<script>
  const chartTypes = {
    line: 'line',
    histogram: 'histogram',
  };

  export default {
    name: 'ChartTypeToggler',
    props: {
      initialType: {
        type: String,
        default: chartTypes.line,
      },
    },
    data() {
      return {
        type: this.initialType,
        chartTypes,
      };
    },
    methods: {
      handleClick(type) {
        if (this.type === type) {
          return;
        }

        this.type = type;

        this.$emit('onChange', type);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .wrapper {
    display: flex;
    gap: 19px;
    flex-wrap: nowrap;
  }

  .button {
    background: white;
    border: 1px solid #363735;
    path {
      fill: #363735;
    }
  }

  .button.active {
    background: #309282;
    border-color: #309282;
    path {
      fill: white;
    }
  }
</style>
