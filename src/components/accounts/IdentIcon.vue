<template>
  <img :src="icon" :alt="seed" class="ident-icon" />
</template>

<script>
  import { createIcon } from '@download/blockies';

  export default {
    name: 'IdentIcon',
    props: {
      seed: {
        type: String,
        default: 'default',
      },
    },
    computed: {
      icon() {
        return createIcon({
          seed: this.seed,
          color: '#309282', // to manually specify the icon color, default: random
          size: 7,
        }).toDataURL();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .ident-icon {
    border-radius: 50%;
    margin-right: 5px;
  }
</style>
