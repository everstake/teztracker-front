<template>
  <div
    class="pagination-nav"
    :class="{
      'pagination-nav--loading': loading,
    }"
  >
    <b-pagination-nav
      :value="page"
      :limit="3"
      :number-of-pages="numberOfPages"
      :link-gen="generateLinks"
      use-router
      no-page-detect
      hide-goto-end-buttons
      @page-click.prevent="() => {}"
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
        const propsNotReady = !this.propsReady;

        if (propsNotReady) {
          return this.page;
        }

        return this.count / this.limit;
      },
      propsReady() {
        return this.count > 0 && this.limit && this.page;
      },
    },
    methods: {
      generateLinks(page) {
        const {
          limit,
          $route: { name },
          $constants: { PER_PAGE, PER_PAGE_SNAPSHOTS },
        } = this;

        const limitDefault =
          limit === PER_PAGE ||
          limit === PER_PAGE_SNAPSHOTS;

        return {
          name,
          params: {
            page,
          },
          query: {
            limit: limitDefault ? undefined : limit,
          },
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
