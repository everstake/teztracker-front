<template>
  <span>
    <b-btn
      v-b-tooltip.hover
      :title="$t('common.copyToClipboard')"
      variant="icon"
      class="py-0 btn--copy"
      v-clipboard:copy="textToCopy"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError"
    >
      <font-awesome-icon class="icon-primary" :icon="['fas', 'copy']" />
    </b-btn>
  </span>
</template>

<script>
  export default {
    name: 'BtnCopy',
    props: {
      textToCopy: {
        type: String,
        default: '',
      },
    },
    methods: {
      onCopy() {
        this.$bvToast.toast('Copied', {
          title: 'Success',
          variant: 'success',
          autoHideDelay: 1500,
        });
      },
      onError() {
        this.$bvToast.toast('Failed to copy', {
          title: 'Error',
          variant: 'danger',
          autoHideDelay: 1500,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .btn--copy {
    color: $color-brand;

    &:hover {
      color: darken($color-brand, 10%);
    }
  }
</style>
