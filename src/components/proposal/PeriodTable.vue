<template>
  <div class="vote__table margin-bottom">
    <CardSection :fluid="true">
      <template>
        <b-row>
          <b-col cols="12" sm="10" md="12" lg="12" xl="12" offset-cols="0" offset-sm="1" offset-md="0">
            <b-card no-body>
              <b-tabs>
                <b-tab title="Voters" active>
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">Voters list</span>
                      </h3>
                    </div>
                  </b-card-header>

                  <b-card-body>
                    <b-table
                      show-empty
                      :items="voters"
                      :fields="votersFields"
                      :current-page="currentPage"
                      :per-page="0"
                      class="transactions-table table table-borderless table-responsive-md"
                    >
                      <template slot="pkh" slot-scope="row">
                        <b-link
                          :to="{ name: 'baker', params: { baker: row.item.pkh } }"
                        >
                      <span>{{
                        row.item.name || row.item.pkh | longhash(35)
                      }}</span>
                        </b-link>
                      </template>

                      <template slot="blockLevel" slot-scope="row">
                        <b-link
                          :to="{
                        name: 'block',
                        params: { level: row.item.blockLevel }
                      }"
                        >
                          <span>{{ row.item.blockLevel }}</span>
                        </b-link>
                      </template>

                      <template slot="operation" slot-scope="row">
                        <b-link
                          :to="{
                        name: 'tx',
                        params: { txhash: row.item.operation }
                      }"
                        >
                          <span>{{ row.item.operation | longhash(35) }}</span>
                        </b-link>
                      </template>

                      <template slot="timestamp" slot-scope="row">
                        <span>{{ formatDate(row.item.timestamp) }}</span>
                      </template>
                    </b-table>
                  </b-card-body>
                </b-tab>
                <b-tab title="Non-voters">
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">Non-voters</span>
                      </h3>
                    </div>
                  </b-card-header>

                  <b-card-body>
                    <b-table
                      show-empty
                      :items="nonVoters"
                      :fields="nonVotersFields"
                      :current-page="currentPage"
                      :per-page="0"
                      class="transactions-table table table-borderless table-responsive-md"
                    >
                      <template slot="pkh" slot-scope="row">
                        <b-link
                          :to="{ name: 'baker', params: { baker: row.item.pkh } }"
                        >
                      <span>{{
                        row.item.name || row.item.pkh | longhash(35)
                      }}</span>
                        </b-link>
                      </template>
                    </b-table>
                  </b-card-body>
                </b-tab>
              </b-tabs>
            </b-card>
          </b-col>
        </b-row>
      </template>
    </CardSection>
  </div>
</template>

<script>
import CardSection from "@/components/partials/CardSection";
import Pagination from "@/components/partials/Pagination";
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "PeriodTable",
  components: {
    CardSection,
    Pagination
  },
  props: ["voters", "nonVoters", "votersFields", "nonVotersFields"],
  data() {
    return {
      perPage: 20,
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      pageOptions: this.$constants.PAGE_OPTIONS,
      showMoreVoters: false,
      showMoreNonVoters: false
    };
  },
  computed: {
    ...mapState("proposal", {
      votersCount: state => state.counts.voters,
      nonVotersCount: state => state.counts.nonVoters
    })
  },
  methods: {
    formatDate(date) {
      return moment(date).format(this.$constants.TIME_FORMAT);
    },
    handleShowClick(type) {
      if (type === 'voters') {
        this.showMoreVoters = !this.showMoreVoters;

        this.showMoreVoters
          ? this.$emit("onShowClick", {type, limit: type === 'voters' ? this.votersCount : this.nonVotersCount})
          : this.$emit("onShowClick", {type, limit: 20});
      } else {
        this.showMoreNonVoters = !this.showMoreNonVoters;

        this.showMoreNonVoters
          ? this.$emit("onShowClick", {type, limit: type === 'voters' ? this.votersCount : this.nonVotersCount})
          : this.$emit("onShowClick", {type, limit: 20});
      }
    }
  }
};
</script>
