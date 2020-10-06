<template>
  <div v-if="!hide">
    <label for="perPageSelect" class="mb-1">
      {{ $t('perPageSelect.itemsPerPage') }}
    </label>
    <b-select
      id="perPageSelect"
      v-model="perPage"
      :options="perPageOptions"
      size="sm"
      class="custom-select--themed"
    />
  </div>
</template>

<script>
  export default {
    name: 'PerPageSelect',
    data() {
      return {
        perPage: this.$constants.PER_PAGE,
        perPageOptions: this.$constants.PER_PAGE_OPTIONS,
      };
    },
    props: {
      hide: {
        type: Boolean,
        default: false,
      },
      defaultPerPage: {
        type: Number,
        default: 0,
      },
    },
    watch: {
      defaultPerPage: {
        immediate: true,
        handler(value) {
          if (value) {
            this.perPage = value;
            this.$emit('per-page', value);
          }
        },
      },
      perPage: {
        immediate: true,
        handler(value) {
          this.$emit('per-page', value);
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .custom-select--themed {
    display: block;

    &:focus {
      border-color: $color-brand;
      box-shadow: 0 0 0 0.2rem $color-brand--opacity-2;
    }
  }
</style>
