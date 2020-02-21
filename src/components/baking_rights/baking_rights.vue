<template>
  <div>
    <b-table
      show-empty
      fixed
      stacked="md"
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      class="table table-borderless"
    >
      <template slot="priority" slot-scope="row">
        <span>{{ row.item.priority }}</span>
      </template>

      <template slot="block_0" slot-scope="row">
        <router-link
          :class="{ winner: row.item.block_0.winner }"
          :to="{ name: 'baker', params: {baker: row.item.block_0.delegate}}"
        >{{row.item.block_0.delegate | longhash(19)}}</router-link>
      </template>
      <template slot="block_1" slot-scope="row">
        <router-link
          :class="{ winner: row.item.block_1.winner }"
          :to="{ name: 'baker', params: {baker: row.item.block_1.delegate}}"
        >{{row.item.block_1.delegate | longhash(19)}}</router-link>
      </template>
      <template slot="block_2" slot-scope="row">
        <router-link
          :class="{ winner: row.item.block_2.winner }"
          :to="{ name: 'baker', params: {baker: row.item.block_2.delegate}}"
        >{{row.item.block_2.delegate | longhash(19)}}</router-link>
      </template>
      <template slot="block_3" slot-scope="row">
        <router-link
          :class="{ winner: row.item.block_3.winner }"
          :to="{ name: 'baker', params: {baker: row.item.block_3.delegate}}"
        >{{row.item.block_3.delegate | longhash(19)}}</router-link>
      </template>
      <template slot="block_4" slot-scope="row">
        <router-link
          :class="{ winner: row.item.block_4.winner }"
          :to="{ name: 'baker', params: {baker: row.item.block_4.delegate}}"
        >{{row.item.block_4.delegate | longhash(19)}}</router-link>
      </template>
      <template slot="block_5" slot-scope="row">
        <router-link
          :class="{ winner: row.item.block_5.winner }"
          :to="{ name: 'baker', params: {baker: row.item.block_5.delegate}}"
        >{{row.item.block_5.delegate | longhash(19)}}</router-link>
      </template>
      <template slot="block_6" slot-scope="row">
        <router-link
          :class="{ winner: row.item.block_6.winner }"
          :to="{ name: 'baker', params: {baker: row.item.block_6.delegate}}"
        >{{row.item.block_6.delegate | longhash(19)}}</router-link>
      </template>
    </b-table>

    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      align="right"
      limit="10"
      prev-text="Prev"
      next-text="Next"
      first-number
      last-number
    ></b-pagination>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { SET_BAKING_RIGHTS_COUNT } from "@/store/mutations.types";
import _ from "lodash";
export default {
  name: "BakingRights",
  props: [],
  data() {
    return {
      baking_rights: [],
      blocks_in_row: this.$constants.BLOCKS_IN_ROW,
      block_levels: [],
      blocks: [],
      perPage: this.$constants.PER_PAGE,
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      fields: [
        {
          key: "priority",
          label: "Priority"
        }
      ]
    };
  },
  computed: {
    ...mapState('blocks', {
      count: state => state.counts
    }),
    rows() {
      return this.count.baking_rights;
    },
    items() {
      return this.baking_rights;
    }
  },
  watch: {
    currentPage: {
      async handler(value) {
        await this.reload(value);
      }
    }
  },
  async created() {
    await this.reload();
  },
  methods: {
    ...mapMutations('blocks', [SET_BAKING_RIGHTS_COUNT]),
    parseResponse(data) {
      const blocks = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].rights.length; j++) {
          const isActualBaker =
            data[i].rights[j].delegate === data[i].baker &&
            data[i].rights[j].priority === data[i].baker_priority;

          blocks.push({
            level: data[i].level,
            baker: data[i].baker,
            block_hash: data[i].block_hash,
            priority: data[i].rights[j].priority,
            delegate: data[i].rights[j].delegate,
            winner: isActualBaker
          });
        }
      }
      const levels = _.uniq(blocks.map(el => el.level))
        .sort()
        .reverse();
      const rowLength = this.blocks_in_row;
      const fields = [
        {
          key: "priority",
          label: "Priority"
        }
      ];
      const result = [];
      for (let j = 0; j < 11; j++) {
        const row = {
          priority: j
        };
        for (let i = 0; i < rowLength; i++) {
          if (!levels[i]) {
            fields.push({
              key: `block_${i}`,
              label: ""
            });
            row[`block_${i}`] = {};
            continue;
          }
          fields.push({
            key: `block_${i}`,
            label: `Block ${levels[i]}`
          });
          const blockId = levels[i];
          const block = blocks.find(
            el => el.level === blockId && el.priority === j
          );
          row[`block_${i}`] = {};
          if (block) {
            row[`block_${i}`] = { ...block };
          }
        }
        result.push(row);
      }
      this.fields = fields;
      this.baking_rights = result;
    },
    async reload(page = 1) {
      const props = {
        page,
        limit: this.blocks_in_row
      };
      const data = await this.$api.getBakingRights(props);
      await this[SET_BAKING_RIGHTS_COUNT](data.count);
      this.parseResponse(data.data);
    }
  }
};
</script>

<style scoped>
.winner {
  background-color: aquamarine;
}
</style>
