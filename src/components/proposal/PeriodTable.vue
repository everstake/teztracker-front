<template>
  <div class="vote__table margin-bottom">
    <CardSection :fluid="true">
      <template>
        <b-row>
          <b-col
            cols="12"
            sm="10"
            md="12"
            lg="12"
            xl="12"
            offset-cols="0"
            offset-sm="1"
            offset-md="0"
          >
            <b-card no-body>
              <b-tabs>
                <b-tab title="Voters" active>
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">
                          {{ $t("listTypes.votersList") }}
                        </span>
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
                          :to="{
                            name: 'baker',
                            params: { baker: row.item.pkh }
                          }"
                        >
                          {{ row.item.name || row.item.pkh | longhash(35) }}
                        </b-link>
                      </template>

                      <template slot="rolls" slot-scope="row">
                        {{ row.item.rolls | formatInteger }}
                      </template>

                      <template slot="blockLevel" slot-scope="row">
                        <b-link
                          :to="{
                            name: 'block',
                            params: { level: row.item.blockLevel }
                          }"
                        >
                          {{ row.item.blockLevel | formatInteger }}
                        </b-link>
                      </template>

                      <template slot="proposal" slot-scope="row">
                        <span>{{ row.item.proposal | longhash(9) }}</span>
                      </template>

                      <template slot="operation" slot-scope="row">
                        <b-link
                          :to="{
                            name: 'vote',
                            params: { voteHash: row.item.operation }
                          }"
                        >
                          {{ row.item.operation | longhash(35) }}
                        </b-link>
                      </template>

                      <template slot="timestamp" slot-scope="row">
                        {{ formatDate(row.item.timestamp) }}
                      </template>
                    </b-table>
                    <div class="vote-table__button-wrapper">
                      <button
                        @click.prevent="handleShowClick('voters')"
                        class="vote-table__button"
                      >
                        {{ showMoreVoters ? $t("voting.showLess") : $t("voting.showAll") }}
                      </button>
                    </div>
                  </b-card-body>
                </b-tab>
                <b-tab title="Non-voters">
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">
                          {{ $t("listTypes.nonVotersList") }}
                        </span>
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
                          :to="{
                            name: 'baker',
                            params: { baker: row.item.pkh }
                          }"
                        >
                          <span>{{
                            row.item.name || row.item.pkh | longhash(35)
                          }}</span>
                        </b-link>
                      </template>
                      <template slot="rolls" slot-scope="row">
                        {{ row.item.rolls | formatInteger }}
                      </template>
                    </b-table>
                    <div class="vote-table__button-wrapper">
                      <button
                        @click.prevent="handleShowClick('nonVoters')"
                        class="vote-table__button"
                      >
                        {{ showMoreNonVoters ? $t("voting.showLess") : $t("voting.showAll") }}
                      </button>
                    </div>
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
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "PeriodTable",
  components: { CardSection },
  props: ["voters", "nonVoters", "votersFields", "nonVotersFields"],
  data() {
    return {
      perPage: 20,
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      pageOptions: this.$constants.PER_PAGE,
      showMoreVoters: false,
      showMoreNonVoters: false
    };
  },
  computed: {
    ...mapState("period", {
      votersCount: state => state.counts.voters,
      nonVotersCount: state => state.counts.nonVoters
    }),
    ...mapState("app", {
      dateFormat: state => state.dateFormat
    })
  },
  methods: {
    formatDate(date) {
      return moment(date).format(this.dateFormat);
    },
    handleShowClick(type) {
      if (type === "voters") {
        this.showMoreVoters = !this.showMoreVoters;

        this.showMoreVoters
          ? this.$emit("onShowClick", {
              type,
              limit: type === "voters" ? this.votersCount : this.nonVotersCount
            })
          : this.$emit("onShowClick", { type, limit: 20 });
      } else {
        this.showMoreNonVoters = !this.showMoreNonVoters;

        this.showMoreNonVoters
          ? this.$emit("onShowClick", {
              type,
              limit: type === "voters" ? this.votersCount : this.nonVotersCount
            })
          : this.$emit("onShowClick", { type, limit: 20 });
      }
    }
  }
};
</script>
