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
          @click="toggleFavorite(row.item.accountId, row.item.name, 'baker')"
          class="icon-favorite"
          :class="{
          'icon-favorite--active': isAccountFavorite({ accountId: row.item.accountId }),
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
        <BtnNote
            :index="row.item.index"
            :account-name="row.item.name"
            :account-id="row.item.accountId"
        />
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
import {mapActions, mapState} from 'vuex';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import favoriteAccount from '@/mixins/favoriteAccount';
  import BtnNote from "@/components/partials/BtnNote";
import {GET_USER_NOTES} from "@/store/actions.types";

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
      BtnNote,
    },
    mixins: [favoriteAccount],
    computed: {
      ...mapState({
        dateFormat: (state) => state.app.dateFormat,
      }),
      ...mapState('user', ['beaconAccount', 'notes']),
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
        return this.items.map((bakerObj, index) => {
          return { accountId: bakerObj.accountId, ...bakerObj.bakerInfo, index };
        });
      },
    },
    methods: {
      ...mapActions('user', [GET_USER_NOTES]),
    },
    watch: {
      beaconAccount: {
        immediate: true,
        deep: true,
        async handler({ address }) {
          if (address) {
            await this[GET_USER_NOTES]({
              address: this.beaconAccount.address,
            });
          }
        },
      },
    },
  };
</script>
