<template>
  <b-nav-item-dropdown variant="link" class="custom-dropdown" right>
    <template #button-content>
      <flag :iso="getLanguageFlag(currentLanguage)" />
      {{ currentLanguage.toUpperCase() }}
    </template>

    <b-dropdown-item
      v-for="(lang, index) in langs"
      :key="index"
      @click="setLanguage(lang)"
    >
      <flag :iso="getLanguageFlag(lang)" />
      {{ lang.toUpperCase() }}
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
  import { translation } from '@/plugins/translation';

  export default {
    name: 'LanguageSwitcher',
    data() {
      return {
        langs: this.$i18n.availableLocales,
        browserLang: navigator.language.split('-')[0].toLowerCase(),
      };
    },
    computed: {
      currentLanguage() {
        return translation.currentLanguage;
      },
    },
    created() {
      const routerLanguage = this.$route.params.language;
      const routerLanguageSupported = translation.isLangSupported(routerLanguage);
      const applicationLanguage = translation.getUserLang().langNoISO;

      if (routerLanguageSupported) {
        translation.currentLanguage = routerLanguage;
      } else {
        translation.currentLanguage = applicationLanguage;
      }
    },
    methods: {
      setLanguage(language) {
        translation.currentLanguage = language;
        const { name, params } = this.$route;
        this.$router.replace({ name, params: { ...params, language: language } });
      },
      getLanguageFlag(language) {
        if (language === 'en') {
          return 'us';
        }

        if (language === 'ru') {
          return 'ru';
        }

        if (language === 'zh') {
          return 'cn';
        }
      },
    },
  };
</script>
