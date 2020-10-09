<template>
  <b-row>
    <b-col lg="12">
      <b-card no-body>
        <b-card-header>
          <h3 id="card-title" class="card__title">
            <span class="text card-title__text">
              <template>
                {{ props.blockHash }}
              </template>
            </span>
          </h3>
          <div class="subtitle">
            <span v-if="props.kind === 'double_baking_evidence'">
              {{ $t('infoTypes.dblBakingInfo') }}
            </span>
            <span v-else-if="props.kind === 'double_endorsement_evidence'">
              {{ $t('infoTypes.dblEndorsementInfo') }}
            </span>
          </div>
        </b-card-header>

        <div class="card-divider"></div>

        <b-card-body>
          <b-container fluid>
            <b-row>
              <b-col class="card__no-padding" lg="6">
                <b-row class="item-info">
                  <b-col lg="4" class="label">{{
                    $t('common.includedInBlock')
                  }}</b-col>
                  <b-col lg="7" class="text-accent value">
                    <router-link
                      class="color-accent"
                      :to="{
                        name: 'block',
                        params: { level: props.blockLevel },
                      }"
                    >
                      {{ props.blockLevel }}
                    </router-link>
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('hashTypes.opHash') }}
                  </b-col>
                  <b-col lg="7" class="text-accent card__pointer">
                    {{ props.operationGroupHash }}
                    <BtnCopy
                      id="hash"
                      :text-to-copy="props.operationGroupHash"
                    />
                    <b-tooltip ref="tooltip" triggers="hover" target="hash">
                      {{ $t('common.copyToClipboard') }}
                    </b-tooltip>
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('dblBakingList.accuser') }}
                  </b-col>
                  <b-col lg="7" class="text-accent">
                    <span>
                      {{
                        props.doubleOperationDetails.evidence_baker_name ||
                          props.doubleOperationDetails.evidence_baker
                      }}
                    </span>
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $tc('common.cycle', 1) }}
                  </b-col>
                  <b-col lg="7" class="text-accent">
                    <span>
                      {{ props.cycle }}
                    </span>
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('common.timestamp') }}
                  </b-col>
                  <b-col lg="7" class="value">
                    {{ props.timestamp | timeformat(dateFormat) }}
                  </b-col>
                </b-row>
              </b-col>

              <b-col class="p-0 px-lg-3" lg="6">
                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('dblBakingList.offender') }}
                  </b-col>
                  <b-col lg="6" class="text-accent">
                    {{
                      props.doubleOperationDetails.offender_name ||
                        props.doubleOperationDetails.offender
                    }}
                  </b-col>
                </b-row>

                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('common.denouncedLvl') }}
                  </b-col>
                  <b-col lg="6" class="text-accent">
                    {{ props.doubleOperationDetails.denounced_level }}
                  </b-col>
                </b-row>

                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('dblBakingList.lostDeposits') }}
                  </b-col>
                  <b-col lg="6" class="text-accent">
                    {{ props.doubleOperationDetails.lost_deposits | tezos }}
                  </b-col>
                </b-row>

                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('dblBakingList.lostRewards') }}
                  </b-col>
                  <b-col lg="6" class="text-accent">
                    {{ props.doubleOperationDetails.lost_rewards | tezos }}
                  </b-col>
                </b-row>

                <b-row class="item-info">
                  <b-col lg="4" class="label">{{
                    $t('dblBakingList.accuserRewards')
                  }}</b-col>
                  <b-col lg="7" class="text-accent">
                    {{ props.doubleOperationDetails.baker_reward | tezos }}
                  </b-col>
                </b-row>

                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('txSingle.confirmations') }}
                  </b-col>
                  <b-col lg="7" class="value">
                    {{ props.confirmations | formatInteger }}
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-container>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
  import { mapState } from 'vuex';
  import BtnCopy from '@/components/partials/BtnCopy';

  export default {
    name: 'DoubleOperationsSingle',
    components: {
      BtnCopy,
    },
    props: ['props'],
    computed: {
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .card-header .title {
    word-break: break-word;
  }

  .card__title {
    display: inline-flex;
    align-items: center;
    padding-right: 0 !important; /* outweigh selector cascade from public styles */
  }

  .icon-primary {
    color: $color-brand;
  }

  .icon {
    display: inline-block;
    padding-left: 0.5rem;
    font-size: 15px;
  }

  .label {
    font-size: 13px;
    font-weight: 600;
    line-height: 16px;
    color: #9ea0a5;
  }

  .stats-row {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
</style>
