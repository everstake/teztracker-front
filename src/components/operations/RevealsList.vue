<template>
  <div>
    <b-table
      responsive
      show-empty
      :items="items"
      :fields="fields"
      borderless
      class="transactions-table"
      :empty-text="$t('common.noData')"
    >
      <template slot="from" slot-scope="row">
        <b-link
          :to="{
            name: 'account',
            params: { account: row.item.source },
          }"
        >
          {{ row.item.sourceName || row.item.source | longhash }}
        </b-link>
      </template>
      <template slot="fee" slot-scope="row">
        {{ row.item.fee | tezos }}
      </template>
      <template slot="gas" slot-scope="row">
        {{ row.item.gasLimit | formatInteger }}
      </template>
      <template slot="storage" slot-scope="row">
        <span v-if="row.item.storageLimit">
          {{ row.item.storageLimit }}
        </span>

        <NoDataTableCell v-else />
      </template>
    </b-table>
  </div>
</template>

<script>
  import NoDataTableCell from '@/components/partials/NoDataTableCell';

  export default {
    name: 'RevealsList',
    components: {
      NoDataTableCell,
    },
    props: {
      items: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {
        fields: [
          { key: 'from', label: this.$t('common.from') },
          {
            key: 'publicKey',
            label: this.$t('revealsList.publicKey'),
            thClass: 'wide-col',
            tdClass: 'wide-col',
          },
          { key: 'fee', label: this.$t('common.fee') },
          { key: 'gas', label: this.$t('txPage.gasLimit') },
          { key: 'storage', label: this.$t('txPage.storageLimit') },
        ],
      };
    },
  };
</script>

<style lang="scss" scoped></style>
