<template>
  <div
    class="pagination-select"
    :class="{
      'pagination-select--loading': loading,
    }"
  >
    <b-pagination
      :limit="3"
      :value="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      :align="align"
      @change="handlePageChange"
      hide-goto-end-buttons
    />
  </div>
</template>

<script>
  export default {
    name: 'PaginationSelect',
    props: {
      totalRows: {
        type: Number,
        default: 0,
      },
      align: {
        type: String,
        default: 'right',
      },
      perPage: Number,
      currentPage: Number,
      loading: Boolean,
    },
    methods: {
      handlePageChange(page) {
        this.$emit('change', page);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .pagination-select {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: auto;
    width: 100%;

    @include for-tablet-portrait-up {
      justify-content: flex-end;
      align-items: center;
      position: relative;
      overflow: hidden;
      width: 100%;
    }
  }
</style>

<style>
  .pagination-select--loading .page-item.active {
    pointer-events: none;
    user-select: none;
    background-color: #e0efec;
  }
</style>
