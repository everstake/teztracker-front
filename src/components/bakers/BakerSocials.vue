<template>
  <div>
    <span v-for="(social, index) in media" :key="index">
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
  export default {
    name: 'BakerSocials',
    props: {
      media: {
        required: true,
        type: Object,
        default: () => ({}),
      },
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
