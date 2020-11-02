<template>
  <div class="limit">
    <label for="perPageSelect" class="mb-1">
      {{ $t('perPageSelect.itemsPerPage') }}
    </label>
    <b-select
      id="perPageSelect"
      :value="limit"
      size="sm"
      :options="perPageOptions"
      class="limit"
      :class="{
        'page--loading': loading,
        'limit--loading': loading,
      }"
      @input="handleLimitChange"
    />
  </div>
</template>

<script>
  export default {
    name: 'LimitSelect',
    props: {
      limit: Number,
      loading: Boolean,
    },
    data() {
      return {
        perPageOptions: this.$constants.PER_PAGE_OPTIONS,
      };
    },
    methods: {
      handleLimitChange(value) {
        this.$emit('onLimitChange', value);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .limit {
    display: block;
  }

  .limit:focus {
    border-color: $color-brand;
    box-shadow: 0 0 0 0.2rem $color-brand--opacity-2;
  }

  .limit--loading {
    background-color: #e0efec;
  }
</style>
