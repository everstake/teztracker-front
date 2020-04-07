<template>
  <b-card-header>
    <b-card-title>
      <div class="card-title_left">
        <slot name="left-content"></slot>
      </div>
      <div class="card-title_right">
        <slot name="right-content"></slot>
      </div>
    </b-card-title>
  </b-card-header>
</template>

<script>
export default {
  name: "CardHeader"
};
</script>

<style lang="scss" scoped>
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
  margin-bottom: 0;
}

.card-title_right {
  text-align: right;
}
</style>
