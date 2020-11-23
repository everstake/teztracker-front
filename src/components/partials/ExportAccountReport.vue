<template>
  <div class="export">
    <b-btn
      class="card__button"
      variant="success"
      type="submit"
      @click="handleExportClick"
    >
      {{ $t('common.export') }}
    </b-btn>

    <b-modal
      id="export-data"
      size="md"
      class="modal"
      centered
      hide-header
      hide-footer
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
          />
        </div>
        <div class="modal__section">
          <p class="modal__subtitle">Select operations</p>
          <div class="export-operations">
            <b-row>
              <b-col>
                <b-form-checkbox-group
                  v-model="checkboxes.selected"
                  :options="checkboxes.operations"
                  switches
                  size="md"
                />
              </b-col>
            </b-row>
          </div>
        </div>
        <div class="modal__section text-center">
          <b-button
            :disabled="calendar.loading"
            size="md"
            variant="success"
            @click="exportReport"
          >
            Export
          </b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import DatePicker from 'vue2-datepicker';
  import 'vue2-datepicker/locale/zh-cn';
  import 'vue2-datepicker/locale/ru';
  import moment from 'moment';
  import i18n from '@/plugins/i18n';
  import { mapState } from 'vuex';

  export default {
    name: 'ExportAccountReport',
    components: {
      DatePicker,
    },
    data() {
      return {
        calendar: {
          selected: [new Date(), new Date()],
          loading: false,
        },
        checkboxes: {
          selected: [
            'transaction',
            'endorsement',
            'delegation',
            'origination',
            'activate_account',
            'double_baking_evidence',
            'double_endorsement_evidence',
            'baking',
          ],
          operations: [
            { text: 'Transaction', value: 'transaction' },
            { text: 'Baking', value: 'baking' },
            { text: 'Endorsement', value: 'endorsement' },
            { text: 'Delegation', value: 'delegation' },
            { text: 'Origination', value: 'origination' },
            { text: 'Activation', value: 'activate_account' },
            // { text: 'Reveal', value: 'reveal' },
            { text: 'Double-baking', value: 'double_baking_evidence' },
            {
              text: 'Double-endorsement',
              value: 'double_endorsement_evidence',
            },
          ],
        },
      };
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
    },
    methods: {
      handleExportClick() {
        this.$bvModal.show('export-data');
      },
      async exportReport() {
        /* eslint-disable */
        const account = this.$route.params.baker;
        const from = moment(this.calendar.selected[0])
          .startOf('day')
          .utc()
          .unix();
        const to = moment(this.calendar.selected[1])
          .endOf('day')
          .utc()
          .unix();
        const selectedOperations = this.checkboxes.selected;
        const props = {
          account,
          operation_type: selectedOperations,
          from,
          to,
        };
        const config = {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/csv'
          },
          data: {},
        };
        this.calendar.loading = true;
        await this.$api
          .getAccountReport(props, config)
          .then((response) => {
            if (response.code !== 200) return;
            const blobURL = window.URL.createObjectURL(new Blob([response.data]));
            const tempLink = document.createElement('a');

            tempLink.href = blobURL;
            tempLink.setAttribute('download', 'report.csv');
            document.body.appendChild(tempLink);

            tempLink.click();

            setTimeout(function() {
              document.body.removeChild(tempLink);
              window.URL.revokeObjectURL(blobURL);
            }, 200)

            this.$bvModal.hide('export-data');
          })
          .catch((error) => {
            console.log(error);
          });
        this.calendar.loading = false;
      },
    },
  };
</script>

<style scoped lang="scss">
  .modal__section:not(:last-child) {
    margin-bottom: 1rem;
  }

  .modal__subtitle {
    margin-bottom: 0.5rem;
  }

  ::v-deep .custom-switch {
    max-width: 28%;
    width: 100%;
    margin-bottom: 0.3rem;

    @include max-width-mobiles-landscape {
      max-width: 45%;
      margin-bottom: 0.5rem;
    }
  }

  ::v-deep .custom-switch:last-child {
    margin-bottom: 0;
  }
</style>
