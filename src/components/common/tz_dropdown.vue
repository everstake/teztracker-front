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
  name: "tzDropdown",
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
    color: #9ea0a5;
    font-weight: bold;
    &:hover {
      text-decoration: none;
      color: #309282;
    }
  }
  &-item {
    cursor: pointer;
  }
}
</style>
