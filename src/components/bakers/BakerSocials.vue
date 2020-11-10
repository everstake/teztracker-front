<template>
  <div>
    <span v-for="(social, index) in bakerSocials" :key="index">
      <a
        v-if="social"
        :href="formURL(index, social)"
        target="_blank"
        class="social-link text-success"
      >
        <font-awesome-icon v-if="index === 'site'" icon="globe" />
        <font-awesome-icon v-else-if="index === 'email'" icon="envelope" />
        <font-awesome-icon v-else :icon="['fab', index]" />
      </a>
    </span>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'BakerSocials',
    props: {
      bakerAddress: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        bakerMeta: {},
      };
    },
    computed: {
      bakerSocials() {
        if (!this.bakerMeta || !Object.keys(this.bakerMeta).length) return {};

        const { site, email, twitter, telegram } = this.bakerMeta.metadata;
        return {
          site,
          email,
          twitter,
          telegram,
        };
      },
    },
    created() {
      this.getBakerMeta(this.bakerAddress);
    },
    methods: {
      formURL(socialMedia, link) {
        switch (socialMedia) {
          case 'twitter':
            return `https://twitter.com/${link}`;
          case 'telegram':
            return `https://t.me/${link}`;
          case 'email':
            return `mailto:${link}`;
          default:
            return link;
        }
      },
      async getBakerMeta(bakerAddress) {
        try {
          const res = await axios.get(
            `https://staging.api.tzkt.io/v1/accounts/${bakerAddress}?metadata=true`,
          );

          this.bakerMeta = res.data;
        } catch (e) {
          console.error(e);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .social-link {
    font-size: 20px;
    margin-right: 10px;
    transition: color 0.2s;
  }
</style>
