<template>
  <b-table
    responsive
    show-empty
    :items="items"
    :fields="fields"
    :current-page="page"
    :per-page="0"
    borderless
    class="transactions-table"
    :empty-text="$t('common.noData')"
  >
    <template slot="level" slot-scope="row">
      <b-link :to="{ name: 'block', params: { level: row.item.level } }">
        {{ row.item.level | formatInteger }}
      </b-link>
    </template>
    <template slot="timestamp" slot-scope="row">
      {{ row.item.timestamp | timeformat(dateFormat) }}
    </template>
    <template slot="baker" slot-scope="row">
      <span class="d-flex align-items-center">
        <IdentIcon :seed="row.item.baker" />

        <b-link :to="{ name: 'baker', params: { baker: row.item.baker } }">
          <template v-if="row.item.bakerName">
            {{ row.item.bakerName }}
          </template>
          <template v-else>
            {{ row.item.baker | longhash }}
          </template>
        </b-link>

        <BtnCopy v-if="!row.item.bakerName" :text-to-copy="row.item.baker" />
      </span>
    </template>
    <template slot="number_of_operations" slot-scope="row">
      {{ row.item.number_of_operations | formatInteger }}
    </template>
    <template slot="volume" slot-scope="row">
      {{ row.item.volume | denominate }}
    </template>
    <template slot="fees" slot-scope="row">
      {{ row.item.fees | denominate }}
    </template>
    <template slot="endorsements" slot-scope="row">
      {{ row.item.endorsements | formatInteger }}
    </template>
  </b-table>
</template>

<script>
  import { mapState } from 'vuex';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';

  export default {
    name: 'BlocksTable',
    props: {
      items: Array,
      page: Number,
      limit: Number,
      propsFields: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    components: {
      BtnCopy,
      IdentIcon,
    },
    computed: {
      ...mapState({
        dateFormat: (state) => state.app.dateFormat,
      }),
      fields() {
        const propsFields = this.propsFields.length > 0;
        if (!this.$i18n.locale) return [];
        if (propsFields) {
          return this.propsFields;
        } else {
          return [
            { key: 'level', label: this.$t('common.blockId') },
            { key: 'timestamp', label: this.$t('common.timestamp') },
            { key: 'baker', label: this.$tc('common.baker', 1) },
            {
              key: 'priority',
              label: this.$t('common.priority'),
            },
            {
              key: 'number_of_operations',
              label: this.$t('numberOf.#OfOperations'),
            },
            {
              key: 'volume',
              label: this.$t('blocksList.volume'),
            },
            {
              key: 'fees',
              label: this.$t('common.fee'),
            },
            {
              key: 'endorsements',
              label: this.$t('numberOf.#OfEndorsements'),
            },
          ];
        }
      },
    },
  };
</script>
