<template>
  <b-dropdown variant="link" no-caret class="custom-dropdown">
    <template #button-content>
      {{ currentVal }}
      <font-awesome-icon icon="angle-down" class="ml-1"/>
    </template>

    <b-dropdown-item-button @click="selectItem('This month')">
      This month
    </b-dropdown-item-button>
    <b-dropdown-item-button @click="selectItem('This year')">
      This year
    </b-dropdown-item-button>
  </b-dropdown>
</template>

<script>
export default {
  name: "Dropdown",
  props: ["dropdownTitle"],
  data() {
    return {
      currentVal: this.dropdownTitle
    };
  },
  methods: {
    selectItem(val) {
      this.currentVal = val;
    }
  }
};
</script>

<style lang="scss">
.dropdown {
  &__title {
    text-decoration: none;
    color: $color-grey;
    font-weight: bold;
    &:hover {
      text-decoration: none;
      color: $color-brand;
    }
  }
  &-item {
    cursor: pointer;
  }
}
</style>
