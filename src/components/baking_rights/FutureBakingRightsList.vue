<template>
  <div>
    <b-table
      show-empty
      :items="future_baking_rights"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table table-responsive-md"
    >
      <template slot="priority" slot-scope="row">
        <span>{{ row.item.priority }}</span>
      </template>

      <template slot="block_0" slot-scope="row">
        <router-link
          class="baker"
          :to="{ name: 'baker', params: { baker: row.item.block_0.delegate } }"
          >{{ row.item.block_0.delegate | longhash(19) }}</router-link
        >
      </template>
      <template slot="block_1" slot-scope="row">
        <router-link
          class="baker"
          :to="{ name: 'baker', params: { baker: row.item.block_1.delegate } }"
          >{{ row.item.block_1.delegate | longhash(19) }}</router-link
        >
      </template>
      <template slot="block_2" slot-scope="row">
        <router-link
          class="baker"
          :to="{ name: 'baker', params: { baker: row.item.block_2.delegate } }"
          >{{ row.item.block_2.delegate | longhash(19) }}</router-link
        >
      </template>
      <template slot="block_3" slot-scope="row">
        <router-link
          class="baker"
          :to="{ name: 'baker', params: { baker: row.item.block_3.delegate } }"
          >{{ row.item.block_3.delegate | longhash(19) }}</router-link
        >
      </template>
      <template slot="block_4" slot-scope="row">
        <router-link
          class="baker"
          :to="{ name: 'baker', params: { baker: row.item.block_4.delegate } }"
          >{{ row.item.block_4.delegate | longhash(19) }}</router-link
        >
      </template>
      <template slot="block_5" slot-scope="row">
        <router-link
          class="baker"
          :to="{ name: 'baker', params: { baker: row.item.block_5.delegate } }"
          >{{ row.item.block_5.delegate | longhash(19) }}</router-link
        >
      </template>
      <template slot="block_6" slot-scope="row">
        <router-link
          class="baker"
          :to="{ name: 'baker', params: { baker: row.item.block_6.delegate } }"
          >{{ row.item.block_6.delegate | longhash(19) }}</router-link
        >
      </template>
    </b-table>

    <Pagination
      @change="$_handleCurrentPageChange"
      v-model="currentPage"
      :total-rows="count.future_baking_rights"
      :per-page="perPage"
      limit="10"
    />
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { SET_FUTURE_BAKING_RIGHTS_COUNT } from "@/store/mutations.types";
import uniq from "lodash/uniq";
import Pagination from "../partials/Pagination";
import handleCurrentPageChange from "@/mixins/handleCurrentPageChange";

export default {
  name: "FutureBakingRightsList",
  components: {
    Pagination
  },
  mixins: [handleCurrentPageChange],
  props: ["block"],
  data() {
    return {
      perPage: this.$constants.PER_PAGE,
      blocks_in_row: this.$constants.BLOCKS_IN_ROW,
      future_baking_rights: [],
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
    })
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
    ...mapMutations('blocks', [SET_FUTURE_BAKING_RIGHTS_COUNT]),
    parseResponse(data) {
      const blocks = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].rights.length; j++) {
          blocks.push({
            level: data[i].level,
            baker: data[i].baker,
            block_hash: data[i].block_hash,
            priority: data[i].rights[j].priority,
            delegate: data[i].rights[j].delegate
          });
        }
      }
      const levels = uniq(blocks.map(el => el.level)).sort();
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
      this.future_baking_rights = result;
    },

    async reload(page = 1) {
      const props = {
        page,
        limit: this.blocks_in_row
      };
      const data = await this.$api.getFutureBakingRights(props);
      await this[SET_FUTURE_BAKING_RIGHTS_COUNT](data.count);
      this.parseResponse(data.data);
    }
  }
};
</script>
