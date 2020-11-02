<template>
  <div
    class="pagination-nav"
    :class="{
      'pagination-nav--loading': loading,
    }"
  >
    <b-pagination-nav
      :limit="3"
      :v-model="currentPage"
      :number-of-pages="numberOfPages"
      :link-gen="generateLinks"
      use-router
    />
  </div>
</template>

<script>
  export default {
    name: 'PaginationNav',
    props: {
      count: Number,
      limit: Number,
      page: Number,
      loading: Boolean,
    },
    computed: {
      numberOfPages() {
        if (this.propsReady) {
          return this.count / this.limit;
        }
      },
      propsReady() {
        return this.count > 0 && this.limit && this.page;
      },
      currentPage() {
        return this.page;
      },
    },
    methods: {
      generateLinks(page) {
        const { limit } = this;
        const { name } = this.$route;
        const pageNotDefault =
          this.$constants.INITIAL_CURRENT_PAGE !== page ? page : undefined;
        const limitNotDefault =
          this.$constants.PER_PAGE !== limit &&
          this.$constants.PER_PAGE_SNAPSHOTS !== limit
            ? limit
            : undefined;

        return {
          name,
          params: { page: pageNotDefault },
          query: { limit: limitNotDefault },
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .pagination-nav {
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
  .pagination-nav--loading .page-item.active {
    pointer-events: none;
    user-select: none;
    background-color: #e0efec;
  }
</style>
