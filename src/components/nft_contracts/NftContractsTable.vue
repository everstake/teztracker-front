<template>
  <b-table
    show-empty
    :items="items"
    :fields="fields"
    :current-page="page"
    :per-page="0"
    borderless
    class="transactions-table table-responsive-md"
  >
    <template #cell(number)="{ index }">
      {{ index + 1 + limit * (page - 1) }}
    </template>

    <template #cell(name)="{ item }">
      {{ item.name }}
    </template>

    <template #cell(address)="{ item }">
      <span class="d-flex align-items-center">
        <b-link
          :to="{
            name: 'nft_contract',
            params: { address: item.address },
          }"
        >
          {{ item.address | longhash }}
        </b-link>

        <BtnCopy :text-to-copy="item.address" />
      </span>
    </template>

    <template #cell(nfts_number)="{ item }">
      {{ item.nfts_number }}
    </template>

    <template #cell(operations_number)="{ item }">
      {{ item.operations_number }}
    </template>
  </b-table>
</template>

<script>
  import BtnCopy from '@/components/partials/BtnCopy';

  export default {
    name: 'NftContractsTable',
    components: {
      BtnCopy,
    },
    props: {
      items: {
        type: Array,
        required: true,
      },
      page: {
        type: Number,
        required: true,
      },
      limit: {
        type: Number,
        required: true,
      },
    },
    computed: {
      fields() {
        return [
          { key: 'number', label: this.$t('common.ordinalNumber') },
          { key: 'name', label: this.$t('common.contractName') },
          { key: 'address', label: this.$t('common.address') },
          { key: 'nfts_number', label: this.$t('nft.nftsNumber') },
          { key: 'operations_number', label: this.$t('nft.operationsNumber') },
        ];
      },
    },
  };
</script>
