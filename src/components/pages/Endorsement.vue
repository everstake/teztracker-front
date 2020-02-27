<template>
  <div class="col">
    <EndorsementSingle :hash="hash" />
  </div>
</template>

<script>
import EndorsementSingle from "../endorsements/EndorsementSingle";

export default {
  name: "Endorsement",
  components: {
    EndorsementSingle
  },
  computed: {
    hash() {
      return this.$route.params.txID;
    }
  }
};
</script>

<style />
