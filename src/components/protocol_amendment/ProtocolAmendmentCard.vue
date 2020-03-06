<template>
  <div
    class="protocol-amendment__card"
    @click="onPeriodClick(id)"
  >
    <div class="protocol-amendment__period">
      {{ period }}
    </div>
    <div
      class="protocol-amendment__name"
      :class="period === 'current' ? 'protocol-amendment__name--active' : ''"
    >
      {{ name }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ProtocolAmendmentCard",
  props: ['name', 'period', 'id'],
  methods: {
    onPeriodClick(id) {
      this.$emit('handleClick', id)
    }
  }
};
</script>

<style lang="scss" scoped>
.protocol-amendment {
  &__card {
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
    padding: 40px;
    height: 450px;
    text-align: center;
    background-color: #fff;
    border: 1px solid #f0f0f1;
    border-radius: 4px;
    box-shadow: 0 0 15px 7px rgba(0, 0, 0, 0.02);
    cursor: pointer;
    user-select: none;

    @include max-width-tablet-portrait {
      padding: 25px;
    }
  }

  &__period {
    font-size: 36px;
    letter-spacing: 0.77px;
    color: #f0f0f1;
  }

  &__name {
    margin: auto;
    font-size: 72px;
    color: #9ea0a5;
    word-break: break-word;

    @include max-width-regular-laptop {
      font-size: 55px;
    }

    @include max-width-tablet-portrait {
      font-size: 40px;
    }

    &--active {
      color: #2d2e2c;
    }

    @include for-low-resolution-tablets-mobiles-landscape {
      font-size: 50px;
    }

    @include for-smartphones-portrait {
      font-size: 34px;
    }

    @media (max-width: 320px) {
      font-size: 34px;
    }
  }

  &__period,
  &__name {
    font-weight: 700;
    text-transform: capitalize;
  }
}
</style>
