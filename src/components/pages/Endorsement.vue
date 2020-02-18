<template>
  <div class="col">
    <EndorsementSingle :hash="hash" />
  </div>
</template>

<script>
import EndorsementSingle from "../endorsements/EndorsementSingle";

export default {
  name: "Endorsement",
  computed: {
    hash() {
      return this.$route.params.txID;
    }
  },
  components: {
    EndorsementSingle
  }
};
</script>

<style />
