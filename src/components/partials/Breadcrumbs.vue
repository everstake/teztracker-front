<template>
  <b-breadcrumb>
    <b-breadcrumb-item
      v-for="(crumb, index) in crumbs"
      :key="index"
      :to="{ name: crumb.toRouteName, params: { ...crumb.params } }"
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
