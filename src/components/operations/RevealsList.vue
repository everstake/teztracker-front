<template>
  <div class="list reveals-list">
    <div v-if="loading && items.length === 0" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="3"
        :columns="4"
        :table-props="{ borderless: true, responsive: true }"
        animation="none"
        class="table-skeleton"
      />
    </div>
    <b-table
      v-else
      responsive
      show-empty
      :items="items"
      :fields="fields"
      borderless
      class="transactions-table"
      :empty-text="$t('common.noData')"
    >
      <template #cell(from)="row">
        <span class="d-flex align-items-center">
          <IdentIcon :seed="row.item.source" />

          <b-link
            :to="{
              name: 'account',
              params: { account: row.item.source },
            }"
          >
            <template v-if="row.item.sourceName">
              {{ row.item.sourceName }}
            </template>
            <template v-else>
              {{ row.item.source | longhash }}
            </template>
          </b-link>

          <BtnCopy
            v-if="!row.item.sourceName"
            :text-to-copy="row.item.source"
          />
        </span>
      </template>
      <template #cell(fee)="row">
        {{ row.item.fee | denominate }}
      </template>
      <template #cell(gas)="row">
        {{ row.item.gasLimit | formatInteger }}
      </template>
      <template #cell(storage)="row">
        <span v-if="row.item.storageLimit">
          {{ row.item.storageLimit }}
        </span>

        <NoDataTableCell v-else />
      </template>
    </b-table>
  </div>
</template>

<script>
  import IdentIcon from '@/components/accounts/IdentIcon';
  import BtnCopy from '@/components/partials/BtnCopy';
  import NoDataTableCell from '@/components/partials/NoDataTableCell';

  export default {
    name: 'RevealsList',
    components: {
      IdentIcon,
      BtnCopy,
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
    computed: {
      fields() {
        return [
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
        ];
      },
    },
  };
</script>

<style lang="scss" scoped></style>
