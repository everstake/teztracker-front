<template>
  <div class="counter">
    <div v-if="showLine" class="counter__line"></div>
    <div class="counter__text">
      <h3>{{ count | bignum }}</h3>
    </div>
  </div>
</template>

<script>
export default {
  name: "tzCounter",
  props: {
    count: {
      type: Number,
      default: 0
    },
    showLine: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss">


.counter {
  position: relative;
  @include for-phone-only {
    h3 {
      font-size: 14px;
    }
  }
  &__line {
    display: block;
    // float: left;
    width: 30px;
    height: 16px;
    margin-right: 0.5rem;
    border-bottom: 1px solid #9ea0a5;
    opacity: 0.5;
    position: absolute;
    left: -35px;
    @include for-phone-only {
      height: 10px;
    }
  }
}
</style>
