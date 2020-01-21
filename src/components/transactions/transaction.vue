<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="card ml-2 mr-2">
        <div class="card-header">
          <div class="title">
            <h3>
              <span class="text">{{opHash}}</span>
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
              <span class="value">{{blockHash}}</span>
            </div>
          </div>
          <div class="item-info row ml-1 mr-1">
            <div class="col-lg-3">
              <span class="label">Timestamp</span>
            </div>
            <div class="col-lg-9">
              <span class="value">{{timestamp | timeformat("HH:mm:ss DD.MM.YY") }}</span>
            </div>
          </div>
          <div class="item-info row ml-1 mr-1">
            <div class="col-lg-3">
              <span class="label">Operation Hash</span>
            </div>
            <div class="col-lg-9">
              <span class="value">{{opHash}}</span>
            </div>
          </div>
          <div class="item-info row ml-1 mr-1">
            <div class="col-lg-3">
              <span class="label">Block id</span>
            </div>
            <div class="col-lg-9">
              <span class="value">{{level}}</span>
            </div>
          </div>
          <div class="item-info row ml-1 mr-1">
            <div class="col-lg-3">
              <span class="label">Fee</span>
            </div>
            <div class="col-lg-9">
              <span class="value">
                {{fee | tezos}}
                ({{convert(fee)}})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { XTZ, ACTIONS } from "../../store";
import { ceil } from "lodash";
import { mapState } from "vuex";

export default {
  name: "Transaction",
  props: ["blockHash", "timestamp", "opHash", "level", "fee"],
  data() {
    return {
      tx: {}
    };
  },
  computed: {
    ...mapState({
      info: state => state.priceInfo
    })
  },
  async created() {
    await this.$store.dispatch(ACTIONS.INFO_GET);
  },
  methods: {
    convert(tzAmount) {
      let result = 0;
      if (tzAmount || tzAmount > 0) {
        const tez = tzAmount / XTZ;
        result = ceil(tez * this.info.price, 2);
      }
      return "$" + result;
    }
  }
};
</script>
