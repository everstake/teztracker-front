<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="card ml-2 mr-2">
        <div class="card-header">
          <div class="title">
            <h3>
              <span class="text">{{ opHash }}</span>
            </h3>
            <span class="subtitle">Transaction Information</span>
          </div>
        </div>

        <div class="card-divider"></div>

        <div class="card-body">
          <div class="item-info row ml-1 mr-1">
            <div class="col-lg-3">
              <span class="label">Included in Block</span>
            </div>
            <div class="col-lg-9">
              <span class="value">{{ blockHash }}</span>
            </div>
          </div>
          <div class="item-info row ml-1 mr-1">
            <div class="col-lg-3">
              <span class="label">Timestamp</span>
            </div>
            <div class="col-lg-9">
              <span class="value">{{timestamp | timeformat($constants.TIME_FORMAT) }}</span>
            </div>
          </div>
          <div class="item-info row ml-1 mr-1">
            <div class="col-lg-3">
              <span class="label">Operation Hash</span>
            </div>
            <div class="col-lg-9">
              <span class="value">{{ opHash }}</span>
            </div>
          </div>
          <div class="item-info row ml-1 mr-1">
            <div class="col-lg-3">
              <span class="label">Block id</span>
            </div>
            <div class="col-lg-9">
              <span class="value">{{ level }}</span>
            </div>
          </div>
          <div class="item-info row ml-1 mr-1">
            <div class="col-lg-3">
              <span class="label">Fee</span>
            </div>
            <div class="col-lg-9">
              <span class="value">
                {{ fee | tezos }}
                ({{ $_convert(fee) }})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import convert from "../../mixins/convert";
import { mapState, mapActions } from "vuex";
import { GET_APP_INFO } from "@/store/actions.types";

export default {
  name: "TxSingle",
  props: ["blockHash", "timestamp", "opHash", "level", "fee"],
  mixins: [convert],
  data() {
    return {
      tx: {}
    };
  },
  computed: {
    ...mapState('app', {
      info: state => state.priceInfo
    })
  },
  async created() {
    await this[GET_APP_INFO]();
  },
  methods: {
    ...mapActions('app', [GET_APP_INFO])
  }
};
</script>
