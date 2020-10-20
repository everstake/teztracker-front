<template>
  <section class="breadcrumbs m-0">
    <b-container fluid>
      <b-row>
        <b-col lg="12">
          <b-breadcrumb class="mt-4 breadcrumbs">
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
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
  export default {
    name: 'Breadcrumbs',
    props: {
      crumbs: {
        type: Array,
        required: true,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .breadcrumbs {
    padding: 0;
    margin-bottom: 0;

    h2 {
      font-size: 30px;
      font-weight: 400;
      line-height: 37px;
      letter-spacing: 0.4285713px;
      color: $color-brand;
    }

    .breadcrumb {
      margin: 0;
      padding: 0;
      background: transparent;

      .breadcrumb-item {
        padding-left: 0;
        font-size: 16px;
        font-weight: 400;
        line-height: 22px;
        letter-spacing: 0.3857144px;
        color: $color-brand;
        word-break: break-all;

        &:first-child:before {
          display: none;
        }

        &:before {
          padding-left: 0.6rem;
          padding-right: 0.2rem;
          content: ' - ';
          color: $color-black;
        }

        a {
          color: $color-black;
        }
      }
    }
  }
</style>
