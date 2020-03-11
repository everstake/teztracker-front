<template>
  <div class="main-content protocol-amendment">
    <div class="tz-breadcrumbs mt-4 mb-4">
      <b-container fluid>
        <b-row>
          <b-col lg="12">
            <ol class="ml-2 tz-breadcrumbs__list">
              <li class="font font--mini tz-breadcrumbs__item">
                <router-link :to="{ name: 'network' }" class="tz-breadcrumbs__link">Home</router-link>
              </li>
              <li class="active font font--mini tz-breadcrumbs__item">Protocol amendment</li>
            </ol>
          </b-col>
        </b-row>
      </b-container>
    </div>

    <div v-if="loading">
      <b-container fluid>
        <b-row>
          <b-col
            sm="12"
            md="6"
            lg="4"
            class="mb-4"
          >
            <div class="protocol-amendment__card">
              <div class="protocol-amendment__loading font font--regular">
                Loading
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <div v-else>
      <b-container fluid>
        <b-row>
          <b-col
            sm="12"
            md="6"
            lg="4"
            class="mb-4"
            v-for="(protocol, index) in protocols"
            :key="generateKey()"
          >
            <ProtocolAmendmentCard
              :name="protocol.title"
              :period="index === 0 ? 'current' : 'past'"
              :id="protocol.period"
              @handleClick="handleProtocolClick(protocol.period)"
            />
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import ProtocolAmendmentCard from "@/components/protocol_amendment/ProtocolAmendmentCard";
import uuid from '@/mixins/uuid';

export default {
  name: "Bakers",
  components: {
    ProtocolAmendmentCard
  },
  mixins: [uuid],
  data() {
    return {
      protocols: [],
      loading: true
    };
  },
  methods: {
    async handleProtocolClick(id) {
      const data = await this.$api.getPeriod({ id });
      const { status } = data;

      if (status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.replace({ name: status });
      }

      this.$router.push({ name: 'period', params: { id } })
    }
  },
  async created() {
    const data = await this.$api.getProposals({});
    this.protocols = data.data;
    this.loading = false;
  }
};
</script>

<style lang="scss" scoped>
.protocol-amendment {
  padding-top: 90px;
}

.breadcrumbs {
  padding: 2rem 0 1rem;
  margin: 1.6rem 0;
  background-color: #e0efec;

  &__title {
    font-size: 30px;
    font-weight: 400;
    line-height: 37px;
    letter-spacing: 0.4285713px;
    color: #309282;
  }
}
</style>
