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
