<template>
  <b-tab :title="title" :active="active">
    <b-card-header v-if="$slots.header">
      <slot name="header" />
    </b-card-header>

    <b-card-body>
      <slot name="body" />
    </b-card-body>
  </b-tab>
</template>

<script>
  export default {
    name: 'Tab',
    props: {
      title: {
        type: String,
        required: true,
      },
      active: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>
