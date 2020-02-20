<template>
  <ol class="breadcrumb ml-2">
    <li
      v-for="(crumb, index) in crumbs"
      :key="index"
      :class="{
        'breadcrumb-item': true,
        active: index === crumbs.length - 1
      }"
    >
      <router-link
        :to="{ name: crumb.toRouteName }"
        :tag="index === crumbs.length - 1 ? 'span' : 'a'"
      >
        {{ crumb.text }}
      </router-link>
    </li>
  </ol>
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
