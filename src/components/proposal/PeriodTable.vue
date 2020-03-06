<template>
  <div class="vote__table">
    <CardSection :fluid="true">
      <template>
        <b-row>
          <b-col cols="12" sm="10" md="12" lg="12" xl="12" offset-cols="0" offset-sm="1" offset-md="0">
            <div class="card">
              <!-- Nav tabs -->
              <ul class="nav nav-tabs">
                <li class="nav-item">
                  <a class="nav-link active" data-toggle="tab" href="#voters"
                  >Voters</a
                  >
                </li>
                <li class="nav-item">
                  <a class="nav-link" data-toggle="tab" href="#non-voters"
                  >Non-voters</a
                  >
                </li>
              </ul>

              <!-- Tab panes -->
              <div class="tab-content">
                <div class="tab-pane active" id="voters">
                  <div class="card-header">
                    <div class="title">
                      <h3>
                        <span class="text">Voters list</span>
                      </h3>
                    </div>
                  </div>

                  <div class="card-body">
                    <!-- voters table start -->
                    <b-table
                      show-empty
                      stacked="md"
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

                    <div class="vote-table__button-wrapper">
                      <button
                        @click.prevent="handleShowClick('voters')"
                        class="vote-table__button"
                      >
                        {{ showMoreVoters ? "Show less" : "Show all" }}
                      </button>
                    </div>
                    <!-- voters table end -->
                  </div>
                </div>

                <div class="tab-pane" id="non-voters">
                  <div class="card-header">
                    <div class="title">
                      <h3>
                        <span class="text">Non-voters list</span>
                      </h3>
                    </div>
                  </div>

                  <div class="card-body">
                    <!-- non-voters table start -->
                    <b-table
                      show-empty
                      stacked="md"
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

                    <div class="vote-table__button-wrapper">
                      <button
                        @click.prevent="handleShowClick('nonVoters')"
                        class="vote-table__button"
                      >
                        {{ showMoreNonVoters ? "Show less" : "Show all" }}
                      </button>
                    </div>

                    <!--                <Pagination-->
                    <!--                  v-model="currentPage"-->
                    <!--                  :total-rows="voters.length"-->
                    <!--                  :per-page="perPage"-->
                    <!--                />-->
                    <!-- non-voters table end -->
                  </div>
                </div>
              </div>
            </div>
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
