<template>
  <div>
    <b-table
      responsive
      show-empty
      :items="baking_rights"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table"
      :empty-text="$t('common.noData')"
    >
      <template slot="priority" slot-scope="row">
        <span>{{ row.item.priority }}</span>
      </template>

      <template slot="block_0" slot-scope="row">
        <span class="d-flex align-items-center">
          <IdentIcon :seed="row.item.block_0.delegate" />

          <router-link
            :class="{ winner: row.item.block_0.winner }"
            :to="{
              name: 'baker',
              params: { baker: row.item.block_0.delegate },
            }"
          >
            <template v-if="row.item.block_0.delegate_name">
              {{ row.item.block_0.delegate_name }}
            </template>
            <template v-else>
              {{ row.item.block_0.delegate | longhash }}
            </template>
          </router-link>

          <BtnCopy
            v-if="!row.item.block_0.delegate_name"
            :text-to-copy="row.item.block_0.delegate"
          />
        </span>
      </template>
      <template slot="block_1" slot-scope="row">
        <span class="d-flex align-items-center">
          <IdentIcon :seed="row.item.block_1.delegate" />

          <router-link
            :class="{ winner: row.item.block_1.winner }"
            :to="{
              name: 'baker',
              params: { baker: row.item.block_1.delegate },
            }"
          >
            <template v-if="row.item.block_1.delegate_name">
              {{ row.item.block_1.delegate_name }}
            </template>
            <template v-else>
              {{ row.item.block_1.delegate | longhash }}
            </template>
          </router-link>

          <BtnCopy
            v-if="!row.item.block_1.delegate_name"
            :text-to-copy="row.item.block_1.delegate"
          />
        </span>
      </template>
      <template slot="block_2" slot-scope="row">
        <span class="d-flex align-items-center">
          <IdentIcon :seed="row.item.block_2.delegate" />

          <router-link
            :class="{ winner: row.item.block_2.winner }"
            :to="{
              name: 'baker',
              params: { baker: row.item.block_2.delegate },
            }"
          >
            <template v-if="row.item.block_2.delegate_name">
              {{ row.item.block_2.delegate_name }}
            </template>
            <template v-else>
              {{ row.item.block_2.delegate | longhash }}
            </template>
          </router-link>

          <BtnCopy
            v-if="!row.item.block_2.delegate_name"
            :text-to-copy="row.item.block_2.delegate"
          />
        </span>
      </template>
      <template slot="block_3" slot-scope="row">
        <span class="d-flex align-items-center">
          <IdentIcon :seed="row.item.block_3.delegate" />

          <router-link
            :class="{ winner: row.item.block_3.winner }"
            :to="{
              name: 'baker',
              params: { baker: row.item.block_3.delegate },
            }"
          >
            <template v-if="row.item.block_3.delegate_name">
              {{ row.item.block_3.delegate_name }}
            </template>
            <template v-else>
              {{ row.item.block_3.delegate | longhash }}
            </template>
          </router-link>

          <BtnCopy
            v-if="!row.item.block_3.delegate_name"
            :text-to-copy="row.item.block_3.delegate"
          />
        </span>
      </template>
      <template slot="block_4" slot-scope="row">
        <span class="d-flex align-items-center">
          <IdentIcon :seed="row.item.block_4.delegate" />

          <router-link
            :class="{ winner: row.item.block_4.winner }"
            :to="{
              name: 'baker',
              params: { baker: row.item.block_4.delegate },
            }"
          >
            <template v-if="row.item.block_4.delegate_name">
              {{ row.item.block_4.delegate_name }}
            </template>
            <template v-else>
              {{ row.item.block_4.delegate | longhash }}
            </template>
          </router-link>

          <BtnCopy
            v-if="!row.item.block_4.delegate_name"
            :text-to-copy="row.item.block_4.delegate"
          />
        </span>
      </template>
      <template slot="block_5" slot-scope="row">
        <span class="d-flex align-items-center">
          <IdentIcon :seed="row.item.block_5.delegate" />

          <router-link
            :class="{ winner: row.item.block_5.winner }"
            :to="{
              name: 'baker',
              params: { baker: row.item.block_5.delegate },
            }"
          >
            <template v-if="row.item.block_5.delegate_name">
              {{ row.item.block_5.delegate_name }}
            </template>
            <template v-else>
              {{ row.item.block_5.delegate | longhash }}
            </template>
          </router-link>

          <BtnCopy
            v-if="!row.item.block_5.delegate_name"
            :text-to-copy="row.item.block_5.delegate"
          />
        </span>
      </template>
      <template slot="block_6" slot-scope="row">
        <span class="d-flex align-items-center">
          <IdentIcon :seed="row.item.block_6.delegate" />

          <router-link
            :class="{ winner: row.item.block_6.winner }"
            :to="{
              name: 'baker',
              params: { baker: row.item.block_6.delegate },
            }"
          >
            <template v-if="row.item.block_6.delegate_name">
              {{ row.item.block_6.delegate_name }}
            </template>
            <template v-else>
              {{ row.item.block_6.delegate | longhash }}
            </template>
          </router-link>

          <BtnCopy
            v-if="!row.item.block_6.delegate_name"
            :text-to-copy="row.item.block_6.delegate"
          />
        </span>
      </template>
    </b-table>

    <div class="pagination-block">
      <Pagination
        @change="$_handleCurrentPageChange"
        :total-rows="count.baking_rights"
        :per-page="perPage"
        limit="10"
      />
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { SET_BAKING_RIGHTS_COUNT } from '@/store/mutations.types';
  import uniq from 'lodash/uniq';
  import Pagination from '../partials/Pagination';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import handleCurrentPageChange from '@/mixins/handleCurrentPageChange';
  import numeral from 'numeral';

  export default {
    name: 'BakingRightsList',
    components: {
      Pagination,
      BtnCopy,
      IdentIcon,
    },
    mixins: [handleCurrentPageChange],
    data() {
      return {
        perPage: this.$constants.PER_PAGE,
        baking_rights: [],
        // blocks: [],
        // block_levels: [],
        blocks_in_row: this.$constants.BLOCKS_IN_ROW,
        newFields: [],
      };
    },
    computed: {
      ...mapState('blocks', {
        count: (state) => state.counts,
      }),
      fields() {
        if (!this.$i18n.locale) return [];
        const fieldsUpdated = this.newFields.length > 0;
        if (fieldsUpdated) {
          return this.newFields.map((field, index) => {
            let label;

            if (index === 0) {
              label = `${this.$t('common.priority')}`;
            } else {
              label = `${this.$tc('common.block', 1)} ${field.label}`;
            }

            return { ...field, label };
          });
        } else {
          return [
            {
              key: 'priority',
              label: this.$t('common.priority'),
            },
          ];
        }
      },
    },
    watch: {
      currentPage: {
        async handler(value) {
          await this.reload(value);
        },
      },
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
              level: numeral(data[i].level).format('0,0'),
              baker: data[i].baker,
              block_hash: data[i].block_hash,
              priority: data[i].rights[j].priority,
              delegate: data[i].rights[j].delegate,
              delegate_name: data[i].rights[j].delegate_name,
              winner: isActualBaker,
            });
          }
        }
        const levels = uniq(blocks.map((el) => el.level))
          .sort()
          .reverse();
        const rowLength = this.blocks_in_row;
        const fields = [
          {
            key: 'priority',
            label: this.$t('common.priority'),
          },
        ];
        const result = [];
        for (let j = 0; j < 11; j++) {
          const row = {
            priority: j,
          };
          for (let i = 0; i < rowLength; i++) {
            if (!levels[i]) {
              fields.push({
                key: `block_${i}`,
                label: '',
              });
              row[`block_${i}`] = {};
              continue;
            }
            fields.push({
              key: `block_${i}`,
              label: levels[i],
            });
            const blockId = levels[i];
            const block = blocks.find(
              (el) => el.level === blockId && el.priority === j,
            );
            row[`block_${i}`] = {};
            if (block) {
              row[`block_${i}`] = { ...block };
            }
          }
          result.push(row);
        }
        this.newFields = fields;
        this.baking_rights = result;
      },
      async reload(page = 1) {
        const props = {
          page,
          limit: this.blocks_in_row,
        };
        const data = await this.$api.getBakingRights(props);
        await this[SET_BAKING_RIGHTS_COUNT](data.count);
        this.parseResponse(data.data);
      },
    },
  };
</script>
