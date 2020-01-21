<template></template>

<script>
import { mapState } from "vuex";
export default {
  name: "Redirect",
  components: {},
  computed: {},
  beforeCreate: function() {
    this.$router.push("/mainnet");
  }
};
</script>
<style />
