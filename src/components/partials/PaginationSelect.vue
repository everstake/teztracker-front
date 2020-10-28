<template>
  <div class="pagination-block">
    <b-pagination
      @change="handlePageChange"
      :value="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      :align="align"
      :limit="3"
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
    },
    methods: {
      handlePageChange(page) {
        this.$emit('change', page);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .pagination-block {
    display: flex;
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
