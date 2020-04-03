<template>
  <b-form-checkbox v-if="isSwitchOnly" v-model="isUSDateFormat" name="date-format" switch>
    {{ isUSDateFormat ? $t("dateSwitcher.usFormat") : $t("dateSwitcher.standardFormat") }}
  </b-form-checkbox>

  <b-dropdown v-else id="blocks" variant="link" class="custom-dropdown">
    <template #button-content>
      <font-awesome-icon icon="cog" />
      <font-awesome-icon icon="angle-down" class="ml-1" />
    </template>

    <b-dropdown-text>
      <b-form-group label="Date format:" class="mb-0">
        <b-form-checkbox v-model="isUSDateFormat" name="date-format" switch>
          {{ isUSDateFormat ? $t("dateSwitcher.usFormat") : $t("dateSwitcher.standardFormat") }}
        </b-form-checkbox>
      </b-form-group>
    </b-dropdown-text>
  </b-dropdown>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { SET_DATE_FORMAT } from "@/store/mutations.types";

export default {
  name: "DateFormatSwitcher",
  props: {
    isSwitchOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isUSDateFormat: this.$helpers.isLocalStorageAvailable()
        ? localStorage.getItem("defaultDateFormat") ===
          this.$constants.DATE_FORMAT_US
        : false
    };
  },
  computed: {
    ...mapState("app", {
      dateFormat: state => state.dateFormat
    })
  },
  watch: {
    isUSDateFormat: {
      immediate: true,
      handler(value) {
        const userDefaultDateFormat = value
          ? this.$constants.DATE_FORMAT_US
          : this.$constants.DATE_FORMAT;

        this[SET_DATE_FORMAT](userDefaultDateFormat);
      }
    }
  },
  methods: {
    ...mapMutations("app", [SET_DATE_FORMAT])
  }
};
</script>

<style lang="scss">
  .date-switcher {
    cursor: pointer;

    & label,
    & input {
      cursor: pointer;
    }
    
    & .dropdown-menu {
      /*font-size: 14px;*/
      /*padding: 1px;*/
    }
  }
</style>
