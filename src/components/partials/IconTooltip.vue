<template>
  <b-btn
    v-b-tooltip.focus
    :title="tooltipTxt"
    variant="icon"
    class="btn--tooltip"
  >
    <font-awesome-icon icon="question-circle" class="icon icon-circle" />
  </b-btn>
</template>

<script>
  export default {
    name: 'IconTooltip',
    props: {
      tooltipTxt: {
        type: String,
        required: true,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .btn--tooltip {
    color: $color-brand;
    padding: 0;
    display: flex;
    font-size: 16px;
    border-radius: 50%;
    margin-left: 7px;

    &:hover {
      color: darken($color-brand, 10%);
    }

    &:focus {
      color: darken($color-brand, 15%);
    }
  }
</style>
