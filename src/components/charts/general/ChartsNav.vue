<template>
  <div class="wrapper">
    <button class="button-open" @click="open">
      <svg
        width="12"
        height="15"
        viewBox="0 0 7 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.5 8.5L5.5 5L1.5 1.5"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <div :class="['charts-nav', { active: isOpen }]">
      <div class="top">
        <Logo color-main="#fff" color-bg="transparent" />

        <button class="button-close" @click="close">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.0929737 14.2407C0.28288 14.7008 0.731605 15.0009 1.22925 15.0004C1.5566 15.0022 1.87098 14.8725 2.10193 14.6404L7.5 9.24039L12.8981 14.6404C13.129 14.8725 13.4434 15.0022 13.7708 15.0004C14.2684 15.0009 14.7171 14.7009 14.907 14.2407C15.0969 13.7806 14.9905 13.2513 14.6374 12.9004L9.23938 7.50039L14.6374 2.10039C14.9482 1.78957 15.0695 1.33654 14.9558 0.911952C14.842 0.487362 14.5105 0.15572 14.0861 0.0419517C13.6616 -0.0718167 13.2088 0.0495728 12.8981 0.360394L7.5 5.76039L2.10193 0.360394C1.62162 -0.120094 0.842871 -0.120094 0.362555 0.360394C-0.11776 0.840882 -0.11776 1.61991 0.362555 2.10039L5.76062 7.50039L0.362555 12.9004C0.00952858 13.2513 -0.0969321 13.7806 0.0929737 14.2407Z"
              fill="white"
            />
          </svg>
        </button>
      </div>

      <h3 class="charts-nav-title">Charts</h3>

      <div class="list">
        <ChartNavItemGroup
          title="General Charts"
          :items="chartLinks.general"
          @click="close"
        />

        <ChartNavItemGroup
          title="Baker efficiency charts"
          :items="chartLinks.efficiency"
          @click="close"
        />

        <ChartNavItemGroup
          title="Decentralization / Centralization data"
          :items="chartLinks.decentralCentral"
          @click="close"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import Logo from '@/components/partials/icons/Logo';
  import ChartNavItemGroup from '@/components/charts/general/ChartNavItemGroup';

  export default {
    name: 'ChartsNav',
    components: { Logo, ChartNavItemGroup },
    props: {
      chartLinks: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        isOpen: false,
      };
    },
    methods: {
      open() {
        this.isOpen = true;
      },
      close() {
        this.isOpen = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .wrapper {
    position: fixed;
    display: flex;

    top: 40%;
    z-index: 101;
  }

  .charts-nav {
    position: fixed;
    display: flex;
    flex-direction: column;

    width: 320px;
    height: 100vh;
    padding: 20px;

    top: 0;
    left: -320px;
    z-index: 101;

    transition: left 0.5s ease-out;
    background: #309282;
    color: white;

    &.active {
      left: 0;
    }
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 26px;
  }

  .charts-nav-title {
    padding: 0 20px;
    border-bottom: 1px solid white;
    margin-bottom: 13px;
  }

  .list {
    margin-bottom: 40px;
    overflow-y: scroll;
  }

  .button-open {
    border: 1px solid #309282;
    padding: 8px 6px 8px 5px;
    background: #309282;

    border-bottom-right-radius: 35%;
    border-top-right-radius: 35%;
  }

  .button-close {
    border: none;
    background: none;
  }
</style>
