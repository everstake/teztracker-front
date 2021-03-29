<template>
  <div class="charts">
    <div class="sidebar">
      <b-button v-b-toggle.sidebar class="sidebar__button">
        <font-awesome-icon icon="bars" class="sidebar__icon" />
      </b-button>

      <b-sidebar
        id="sidebar"
        sidebar-class="tz-sidebar"
        title="Charts"
        backdrop
      >
        <div class="px-3 py-2">
          <div class="sidebar__search mb-3">
            <b-form-input
              id="sidebar-search-input"
              v-model.trim="sidebar.search"
              type="text"
              placeholder="Search chart"
              class="sidebar__input"
              autocomplete="off"
              autofocus
            />
            <label class="sidebar__label" for="sidebar-search-input">
              <font-awesome-icon
                v-if="!sidebar.search.length"
                class="search-icon"
                icon="search"
              />
              <font-awesome-icon
                @click="sidebar.search = ''"
                v-else
                class="times-icon"
                :icon="['far', 'times-circle']"
              />
            </label>
          </div>
          <div class="sidebar__navigation">
            <div
              v-for="(item, index) in sidebarMenu"
              :key="index + generateKey()"
            >
              <div id="dropdown-header" class="m-2 sidebar__dropdown">
                <div class="menu__title">
                  <span>{{ item.title }}</span> <span v-if="!sidebar.search.length">({{ item.items.length }})</span>
                </div>
                <ul class="sidebar__menu menu">
                  <li
                    class="menu__item"
                    v-for="(text, index) in item.items"
                    :key="index + generateKey()"
                    aria-describedby="dropdown-header-label"
                  >
                    <b-link v-if="!item.hidden" :href="`#${text.id}`">{{
                      text.name
                    }}</b-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </b-sidebar>
    </div>

    <section>
      <Breadcrumbs :crumbs="getCrumbs('general')" class="mb-3" />

      <b-container fluid>
        <b-row>
          <b-col xl="6" class="mb-30">
            <ChartNumOfBlocks class="chart" id="blocks-num" />
          </b-col>
          <b-col xl="6" class="mb-30">
            <ChartTxVolume id="tx-volume" />
          </b-col>
        </b-row>

        <b-row>
          <b-col xl="6" class="mb-30">
            <ChartNumOfOps id="operations-num" />
          </b-col>
          <b-col xl="6" class="mb-30">
            <ChartAvgBlockDelay id="av-block-delay" />
          </b-col>
        </b-row>

        <b-row>
          <b-col xl="6" class="mb-30">
            <ChartFeesPerDay id="fees-per-day" />
          </b-col>
          <b-col xl="6" class="mb-30">
            <ChartActivations id="activations" />
          </b-col>
        </b-row>

        <b-row>
          <b-col xl="6" class="mb-30">
            <ChartDelegationVolume id="del-volume" class="chart-min-height" />
          </b-col>
          <b-col xl="6">
            <ChartNumOfWhaleAccs id="whale-accounts" />
          </b-col>
        </b-row>
      </b-container>
    </section>

    <section>
      <Breadcrumbs :crumbs="getCrumbs('baking')" class="mb-3" />

      <b-container fluid>
        <b-row>
          <b-col xl="6" class="mb-30">
            <ChartRollsDistribution id="rolls-distribution" />
          </b-col>
          <b-col xl="6">
            <ChartPrioritiesPerCycle id="cycle-priority" />
          </b-col>
        </b-row>

        <b-row>
          <b-col xl="6" class="mt-2">
            <ChartBakersPerDay id="bakers-per-day" />
          </b-col>
        </b-row>
      </b-container>
    </section>

    <section>
      <Breadcrumbs :crumbs="getCrumbs('accounts')" class="mb-3" />
      <b-container fluid>
        <b-row>
          <b-col xl="6" class="mb-30">
            <AddressesNumber id="total-addresses" :y-ticks-step-size="500" />
          </b-col>
          <b-col xl="6">
            <div class="position-relative">
              <b-btn
                class="period-button"
                variant="success"
                type="submit"
                @click="$bvModal.show('new-addresses-modal')"
              >
                Last 24 hours
              </b-btn>

              <b-modal
                id="new-addresses-modal"
                size="md"
                class="modal"
                centered
                hide-header
                hide-footer
                @hidden="calendar.selected = [new Date(), new Date()]"
              >
                <div class="export-container">
                  <div class="modal__section calendar">
                    <p class="modal__subtitle">Select period</p>
                    <date-picker
                      inline
                      v-model="calendar.selected"
                      range-separator=" - "
                      prefix-class="teztracker"
                      :range="true"
                      :lang="calendarLanguage"
                      :disabled-date="calendarDisabledDates"
                    />
                  </div>
                  <div class="modal__section text-center mt-2">
                    <b-button
                      :disabled="calendar.loading"
                      size="md"
                      variant="success"
                      @click="reloadChart('newAddresses')"
                    >
                      Select
                    </b-button>
                  </div>
                </div>
              </b-modal>
              <NewAddressesNumber
                :props-data="chartData.newAddresses"
                id="new-addresses"
              />
            </div>
          </b-col>
        </b-row>

        <b-row>
          <b-col xl="6" class="mb-30">
            <div class="position-relative">
              <b-btn
                class="period-button"
                variant="success"
                type="submit"
                @click="$bvModal.show('lowBalanceAddresses')"
              >
                Last 24 hours
              </b-btn>

              <b-modal
                id="lowBalanceAddresses"
                size="md"
                class="modal"
                centered
                hide-header
                hide-footer
                @hidden="calendar.selected = [new Date(), new Date()]"
              >
                <div class="export-container">
                  <div class="modal__section calendar">
                    <p class="modal__subtitle">Select period</p>
                    <date-picker
                      inline
                      v-model="calendar.selected"
                      range-separator=" - "
                      prefix-class="teztracker"
                      :range="true"
                      :lang="calendarLanguage"
                      :disabled-date="calendarDisabledDates"
                    />
                  </div>
                  <div class="modal__section text-center mt-2">
                    <b-button
                      :disabled="calendar.loading"
                      size="md"
                      variant="success"
                      @click="reloadChart('lowBalanceAddresses')"
                    >
                      Select
                    </b-button>
                  </div>
                </div>
              </b-modal>
              <LowBalanceAddressesNumber
                :props-data="chartData.lowBalanceAddresses"
                id="low-balances-addresses"
                class="mt-2"
              />
            </div>
          </b-col>
          <b-col xl="6">
            <ActriveAddressesNumber id="active-addresses" />
          </b-col>
        </b-row>

        <b-row>
          <b-col xl="6" class="mb-30 mt-2">
            <InactriveAddressesNumber id="inactive-addresses" />
          </b-col>
          <b-col xl="6">
            <SmartContractsNumber id="smart-contracts" />
          </b-col>
        </b-row>

        <b-row>
          <b-col xl="6">
            <div class="position-relative">
              <b-btn
                class="period-button"
                variant="success"
                type="submit"
                @click="$bvModal.show('newSmartContracts')"
              >
                Last 24 hours
              </b-btn>

              <b-modal
                id="newSmartContracts"
                size="md"
                class="modal"
                centered
                hide-header
                hide-footer
                @hidden="calendar.selected = [new Date(), new Date()]"
              >
                <div class="export-container">
                  <div class="modal__section calendar">
                    <p class="modal__subtitle">Select period</p>
                    <date-picker
                      inline
                      v-model="calendar.selected"
                      range-separator=" - "
                      prefix-class="teztracker"
                      :range="true"
                      :lang="calendarLanguage"
                      :disabled-date="calendarDisabledDates"
                    />
                  </div>
                  <div class="modal__section text-center mt-2">
                    <b-button
                      :disabled="calendar.loading"
                      size="md"
                      variant="success"
                      @click="reloadChart('newSmartContracts')"
                    >
                      Select
                    </b-button>
                  </div>
                </div>
              </b-modal>
              <NewSmartContractsNumber
                :props-data="chartData.newSmartContracts"
                id="new-smart-contracts"
              />
            </div>
          </b-col>
        </b-row>
      </b-container>
    </section>

    <section>
      <Breadcrumbs :crumbs="getCrumbs('bakerEfficiency')" class="mb-3" />

      <b-container fluid>
        <b-row>
          <b-col xl="6" class="mb-30">
            <LostBlocks id="lost-blocks" />
          </b-col>
          <b-col xl="6">
            <LostEndorsements id="lost-endorsements" />
          </b-col>
        </b-row>

        <b-row>
          <b-col xl="6" class="mt-3">
            <LostRewards id="lost-rewards" />
          </b-col>
        </b-row>
      </b-container>
    </section>

    <section>
      <Breadcrumbs
        :crumbs="getCrumbs('decentralizationCentralization')"
        class="mb-3"
      />

      <b-container fluid>
        <b-row>
          <b-col xl="6" class="mb-30">
            <BakerHoldingAmount
              id="holding-1"
              :props-data="[...chartData.bakerHolding[0]]"
              :label-callback="bakerHoldingLabelCallback"
            />
          </b-col>
          <b-col xl="6" class="mb-30">
            <BakerHoldingAmount
              id="holding-2"
              :props-data="[...chartData.bakerHolding[1]]"
              :label-callback="bakerHoldingLabelCallback"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col xl="6" class="mb-30">
            <BakerHoldingAmount
              id="holding-3"
              :props-data="[...chartData.bakerHolding[2]]"
              :label-callback="bakerHoldingLabelCallback"
            />
          </b-col>
          <b-col xl="6" class="mb-30">
            <BakerHoldingAmount
              id="holding-4"
              :props-data="[...chartData.bakerHolding[3]]"
              :label-callback="bakerHoldingLabelCallback"
            />
          </b-col>
        </b-row>
      </b-container>
    </section>
  </div>
</template>

<script>
  import Breadcrumbs from '@/components/partials/Breadcrumbs';
  import ChartNumOfBlocks from '@/components/charts/general/ChartNumOfBlocks';
  import ChartTxVolume from '@/components/charts/general/ChartTxVolume';
  import ChartNumOfOps from '@/components/charts/general/ChartNumOfOps';
  import ChartAvgBlockDelay from '@/components/charts/general/ChartAvgBlockDelay';
  import ChartFeesPerDay from '@/components/charts/general/ChartFeesPerDay';
  import ChartActivations from '@/components/charts/general/ChartActivations';
  import ChartDelegationVolume from '@/components/charts/general/ChartDelegationVolume';
  import ChartNumOfWhaleAccs from '@/components/charts/general/ChartNumOfWhaleAccs';
  import ChartRollsDistribution from '@/components/charts/baking/ChartRollsDistribution';
  import ChartPrioritiesPerCycle from '@/components/charts/baking/ChartPrioritiesPerCycle';
  import ChartBakersPerDay from '@/components/charts/baking/ChartBakersPerDay';
  import AddressesNumber from '@/components/charts/account/AddressesNumber';
  import NewAddressesNumber from '@/components/charts/account/NewAddressesNumber';
  import LowBalanceAddressesNumber from '@/components/charts/account/LowBalanceAddressesNumber';
  import ActriveAddressesNumber from '@/components/charts/account/ActiveAddressesNumber';
  import InactriveAddressesNumber from '@/components/charts/account/InactiveAddressesNumber';
  import SmartContractsNumber from '@/components/charts/account/SmartContractsNumber';
  import NewSmartContractsNumber from '@/components/charts/account/NewSmartContractsNumber';
  import LostBlocks from '@/components/charts/baker/LostBlocks';
  import LostEndorsements from '@/components/charts/baker/LostEndorsements';
  import LostRewards from '@/components/charts/baker/LostRewards';
  import BakerHoldingAmount from '@/components/charts/baker/BakerHoldingAmount';
  import uuid from '@/mixins/uuid';
  import DatePicker from 'vue2-datepicker';
  import 'vue2-datepicker/locale/zh-cn';
  import 'vue2-datepicker/locale/ru';
  import { mapState } from 'vuex';
  import i18n from '@/plugins/i18n';
  import moment from 'moment';

  export default {
    name: 'Charts',
    components: {
      BakerHoldingAmount,
      LostRewards,
      LostEndorsements,
      LostBlocks,
      NewSmartContractsNumber,
      SmartContractsNumber,
      InactriveAddressesNumber,
      ActriveAddressesNumber,
      LowBalanceAddressesNumber,
      NewAddressesNumber,
      AddressesNumber,
      Breadcrumbs,
      ChartNumOfBlocks,
      ChartTxVolume,
      ChartNumOfOps,
      ChartAvgBlockDelay,
      ChartFeesPerDay,
      ChartActivations,
      ChartDelegationVolume,
      ChartNumOfWhaleAccs,
      ChartRollsDistribution,
      ChartPrioritiesPerCycle,
      ChartBakersPerDay,
      DatePicker,
    },
    mixins: [uuid],
    data() {
      return {
        sidebar: {
          items: [
            {
              title: 'General',
              items: [
                { name: 'Number of blocks', id: 'blocks-num' },
                { name: 'Transactions volume', id: 'tx-volume' },
                { name: '# of operations', id: 'operations-num' },
                { name: 'Average block delay', id: 'av-block-delay' },
                { name: 'Fees per day', id: 'fees-per-day' },
                { name: 'Activations', id: 'activations' },
                { name: 'Delegation volume', id: 'del-volume' },
                { name: '# of whale accounts', id: 'whale-accounts' },
              ],
            },
            {
              title: 'Baking',
              items: [
                { name: 'Rolls distribution', id: 'rolls-distribution' },
                { name: 'Priorities per cycle', id: 'cycle-priority' },
                { name: 'Bakers per day', id: 'bakers-per-day' },
              ],
            },
            {
              title: 'Accounts and addresses',
              items: [
                { name: 'Total number of addresses', id: 'total-addresses' },
                {
                  name: 'Number of addresses with low balance',
                  id: 'low-balances-addresses',
                },
                { name: 'Number of new addresses', id: 'new-addresses' },
                { name: 'Number of active addresses', id: 'active-addresses' },
                {
                  name: 'Number of inactive addresses',
                  id: 'inactive-addresses',
                },
                {
                  name: 'Total number of smart contracts',
                  id: 'smart-contracts',
                },
                {
                  name: 'Number of new smart contracts',
                  id: 'new-smart-contracts',
                },
              ],
            },
            {
              title: 'Baker efficiency charts',
              items: [
                { name: 'Lost blocks', id: 'lost-blocks' },
                { name: 'Lost endorsements', id: 'lost-endorsements' },
                { name: 'Lost rewards', id: 'lost-rewards' },
              ],
            },
            {
              title: 'Decentralization and Centralization',
              items: [
                { name: 'Amount of bakers holding', id: 'holding-1' },
                { name: 'Amount of network holding', id: 'holding-2' },
                { name: 'Amount holding 51%', id: 'holding-3' },
                { name: 'Amount holding 80%', id: 'holding-4' },
              ],
            },
          ],
          activeItem: null,
          search: '',
        },
        chartData: {
          bakerHolding: [],
          newAddresses: [],
          lowBalanceAddresses: [],
          activeAddresses: [],
          newSmartContracts: [],
        },
        calendar: {
          selected: [new Date(), new Date()],
          loading: false,
        },
      };
    },
    created() {
      this.loadBakerHolding();
    },
    methods: {
      async loadBakerHolding() {
        await this.$api
          .getBakersHolding()
          .then((response) => (this.chartData.bakerHolding = response.data))
          .catch(() => {});
      },
      getCrumbs(key) {
        const crumbs = {
          general: 'General charts',
          baking: 'Baking charts',
          accounts: 'Accounts and addresses',
          publicBakers: 'Public Bakers',
          bakerEfficiency: 'Baker efficiency',
          decentralizationCentralization: 'Decentralization and Centralization',
          whaleTracking: 'Whale Tracking',
        };
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          { text: crumbs[key] },
        ];
      },
      bakerHoldingLabelCallback(tooltipItem) {
        const amount = tooltipItem.split(':')[0];
        const percent = tooltipItem.split(':')[1];
        if (!tooltipItem.includes('undefined')) {
          return `${amount} ${percent}`;
        }
        return `${percent}%`;
      },
      async reloadChart(name) {
        const from = moment(this.calendar.selected[0])
          .startOf('day')
          .utc()
          .unix();
        const to = moment(this.calendar.selected[1])
          .endOf('day')
          .utc()
          .unix();

        let request;
        switch (name) {
          case 'newAddresses':
            request = 'getAddressesNumber';
            break;
          case 'lowBalanceAddresses':
            request = 'getLowBalanceAddressesNumber';
            break;
          case 'activeAddresses':
            request = 'getActiveAddressesNumber';
            break;
          case 'newSmartContracts':
            request = 'getNewContractsNumber';
            break;
        }

        if (!request) return;

        const options = { from, to, period: 'day' };

        await this.$api[request](options).then((response) => {
          return (this.chartData[name] = response.data);
        });

        this.$bvModal.hide(name);
      },
      calendarDisabledDates(date) {
        const { networkStartDate } = this;
        const today = moment();

        return date < networkStartDate || date > today;
      },
    },
    computed: {
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
      calendarLanguage() {
        if (i18n.locale === 'zh') {
          return 'zh-cn';
        } else {
          return i18n.locale;
        }
      },
      networkStartDate() {
        const { currentNetwork } = this;
        const mainnetStartDate = '2018-9-17';
        const delphiStartDate = '2020-9-4';

        if (currentNetwork === 'delphinet') {
          return moment(delphiStartDate);
        }

        return moment(mainnetStartDate);
      },
      sidebarMenu() {
        if (!this.sidebar.search.length) {
          return this.sidebar.items;
        }

        const res = this.sidebar.items.map((item) => {
          return {
            items: {
              ...item.items.filter((item) => {
                if (String(item.name.toLowerCase()).includes(this.sidebar.search.toLowerCase())) {
                  return { ...item, hidden: false };
                }
              }),
            },
            title: item.title,
          };
        });

        return res;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .sidebar {
    &__button {
      z-index: 100000;
      position: fixed;
      right: 20px;
      bottom: 20px;
      background: $color-brand !important;
      border-color: $color-brand !important;

      &:focus,
      &:active &:focus:active {
        box-shadow: 0 0 0 0.2rem rgba(48, 146, 130, 0.5) !important;
      }
    }

    &__search {
      position: relative;
    }

    & .search-icon {
      color: $color-brand;
    }

    & .times-icon {
      color: $color-brand;
      cursor: pointer;
    }

    ::v-deep.tz-sidebar {
      color: $color-white !important;
      background-color: $color-brand !important;

      & header {
        & strong {
          font-weight: 500;
        }

        & button {
          color: $color-white !important;
        }
      }
    }

    &__label {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0px;
      right: 0px;
      height: 100%;
      width: 40px;
      margin-bottom: 0;
      background-color: #fff;
      cursor: text;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    &__input {
      height: calc(1.7em + 0.75rem + 2px);
      font-size: 14px;
      color: $color-white;
      border: 1px solid $color-white;
      background-color: rgb(99, 166, 154) !important;

      &::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }
    }

    &__dropdown {
      width: 100%;
      margin-left: 0 !important;
      margin-right: 0 !important;
    }

    ::v-deep .sidebar__dropdown button {
      border: none;
      background: transparent;
      color: $color-white;

      &:hover {
        background: $color-brand--opacity-2 !important;
      }
    }
  }
  section {
    scroll-behavior: smooth;
  }

  .period-button {
    z-index: 10;
    position: absolute;
    right: 10px;
    top: 10px;
    background: $color-white;
    color: $color-brand;
    border: 2px solid $color-brand;
    border-radius: 4px;
  }

  .menu {
    padding-left: 0;
    list-style: none !important;

    &__title {
      font-weight: bold;
    }

    &__item {
      margin: 5px 0;
      width: 100%;

      & a {
        display: block;
        width: 100%;
        padding: 5px 15px;
        color: $color-white !important;

        &:hover {
          text-decoration: none;
          borde-radius: 12px;
          background-color: rgba(255,255,255,.2) !important;
        }
      }
    }
  }
</style>
