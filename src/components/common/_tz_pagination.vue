<template>
  <div class="pagination-block">
    <b-pagination
      @change="_handleChange"
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      :align="align"
      :first-text="firstText"
      :prev-text="prevText"
      :next-text="nextText"
      :last-text="lastText"
    />
  </div>
</template>

<script>
export default {
  name: "TzPagination",
  props: {
    totalRows: {
      type: Number,
      default: 0
    },
    align: {
      type: String,
      default: "right"
    },
    firstText: {
      type: String,
      default: "right"
    },
    prevText: {
      type: String,
      default: "right"
    },
    nextText: {
      type: String,
      default: "right"
    },
    lastText: {
      type: String,
      default: "right"
    }
  },
  data() {
    return {
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      perPage: this.$constants.PER_PAGE
    };
  },
  methods: {
    _handleChange(page) {
      this.$emit("change", page);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/scss/common";

.pagination-block {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
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
