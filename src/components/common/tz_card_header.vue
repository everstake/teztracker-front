<template>
  <div class="card-header">
    <div class="card-title">
      <div class="card-title_left">
        <slot name="left-content"></slot>
      </div>
      <div class="card-title_right">
        <slot name="right-content"></slot>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "CardHeader",
  components: {}
};
</script>


<style lang="scss" scoped>
@import "../../styles/scss/common";

.card-header .card-title {
  @include for-phone-only {
    h3,
    h4 {
      font-size: 14px;
    }
  }
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-direction: row;
}
</style>