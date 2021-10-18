<template>
  <b-card no-body xl="6" class="mb-30">
    <b-card-body>
      <div class="min-h-400 wrapper">
        <div v-if="loading || !data" class="min-h-400 vote__loading">
          {{ $t('common.loading') }}
        </div>

        <CircleDiagram v-else :progress-percent="percent">
          <template slot="top-content">
            <p class="text">
              Amount holding {{ percent }}% (quorum to start voting)
            </p>
          </template>
        </CircleDiagram>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
  import CircleDiagram from '@/components/partials/CircleDiagram';

  export default {
    name: 'ChartHoldingQuorumStartVoting',
    components: { CircleDiagram },
    data() {
      return {
        loading: false,
        data: null,
      };
    },
    computed: {
      percent() {
        return this.data.percent * 100;
      },
    },
    mounted() {
      this.fetch();
    },
    methods: {
      async fetch() {
        this.loading = true;

        try {
          const response = await this.$api.getBakersHolding();

          this.data = response.data[0];
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        }

        this.loading = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .color {
    color: #309282;
  }

  .text {
    padding: 0 20px;
    text-align: center;
    font-size: 21px;
    font-weight: bold;
  }

  .text-inner {
    margin: 0;
    text-align: center;
    font-size: 21px;
  }
</style>
