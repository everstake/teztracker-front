<template>
  <div class="settings">
    <h3>
      Settings
    </h3>
    <hr />
    <div class="settings__item">
      {{ $t('header.dateFormat') }}
      <DateFormatSwitcher class="pointer" :is-switch-only="true" />
    </div>
    <div class="settings__item">
      <CurrencySwitcher />
    </div>
    <div class="settings__item">
      <b-form-group :label="'Language'">
        <b-form-radio-group
          v-model="language"
          :options="options"
        />
      </b-form-group>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import DateFormatSwitcher from '@/components/partials/DateFormatSwitcher';
  import CurrencySwitcher from '@/components/partials/CurrencySwitcher';

  export default {
    name: 'AccountSettings',
    components: {
      DateFormatSwitcher,
      CurrencySwitcher,
    },
    props: {
      email: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        options: [
          { text: 'EN', value: 'en' },
          { text: 'RU', value: 'ru' },
          { text: 'ZH', value: 'zh' },
        ],
      };
    },
    computed: {
      ...mapState('app', ['currentCurrency']),
      ...mapState('user', ['beaconAccount']),
      language: {
        get() {
          return this.$translation.currentLanguage;
        },
        set(language) {
          this.$translation.currentLanguage = language;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .settings__item {
    margin-bottom: 1.5rem;
  }
</style>
