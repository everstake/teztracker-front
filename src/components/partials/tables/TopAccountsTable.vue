<template>
  <b-table
    ref="top-accounts-table"
    responsive
    show-empty
    :items="topAccountsItems"
    :fields="fields"
    :current-page="page"
    :per-page="0"
    borderless
    class="transactions-table"
    :empty-text="$t('common.noData')"
  >
    <template #cell(favorite)="row">
      <font-awesome-icon
        @click="toggleFavorite(row.item.accountId, row.item.accountName, row.item.is_baker ? 'baker' : 'account')"
        class="icon-favorite"
        :class="{
          'icon-favorite--active': isAccountFavorite({ accountId: row.item.accountId }),
        }"
        :icon="['fa', 'star']"
      />
    </template>
    <template #cell(accountId)="row">
      <span v-if="row.item.is_baker" class="d-flex align-items-center">
        <IdentIcon :seed="row.item.accountId" />

        <b-link :to="{ name: 'baker', params: { baker: row.item.accountId } }">
          <template v-if="row.item.accountName">
            {{ row.item.accountName }}
          </template>
          <template v-else>
            {{ row.item.accountId | longhash }}
          </template>
        </b-link>

        <BtnCopy
          v-if="!row.item.accountName"
          :text-to-copy="row.item.accountId"
        />
        <BtnNote
          :index="row.item.index"
          :account-name="row.item.accountName"
          :account-id="row.item.accountId"
        />
      </span>
      <span
        v-else-if="row.item.accountId.slice(0, 2) === 'KT'"
        class="d-flex align-items-center"
      >
        <IdentIcon :seed="row.item.accountId" />

        <b-link
          :to="{ name: 'account', params: { account: row.item.accountId } }"
        >
          <template v-if="row.item.accountName">
            {{ row.item.accountName }}
          </template>
          <template v-else>
            {{ row.item.accountId | longhash }}
          </template>
        </b-link>

        <BtnCopy
          v-if="!row.item.accountName"
          :text-to-copy="row.item.accountId"
        />
        <BtnNote
          :index="row.item.index"
          :account-name="row.item.accountName"
          :account-id="row.item.accountId"
        />
      </span>
      <span v-else class="d-flex align-items-center">
        <IdentIcon :seed="row.item.accountId" />

        <b-link
          :to="{ name: 'account', params: { account: row.item.accountId } }"
        >
          <template v-if="row.item.accountName">
            {{ row.item.accountName }}
          </template>
          <template v-else>
            {{ row.item.accountId | longhash }}
          </template>
        </b-link>

        <BtnCopy
          v-if="!row.item.accountName"
          :text-to-copy="row.item.accountId"
        />
        <BtnNote
          :index="row.item.index"
          :account-name="row.item.accountName"
          :account-id="row.item.accountId"
        />
      </span>
    </template>
    <template #cell(balance)="row">
      <span>{{ row.item.balance | denominate }}</span>
    </template>
    <template #cell(is_baker)="row">
      <span>{{
        row.item.is_baker
          ? 'baker'
          : row.item.accountId.slice(0, 2) === 'KT'
          ? 'contract'
          : 'account'
      }}</span>
    </template>
    <template #cell(createdAt)="row">
      <span>{{ row.item.createdAt | timeformat(dateFormat) }}</span>
    </template>
    <template #cell(delegateValue)="row">
      <span v-if="row.item.delegateValue" class="d-flex align-items-center">
        <IdentIcon :seed="row.item.delegateValue" />

        <b-link
          :to="{ name: 'baker', params: { baker: row.item.delegateValue } }"
        >
          <span>
            <template v-if="row.item.delegateName">
              {{ row.item.delegateName }}
            </template>
            <template v-else>
              {{ row.item.delegateValue | longhash }}
            </template>
          </span>
        </b-link>

        <BtnCopy
          v-if="!row.item.delegateName"
          :text-to-copy="row.item.delegateValue"
        />
      </span>

      <NoDataTableCell v-else />
    </template>
  </b-table>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import NoDataTableCell from '@/components/partials/NoDataTableCell';
  import favoriteAccount from '@/mixins/favoriteAccount';
  import BtnNote from '@/components/partials/BtnNote';
  import { GET_USER_NOTES } from '@/store/actions.types';

  export default {
    name: 'TopAccountsTable',
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
      BtnNote,
      BtnCopy,
      IdentIcon,
      NoDataTableCell,
    },
    mixins: [favoriteAccount],
    methods: {
      ...mapActions('user', [GET_USER_NOTES]),
    },
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
            { key: 'accountId', label: this.$tc('common.acc', 1) },
            {
              key: 'balance',
              label: this.$t('common.balance'),
              sortable: true,
              sortDirection: 'desc',
            },
            { key: 'is_baker', label: this.$t('common.type') },
            { key: 'delegateValue', label: this.$t('common.delegate') },
            { key: 'createdAt', label: this.$t('accSingle.created') },
          ];
        }
      },
      topAccountsItems() {
        return this.items.map((item, index) => {
          return { ...item, index };
        });
      },
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
