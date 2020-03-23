<template>
  <b-card no-body>
    <b-card-header>
      <div class="break-word">
        <h3>
          <span class="text">
            Block endorsements
          </span>
        </h3>
      </div>

      <div class="card-divider w-100 mt-3"></div>
    </b-card-header>

    <b-card-body>
      <div class="slots">
        <div
          :class="{
            slots__item: true,
            'slots__item--active': Boolean(slot),
            'slots__item--inactive': !Boolean(slot)
          }"
          v-for="(slot, index) in slots"
          :key="index"
        >
          <b-link :to="{ name: 'tx', params: { txhash: slot } }" class="link">
            {{ index }}
          </b-link>
        </div>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  name: "EndorsementsSlots",
  data() {
    return {
      endorsements: []
    };
  },
  computed: {
    level() {
      return this.$route.params.level;
    },
    slots() {
      if (!this.endorsements || this.endorsements.length === 0) return [];

      const res = [];
      this.endorsements.forEach(endorsementObj =>
        JSON.parse(endorsementObj.slots).forEach(
          slotNum => (res[slotNum] = endorsementObj.operationGroupHash)
        )
      );
      return res;
    }
  },
  methods: {
    async reload(block = 0) {
      let result;
      console.log(block);
      result = await this.$api.getBlockEndorsements({ block_id: block });

      if (result.status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.replace({
          name: result.status
        });
      }

      this.endorsements = result.data;
    }
  },
  created() {
    this.reload(Number(this.level));
  }
};
</script>

<style lang="scss" scoped>
.slots {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;

  &__item {
    text-align: center;
    padding: 6px;

    &--active {
      background-color: $color-brand--opacity-2;
    }

    &--inactive {
      background-color: $color-error--opacity-2;
    }
  }
}
</style>
