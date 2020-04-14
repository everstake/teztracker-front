<template>
  <b-nav-item-dropdown variant="link" class="custom-dropdown" right>
    <template #button-content>
      <flag :iso="mapEN(currLang)" />
      {{ currLang.toUpperCase() }}
    </template>

    <b-dropdown-item
      v-for="(lang, index) in langs"
      :key="index"
      @click="setLang(lang)"
    >
      <flag :iso="mapEN(lang)" />
      {{ lang.toUpperCase() }}
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
export default {
  name: "LanguageSwitcher",
  data() {
    return {
      langs: this.$i18n.availableLocales,
      browserLang: navigator.language.split("-")[0].toLowerCase()
    };
  },
  computed: {
    currLang() {
      return this.$i18n.locale;
    }
  },
  created() {
    this.setLang(this.defineInitialLang());
  },
  methods: {
    mapEN(en) {
      return en === "en" ? "us" : en;
    },
    setLang(lang) {
      if (this.$helpers.isLocalStorageAvailable) {
        localStorage.setItem("lang", lang);
      }
      
      this.$i18n.locale = lang;
  
      this.$eventBus.$emit("lang-change", this.currLang);
    },
    defineInitialLang() {
      if (
        this.$helpers.isLocalStorageAvailable &&
        localStorage.getItem("lang") !== null
      ) {
        return localStorage.getItem("lang");
      }
      if (this.langs.includes(this.browserLang)) {
        return this.browserLang;
      }
      return this.$i18n.locale || "en";
    }
  }
};
</script>
