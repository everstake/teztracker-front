<template>
  <div class="main-content protocol-amendment">
    <section class="breadcrumbs">
      <b-container fluid>
        <b-row>
          <b-col lg="12">
            <div class="page-title ml-2">
              <h2 class="breadcrumbs__title">
                Tezos (XTZ) Blockchain Explorer -
                <span>Protocol amendment</span>
              </h2>
            </div>

            <ol class="breadcrumb ml-2">
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'network' }">Home</router-link>
              </li>
              <li class="breadcrumb-item active">Protocol amendment</li>
            </ol>
          </b-col>
        </b-row>
      </b-container>
    </section>

    <section>
      <b-container fluid>
        <b-row>
          <b-col
            sm="12"
            md="6"
            v-for="amendment in amendmentList"
            :key="generateKey()"
          >
            <ProtocolAmendmentCard
              :name="amendment.name"
              :period="amendment.period"
            />
          </b-col>
        </b-row>
      </b-container>
    </section>
  </div>
</template>

<script>
import ProtocolAmendmentCard from "@/components/protocol_amendment/ProtocolAmendmentCard";
import uuid from '@/mixins/uuid'

export default {
  name: "Bakers",
  components: {
    ProtocolAmendmentCard
  },
  mixins: [uuid],
  data: () => ({
    amendmentList: new Set([
      { name: "carthage 2.0", period: "current" },
      { name: "carthage 1.0", period: "past" },
      { name: "babylon 2.0", period: "past" },
      { name: "brest A", period: "past" },
      { name: "athens A", period: "past" }
    ])
  }),
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
