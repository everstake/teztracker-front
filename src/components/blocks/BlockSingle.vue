<template>
  <b-row>
    <b-col lg="12">
      <b-card no-body>
        <b-card-header>
          <div class="break-word">
            <h3>
              <span class="text">{{ level }}</span>
            </h3>
            <span class="subtitle">Block Information</span>
          </div>
        </b-card-header>

        <div class="card-divider"></div>

        <b-card-body>
          <b-row class="item-info ml-1 mr-1">
            <b-col lg="3">
              <span class="label">Hash</span>
            </b-col>
            <b-col lg="9">
              <span class="value">{{ block.hash }}</span>
            </b-col>
          </b-row>
          <b-row class="item-info ml-1 mr-1">
            <b-col lg="3">
              <span class="label">Timestamp</span>
            </b-col>
            <b-col lg="9">
              <span class="value">{{block.timestamp | timeformat($constants.TIME_FORMAT)}}</span>
            </b-col>
          </b-row>
          <b-row class="item-info ml-1 mr-1">
            <b-col lg="3">
              <span class="label">Volume</span>
            </b-col>
            <b-col lg="9">
              <span class="value">{{ block.volume | tezos }}</span>
            </b-col>
          </b-row>
          <b-row class="item-info ml-1 mr-1">
            <b-col lg="3">
              <span class="label">Cycle</span>
            </b-col>
            <b-col lg="9">
              <span class="value">{{ block.metaCycle }}</span>
            </b-col>
          </b-row>
          <b-row class="item-info ml-1 mr-1">
            <b-col lg="3">
              <span class="label">Baker</span>
            </b-col>
            <b-col lg="9">
              <span class="value">
                <router-link
                  class="baker"
                  :to="{ name: 'baker', params: { baker: block.baker } }"
                  >{{ block.baker }}</router-link
                >
              </span>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "BlockSingle",
  props: {
    block: {
      type: Object,
      required: true
    }
  },
  computed: {
    level() {
      return this.$route.params.level;
    }
  }
};
</script>
