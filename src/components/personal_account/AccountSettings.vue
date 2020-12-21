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
      <b-form-group :label="$t('currencySwitcher.title')">
        <b-form-radio-group
          v-model="languageModel"
          :options="languageOptions"
        />
      </b-form-group>
    </div>
    <div class="settings__item">
      <b-form-group label="Change email address">
        <b-form-input
          class="form-group email-input"
          placeholder="user@gmail.com"
          type="text"
          :value="email"
          @input="handleEmailChange"
          >{{ email }}</b-form-input
        >
      </b-form-group>
    </div>
  </div>
</template>

<script>
  import { mapMutations, mapState } from 'vuex';
  import { USER_SET_EMAIL } from '@/store/mutations.types';
  import DateFormatSwitcher from '@/components/partials/DateFormatSwitcher';
  import CurrencySwitcher from '@/components/partials/CurrencySwitcher';

  export default {
    name: 'AccountSettings',
    components: {
      DateFormatSwitcher,
      CurrencySwitcher,
    },
    data() {
      return {
        languageOptions: [
          { text: 'EN', value: 'en' },
          { text: 'RU', value: 'ru' },
          { text: 'ZH', value: 'zh' },
        ],
      };
    },
    computed: {
      ...mapState('user', {
        email: (state) => state.email,
      }),
      ...mapState('app', ['currentCurrency']),
      languageModel: {
        get() {
          return this.$translation.currentLanguage;
        },
        set(language) {
          this.$translation.currentLanguage = language;
        },
      },
    },
    methods: {
      ...mapMutations('user', [USER_SET_EMAIL]),
      handleEmailChange(value) {
        this[USER_SET_EMAIL](value);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .email-input {
    max-width: 270px;
  }

  .settings__item {
    margin-bottom: 1.5rem;
  }
</style>
