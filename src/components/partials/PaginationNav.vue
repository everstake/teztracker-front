<template>
  <div class="pagination-nav">
    <b-pagination-nav
      :limit="3"
      :value="page"
      :number-of-pages="numberOfPages"
      :link-gen="generateLinks"
      use-router
      :class="{
        'page--loading': loading,
      }"
      @change="onChange"
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
          return Math.ceil(this.count / this.limit);
        }
      },
      propsReady() {
        return this.count > 0 && this.limit && this.page;
      },
    },
    methods: {
      onChange(page) {
        this.$emit('onPageChange', page);
      },
      generateLinks(page) {
        const { limit } = this;
        const { name } = this.$route;
        const pageNotDefault = this.$constants.INITIAL_CURRENT_PAGE !== page ? page : undefined;
        const limitNotDefault = this.$constants.PER_PAGE !== limit && this.$constants.PER_PAGE_SNAPSHOTS !== limit ? limit : undefined;

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
