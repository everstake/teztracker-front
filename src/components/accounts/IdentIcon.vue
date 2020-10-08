<template>
  <img :src="icon" :alt="seed" class="ident-icon" />
</template>

<script>
  import { createIcon } from '@download/blockies';
  import accounts from '@/assets/tezos-assets/accounts.js';

  export default {
    name: 'IdentIcon',
    props: {
      seed: {
        type: String,
        default: '',
      },
    },
    computed: {
      isSeedPublicBaker() {
        return Boolean(
          accounts.hasOwnProperty(this.seed) && accounts[this.seed].hasLogo,
        );
      },
      icon() {
        if (!this.seed) {
          // 1x1 transparent image
          return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        }
        if (this.isSeedPublicBaker) {
          const logoReference = accounts[this.seed].logoReference || this.seed;
          return require(`../../assets/tezos-assets/img/${logoReference}.png`);
        }
        return createIcon({
          seed: this.seed,
          color: '#309282',
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
    max-width: 28px;
    max-height: 28px;
  }
</style>
