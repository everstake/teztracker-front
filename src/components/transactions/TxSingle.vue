<template>
  <b-row>
    <b-col lg="12">
      <b-card no-body>
        <b-card-header>
          <div class="break-word">
            <h3>
              <span class="text">{{ opHash }}</span>
            </h3>
            <span class="subtitle">Transaction Information</span>
          </div>
        </b-card-header>

        <div class="card-divider"></div>

        <b-card-body>
          <b-row class="item-info ml-1 mr-1">
            <b-col lg="3">
              <span class="label">Included in Block</span>
            </b-col>
            <b-col lg="9">
              <span class="value">
                <router-link
                  class="link"
                  :to="{ name: 'block', params: { level } }"
                  >{{ level }}</router-link
                >
              </span>
            </b-col>
          </b-row>
          <b-row class="item-info ml-1 mr-1">
            <b-col lg="3">
              <span class="label">Timestamp</span>
            </b-col>
            <b-col lg="9">
              <span class="value">{{timestamp | timeformat($constants.TIME_FORMAT) }}</span>
            </b-col>
          </b-row>
          <b-row class="item-info ml-1 mr-1">
            <b-col lg="3">
              <span class="label">Operation Hash</span>
            </b-col>
            <b-col lg="9">
              <span class="value">{{ opHash }}</span>
            </b-col>
          </b-row>
<!--          <b-row class="item-info ml-1 mr-1">-->
<!--            <b-col lg="3">-->
<!--              <span class="label">Block id</span>-->
<!--            </b-col>-->
<!--            <b-col lg="9">-->
<!--              <span class="value">{{ level }}</span>-->
<!--            </b-col>-->
<!--          </b-row>-->
          <b-row class="item-info ml-1 mr-1">
            <b-col lg="3">
              <span class="label">Fee</span>
            </b-col>
            <b-col lg="9">
              <span class="value">
                {{ fee | tezos }}
                ({{ $_convert(fee) }})
              </span>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
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
