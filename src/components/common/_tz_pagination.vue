<template>
  <div class="pagination-block">
    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      :align="align"
      :first-text="firstText"
      :prev-text="prevText"
      :next-text="nextText"
      :last-text="lastText"
    ></b-pagination>
  </div>
</template>


<script>
import { ACTIONS } from "../../store";

export default {
  name: "Pagination",
  data() {
    return {
      currentPage: 1,
      perPage: 10
    };
  },
  watch: {
    currentPage: {
      async handler(value) {
        await this.$store.dispatch(ACTIONS[this.action], {
          page: value,
          perPage: this.perPage
        });
      }
    }
  },
  async created() {
    await this.$store.dispatch(ACTIONS[this.action], {
      page: this.currentPage,
      perPage: this.perPage
    });
  },
  props: [
    "totalRows",
    "align",
    "firstText",
    "prevText",
    "nextText",
    "lastText",
    "action"
  ]
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
