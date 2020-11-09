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
    <template slot="accountId" slot-scope="row">
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
      </span>
    </template>
    <template slot="balance" slot-scope="row">
      <span>{{ row.item.balance | denominate }}</span>
    </template>
    <template slot="is_baker" slot-scope="row">
      <span>{{
        row.item.is_baker
          ? 'baker'
          : row.item.accountId.slice(0, 2) === 'KT'
          ? 'contract'
          : 'account'
      }}</span>
    </template>
    <template slot="createdAt" slot-scope="row">
      <span>{{ row.item.createdAt | timeformat(dateFormat) }}</span>
    </template>
    <template slot="delegateValue" slot-scope="row">
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
  import { mapState } from 'vuex';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import NoDataTableCell from '@/components/partials/NoDataTableCell';

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
      BtnCopy,
      IdentIcon,
      NoDataTableCell,
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
    },
  };
</script>
