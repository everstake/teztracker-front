<template>
  <div>
    <label for="perPageSelect" class="mb-1">
      {{ $t('perPageSelect.itemsPerPage') }}
    </label>
    <b-select
      id="perPageSelect"
      :value="perPage"
      @input="handleLimitChange"
      :options="perPageOptions"
      size="sm"
      class="custom-select--themed"
    />
  </div>
</template>

<script>
  export default {
    name: 'LimitSelect',
    data() {
      return {
        perPageOptions: this.$constants.PER_PAGE_OPTIONS,
      };
    },
    props: {
      perPage: Number,
    },
    methods: {
      handleLimitChange(value) {
        this.$emit('per-page', value);
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
