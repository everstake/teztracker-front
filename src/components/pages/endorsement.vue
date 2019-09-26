<template>
  <div class="col">
    <Endorsement :hash="hash" />
  </div>
</template>

<script>
import Endorsement from "../endorsements/single";

export default {
  name: "EndorsementPage",
  computed: {
    hash() {
      return this.$route.params.txID;
    }
  },
  components: {
    Endorsement
  }
};
</script>

<style />
