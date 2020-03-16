<template>
  <div
    class="protocol-amendment__card"
    @click="onPeriodClick(id)"
    :class="period === 'current' ? 'protocol-amendment__card--active' : ''"
  >
    <div class="protocol-amendment__period font font--regular">
      {{ period }}
    </div>
    <div
      class="protocol-amendment__name font font--regular"
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

<style lang="scss">
.protocol-amendment {
  &__card {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin-bottom: 0px;
    padding: 40px;
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

    &--active {
      .protocol-amendment__name,
      .protocol-amendment__period {
        color: #2d2e2c;
      }
    }
  }

  &__period {
    margin-bottom: 15px;
    letter-spacing: 0.77px;
    color: #f0f0f1;
  }

  &__name {
    margin: auto;
    color: #9ea0a5;
    word-break: break-word;
  }

  &__period,
  &__name {
    font-weight: 700;
    text-transform: capitalize;
  }

  &__loading {
    position: relative;

    &:after {
      position: absolute;
      overflow: hidden;
      display: inline-block;
      vertical-align: bottom;
      animation: ellipsis steps(4,end) 900ms infinite;
      content: "\2026";
      width: 0;
    }
  }


}
</style>
