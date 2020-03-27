<template>
  <section
    v-if="endorsements && endorsements.length !== 0"
    class="mt-0"
  >
    <b-container fluid>
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
            <b-link
              v-for="(slot, index) in slots"
              :key="index"
              :to="{ name: 'tx', params: { txhash: slot } }"
              :disabled="!slot"
              :class="{
                'slots__item link': true,
                'slots__item--active': Boolean(slot),
                'slots__item--inactive': !Boolean(slot)
              }"
            >
              {{ index }}
            </b-link>
          </div>
        </b-card-body>
      </b-card>
    </b-container>
  </section>
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
    this.reload(this.level);
  }
};
</script>

<style lang="scss" scoped>
.slots {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;

  &__item {
    text-align: center;
    padding: 10px;
    cursor: pointer;
    transition: all 0.2s;

    &--active {
      background-color: $color-brand--opacity-2;

      &:hover {
        background-color: $color-brand--opacity-4;
      }
    }

    &--inactive {
      background-color: $color-error--opacity-2;

      &:hover {
        background-color: $color-error--opacity-4;
      }
    }
  }
}

@include for-phone-only {
  .slots__item {
    padding: 6px;
  }
}
</style>
