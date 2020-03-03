<template>
  <b-breadcrumb class="ml-2">
    <b-breadcrumb-item
      v-for="(crumb, index) in crumbs"
      :key="index"
      :to="{ name: crumb.toRouteName }"
      :tag="index === crumbs.length - 1 ? 'span' : 'a'"
      :active="index === crumbs.length - 1"
    >
      {{ crumb.text }}
    </b-breadcrumb-item>
  </b-breadcrumb>
</template>

<script>
export default {
  name: "Breadcrumbs",
  props: {
    crumbs: {
      type: Array,
      required: true
    }
  }
};
</script>
