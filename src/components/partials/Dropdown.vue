<template>
  <div class="dropdown">
    <a
      class="dropdown-toggle dropdown__title"
      data-toggle="dropdown"
      href="#"
      role="button"
      aria-haspopup="true"
      aria-expanded="false"
      >{{ currentVal }}</a
    >
    <div class="dropdown-menu">
      <div class="dropdown-item" @click="selectItem('This Month')">
        This Month
      </div>
      <div class="dropdown-item" @click="selectItem('This Year')">
        This Year
      </div>
    </div>
  </div>
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
