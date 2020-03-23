<template>
  <b-card no-body>
    <CardHeader>
      <template v-slot:left-content class="text">
        <h4 class="tz-title--bold">Blocks list</h4>
        <!--        <Dropdown dropdownTitle="This year" />-->
      </template>
      <template v-slot:right-content class="text">
        <Counter show-line :count="count" />
        <div class="counter">
          <div class="tz_link">
            <router-link class="tz-dropdown-item" :to="{ name: 'blocks' }">
              View all
            </router-link>
          </div>
        </div>
      </template>
    </CardHeader>

    <b-card-body>
      <BlocksList :show-per-page-filter="showPerPageFilter" :is-table-complete="false" />
    </b-card-body>
  </b-card>
</template>

<script>
import { mapState } from "vuex";
import CardHeader from "../partials/CardHeader";
// import Dropdown from "../partials/Dropdown";
import Counter from "../partials/Counter";
import BlocksList from "@/components/blocks/BlocksList";

export default {
  name: "BlocksCard",
  components: {
    CardHeader,
    // Dropdown,
    Counter,
    BlocksList
  },
  props: ['showPerPageFilter'],
  computed: {
    ...mapState("blocks", {
      count: state => state.counts.blocks
    })
  }
};
</script>
