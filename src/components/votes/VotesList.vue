<template>
  <div>
    <b-table
      show-empty
      :items="votes"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table table-responsive-md"
    >
      <template slot="txhash" slot-scope="row">
        <b-link
          :to="{ name: 'tx', params: { txhash: row.item.operationGroupHash } }"
        >
          <span>{{ row.item.operationGroupHash | longhash(35) }}</span>
        </b-link>
      </template>

      <template slot="level" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
          <span>{{ row.item.blockLevel }}</span>
        </b-link>
      </template>

      <template slot="timestamp" slot-scope="row">
        <span>{{
          row.item.timestamp | timeformat($constants.TIME_FORMAT)
        }}</span>
      </template>

      <template slot="from" slot-scope="row">
        <b-link :to="{ name: 'account', params: { account: row.item.source } }">
          <span>{{ row.item.source | longhash(20) }}</span>
        </b-link>
      </template>

      <template slot="to" slot-scope="row">
        <b-link
          :to="{ name: 'account', params: { account: row.item.destination } }"
        >
          <span>{{ row.item.destination | longhash(20) }}</span>
        </b-link>
      </template>
      <template slot="amount" slot-scope="row">
        <span>{{ row.item.amount | tezos }}</span>
      </template>
      <template slot="fee" slot-scope="row">
        <span>{{ row.item.fee | tezos }}</span>
      </template>
    </b-table>

    <Pagination
      @change="$_handleCurrentPageChange"
      :total-rows="count"
      :per-page="perPage"
    />
  </div>
</template>

<script>
import Pagination from "../partials/Pagination";

export default {
  name: "VotesList",
  components: {
    Pagination
  },
  data() {
    return {
      votes: [],
      count: 0,
      fields: [
        { key: "period", label: "Period" },
        { key: "baker", label: "Baker" },
        { key: "vote", label: "Vote" },
        { key: "votingPeriod", label: "Voting period" },
        { key: "timestamp", label: "Timestamp" },
        { key: "blockLevel", label: "Block level" },
        { key: "hash", label: "Hash" }
      ]
    };
  }
};
</script>
