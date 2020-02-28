<template>
  <section class="card-section">
    <b-container :fluid="fluid">
      <b-row>
        <b-col :cols="cols" :sm="sm" :md="md" :lg="lg" :xl="xl">
          <div class="card-section__breadcrumbs">
            <slot name="breadcrumbs"></slot>
          </div>
          <div class="card-section__header">
            <slot name="header"></slot>
          </div>
          <div class="card-section__body">
            <slot name="body"></slot>
          </div>
          <div class="card-section__footer">
            <slot name="footer"></slot>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
export default {
  name: "cardSection",
  props: {
    fluid: {
      type: Boolean,
      default: false
    },
    cols: {
      type: Number,
      default: 12
    },
    sm: {
      type: Number,
      default: 12
    },
    md: {
      type: Number,
      default: 12
    },
    lg: {
      type: Number,
      default: 12
    },
    xl: {
      type: Number,
      default: 12
    }
  }
};
</script>

<style lang="scss" scoped>

</style>