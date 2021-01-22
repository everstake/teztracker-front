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
    <template #cell(accountId)="row">
      <span class="d-flex align-items-center">
        <IdentIcon :seed="row.item.accountId" />

        <router-link
          :to="{ name: 'account', params: { account: row.item.accountId } }"
        >
          <span>{{ row.item.accountId | longhash }}</span>
        </router-link>

        <BtnCopy :text-to-copy="row.item.accountId" />
      </span>
    </template>
    <template #cell(manager)="row">
      <b-link
        v-if="row.item.manager"
        :to="{ name: 'account', params: { account: row.item.accountId } }"
      >
        <span>{{ row.item.manager | longhash }}</span>
      </b-link>

      <NoDataTableCell v-else />
    </template>
    <template #cell(delegateValue)="row">
      <span v-if="row.item.delegateValue" class="d-flex align-items-center">
        <IdentIcon :seed="row.item.delegateValue" />

        <b-link
          :to="{
            name: 'account',
            params: { account: row.item.delegateValue },
          }"
        >
          <template v-if="row.item.delegateName">
            {{ row.item.delegateName }}
          </template>
          <template v-else>
            {{ row.item.delegateValue | longhash }}
          </template>
        </b-link>

        <BtnCopy
          v-if="!row.item.delegateName"
          :text-to-copy="row.item.delegateValue"
        />
      </span>

      <NoDataTableCell v-else />
    </template>
    <template #cell(balance)="row">
      <span>{{ row.item.balance | denominate }}</span>
    </template>
    <template #cell(createdAt)="row">
      <span>{{ row.item.createdAt | timeformat(dateFormat) }}</span>
    </template>
  </b-table>
</template>

<script>
  import { mapState } from 'vuex';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import NoDataTableCell from '@/components/partials/NoDataTableCell';
  import favoriteAccount from '@/mixins/favoriteAccount';

  export default {
    name: 'ContractsTable',
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
      NoDataTableCell,
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
            { key: 'accountId', label: this.$tc('common.contract', 1) },
            { key: 'manager', label: this.$t('common.manager') },
            { key: 'delegateValue', label: this.$t('common.delegate') },
            {
              key: 'balance',
              label: this.$t('common.balance'),
              sortable: true,
              sortDirection: 'desc',
            },
            { key: 'createdAt', label: this.$t('accSingle.created') },
          ];
        }
      },
    },
  };
</script>
