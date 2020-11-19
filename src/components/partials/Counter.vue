<template>
  <div class="counter">
    <b-skeleton width="60px" height="30px" v-if="loading && !count" />
    <div v-else class="counter__text">
      <div v-if="showLine" class="counter__line"></div>
      <h3>{{ count | bignum }}</h3>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Counter',
    props: {
      count: {
        type: Number,
        default: 0,
      },
      showLine: {
        type: Boolean,
        default: false,
      },
      loading: Boolean,
    },
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
      border-bottom: 1px solid $color-grey;
      opacity: 0.5;
      position: absolute;
      left: -35px;
      @include for-phone-only {
        height: 10px;
      }
    }
  }
</style>
