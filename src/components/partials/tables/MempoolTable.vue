<template>
  <b-table
    responsive
    show-empty
    :items="items"
    :fields="fields"
    borderless
    class="transactions-table"
    :empty-text="$t('common.noData')"
  >
    <template slot="details" slot-scope="row">
      <b-button size="sm" variant="success" @click="row.toggleDetails">
        {{
          row.detailsShowing
            ? $t('mempoolList.hideDetails')
            : $t('mempoolList.showDetails')
        }}
      </b-button>
    </template>

    <template slot="row-details" slot-scope="row">
      <b-card>
        <div v-for="(operation, index) in row.item.contents" :key="index">
          <pre><code class="code">{{ beautifyJSON(operation) }}</code></pre>
        </div>
      </b-card>
    </template>

    <template slot="signature" slot-scope="row">
      <span class="d-flex align-items-center">
        {{ row.item.signature | longhash }}
        <BtnCopy :text-to-copy="row.item.signature" />
      </span>
    </template>
    <template slot="branch" slot-scope="row">
      <span class="d-flex align-items-center">
        {{ row.item.branch | longhash }}
        <BtnCopy :text-to-copy="row.item.branch" />
      </span>
    </template>
    <template slot="protocol" slot-scope="row">
      <span class="d-flex align-items-center">
        {{ row.item.protocol | longhash }}
        <BtnCopy :text-to-copy="row.item.protocol" />
      </span>
    </template>
    <template slot="kind" slot-scope="row">
      <div v-for="(kind, index) in row.item.kind" :key="index">
        {{ kind }}
      </div>
    </template>
  </b-table>
</template>

<script>
  import BtnCopy from '@/components/partials/BtnCopy';

  export default {
    name: 'MempoolTable',
    components: {
      BtnCopy,
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
          { key: 'signature', label: this.$t('mempoolList.signature') },
          { key: 'branch', label: this.$t('mempoolList.branch') },
          { key: 'protocol', label: this.$t('mempoolList.protocol') },
          { key: 'kind', label: this.$t('votePage.kind') },
          { key: 'details', label: this.$t('mempoolList.details') },
        ];
      },
    },
    methods: {
      beautifyJSON(JSONObj) {
        return JSON.stringify(JSONObj, null, 2);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .code {
    color: #e83e8c;
    word-break: break-word;
  }
</style>
