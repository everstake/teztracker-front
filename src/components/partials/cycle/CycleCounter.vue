<template>
  <section class="cycle-counter">
    <b-row>
      <b-col>
        <b-card no-body>
          <b-card-header>
            <div class="cycle-counter__title title text-center">
              {{ $t('counters.cycleCounter') }}
            </div>
          </b-card-header>

          <b-card-body>
            <div class="progress-labels">
              <div class="cycle-label mr-2">
                {{ $tc('common.cycle', 1) }} - {{ head.metaCycle }}
              </div>
              <div class="tezos-label">Tezos {{ $_network }}</div>
            </div>

            <b-row>
              <b-col>
                <b-progress :value="cyclePercent" :max="100" class="mb-2" />
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <div class="progress-labels">
                  <div class="percentage mr-2">{{ cyclePercent }}%</div>
                  <div class="timer">
                    {{ timeLeft }} - {{ $t('counters.untilEnd') }}
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </section>
</template>

<script>
  import { mapState } from 'vuex';
  import moment from 'moment';
  import network from '../../../mixins/network';

  export default {
    name: 'CycleCounter',
    mixins: [network],
    computed: {
      ...mapState('app', {
        info: (state) => state.priceInfo,
      }),
      ...mapState('blocks', {
        head: (state) => state.headBlock,
      }),
      cyclePercent() {
        return parseInt(
          (
            (this.head.metaCyclePosition / this.info.blocks_in_cycle) *
            100
          ).toFixed(),
        );
      },
      timeLeft() {
        const d = moment(
          this.head.timestamp * this.$constants.THOUSAND_MILLISECONDS,
        ).add(
          this.info.blocks_in_cycle - this.head.metaCyclePosition,
          'minutes',
        );
        const duration = moment.duration(d.diff(moment()));
        return `${
          duration.days() > 0 ? duration.days() + this.$t('counters.d') : ''
        } ${duration.hours()}${this.$t(
          'counters.h',
        )} ${duration.minutes()}${this.$t('counters.m')}`;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .cycle-counter {
    margin-top: 0;
    padding: 0;

    @include for-phone-only {
      padding: 0;
    }

    &__title {
      font-size: 15px;
    }
  }
</style>
