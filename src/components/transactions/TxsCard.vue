<template>
  <b-card no-body>
    <CardHeader>
      <template v-slot:left-content class="text">
        <h4 class="tz-title--bold">Transaction list</h4>
<!--        <Dropdown dropdownTitle="This year" />-->
      </template>
      <template v-slot:right-content class="text">
        <Counter show-line :count="count" />
        <div class="counter">
          <div class="tz_link">
            <router-link class="tz-dropdown-item" :to="{ name: 'txs' }"
              >View all</router-link
            >
          </div>
        </div>
      </template>
    </CardHeader>

    <b-card-body>
      <TxsList :show-per-page-filter="showPerPageFilter" :is-table-complete="false" />
    </b-card-body>
  </b-card>
</template>
<script>
import { mapState } from "vuex";
import CardHeader from "../partials/CardHeader";
// import Dropdown from "../partials/Dropdown";
import Counter from "../partials/Counter";
import TxsList from "@/components/transactions/TxsList";

export default {
  name: "TxsCard",
  components: {
    CardHeader,
    // Dropdown,
    Counter,
    TxsList
  },
  props: ['showPerPageFilter'],
  computed: {
    ...mapState('operations', {
      count: state => state.counts.txs
    })
  }
};
</script>

<style lang="scss" scoped>

.line {
  display: block;
  float: left;
  width: 30px;
  height: 16px;
  margin-right: 0.5rem;
  border-bottom: 1px solid $color-grey;
  opacity: 0.5;
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 {
    line-height: 1;
  }
}
</style>
