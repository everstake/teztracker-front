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
.card-header .card-title {
  display: flex;
  justify-content: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
}
</style>