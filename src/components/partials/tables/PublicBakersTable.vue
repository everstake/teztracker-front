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
    <template #cell(favorite)="row">
      <font-awesome-icon
          @click="toggleFavorite(row.item.accountId, row.item.name)"
          class="icon-favorite"
          :class="{
          'icon-favorite--active': isAccountFavorite(row.item.accountId),
        }"
          :icon="['fa', 'star']"
      />
    </template>
    <template #cell(id)="row">
      <span>{{ row.index + 1 }}</span>
    </template>
    <template #cell(accountId)="row">
      <span>
        <IdentIcon :seed="row.item.accountId" />

        <b-link :to="{ name: 'baker', params: { baker: row.item.accountId } }">
          <template v-if="row.item.name">
            {{ row.item.name }}
          </template>
          <template v-else>
            {{ row.item.accountId | longhash }}
          </template>
        </b-link>
      </span>
    </template>
    <template #cell(stakingCapacity)="row">
      {{
        ((row.item.stakingCapacity - row.item.stakingBalance) / $constants.XTZ)
          | denominate
      }}
    </template>
    <template #cell(fee)="row"> {{ row.item.fee }} % </template>
    <template #cell(stakingBalance)="row">
      {{ row.item.stakingBalance | denominate }}
    </template>
    <template #cell(rolls)="row">
      {{ row.item.rolls | formatInteger }}
    </template>
    <template #cell(blocks)="row">
      {{ row.item.blocks | formatInteger }}
    </template>
    <template #cell(endorsements)="row">
      {{ row.item.endorsements | formatInteger }}
    </template>
    <template #cell(activeDelegators)="row">
      {{ row.item.activeDelegators | formatInteger }}
    </template>
    <template #cell(bakingSince)="row">
      {{ row.item.bakingSince | timeformat(dateFormat) }}
    </template>
  </b-table>
</template>

<script>
  import { mapState } from 'vuex';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import favoriteAccount from '@/mixins/favoriteAccount';

  export default {
    name: 'PublicBakersTable',
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
      IdentIcon,
    },
    mixins: [favoriteAccount],
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
              key: 'favorite',
              label: 'Fav',
              sortDirection: 'asc',
              thClass: 'favorite-heading',
            },
            {
              key: 'id',
              label: '#',
              tdClass: 'ordinal-number',
              thClass: 'ordinal-number',
            },
            { key: 'accountId', label: this.$tc('common.baker', 1) },
            {
              key: 'stakingCapacity',
              label: this.$t('common.capacityAvailable'),
              sortable: true,
              sortDirection: 'desc',
            },
            {
              key: 'fee',
              label: this.$t('common.fee'),
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
              key: 'activeDelegators',
              label: this.$t('numberOf.#OfDelegators'),
            },
            { key: 'bakingSince', label: this.$t('common.bakingSince') },
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
