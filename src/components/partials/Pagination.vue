<template>
  <div
    class="pagination-block"
    :class="{
      'pagination-block--loading': loading,
    }"
  >
    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      :align="align"
      :limit="3"
      hide-goto-end-buttons
      @change="handlePageChange"
    />
  </div>
</template>

<script>
  export default {
    name: 'Pagination',
    props: {
      totalRows: {
        type: Number,
        default: 0,
      },
      align: {
        type: String,
        default: 'right',
      },
      firstText: {
        type: String,
        default: 'Start',
      },
      prevText: {
        type: String,
        default: 'Prev',
      },
      nextText: {
        type: String,
        default: 'Next',
      },
      lastText: {
        type: String,
        default: 'End',
      },
      perPage: {
        type: Number,
        default() {
          return this.$constants.PER_PAGE;
        },
      },
      loading: Boolean,
    },
    data() {
      return {
        currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      };
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

<style>
  .pagination-block--loading .page-item.active {
    pointer-events: none;
    user-select: none;
    background-color: #e0efec;
  }
</style>
