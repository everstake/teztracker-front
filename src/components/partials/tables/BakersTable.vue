<template>
  <b-table
    responsive
    show-empty
    :items="bakersFormatted"
    :fields="fields"
    :current-page="page"
    :per-page="0"
    borderless
    class="transactions-table"
    :empty-text="$t('common.noData')"
  >
    <template slot="id" slot-scope="row">
      <span>{{ row.index + 1 }}</span>
    </template>
    <template slot="accountId" slot-scope="row">
      <span class="d-flex align-items-center">
        <IdentIcon :seed="row.item.accountId" />

        <b-link :to="{ name: 'baker', params: { baker: row.item.accountId } }">
          <template v-if="row.item.name">
            {{ row.item.name }}
          </template>
          <template v-else>
            {{ row.item.accountId | longhash }}
          </template>
        </b-link>

        <BtnCopy v-if="!row.item.name" :text-to-copy="row.item.accountId" />
      </span>
    </template>
    <template slot="blocks" slot-scope="row">
      {{ row.item.blocks | formatInteger }}
    </template>
    <template slot="endorsements" slot-scope="row">
      {{ row.item.endorsements | formatInteger }}
    </template>
    <template slot="stakingBalance" slot-scope="row">
      {{ row.item.stakingBalance | denominate }}
    </template>
    <template slot="rolls" slot-scope="row">
      {{ row.item.rolls | formatInteger }}
    </template>
    <template slot="bakingSince" slot-scope="row">
      {{ row.item.bakingSince | timeformat(dateFormat) }}
    </template>
  </b-table>
</template>

<script>
  import { mapState } from 'vuex';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';

  export default {
    name: 'BakersTable',
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
            {
              key: 'id',
              label: '#',
              tdClass: 'ordinal-number',
              thClass: 'ordinal-number',
            },
            {
              key: 'accountId',
              label: this.$tc('common.baker', 1),
              disableClear: true,
            },
            {
              key: 'blocks',
              label: this.$tc('common.block', 2),
              sortable: true,
              sortDirection: 'desc',
            },
            {
              key: 'endorsements',
              label: this.$tc('opTypes.endorsement', 2),
              sortable: true,
              sortDirection: 'desc',
            },
            {
              key: 'stakingBalance',
              label: this.$t('common.stakingBal'),
              sortable: true,
              sortDirection: 'desc',
            },
            {
              key: 'rolls',
              label: this.$t('common.rolls'),
              sortable: true,
              sortDirection: 'desc',
            },
            {
              key: 'bakingSince',
              label: this.$t('common.bakingSince'),
              disableClear: true,
            },
          ];
        }
      },
      bakersFormatted() {
        if (!this.items || this.items.length === 0) return [];
        return this.items.map((bakerObj) => {
          return { accountId: bakerObj.accountId, ...bakerObj.bakerInfo };
        });
      },
    },
  };
</script>
