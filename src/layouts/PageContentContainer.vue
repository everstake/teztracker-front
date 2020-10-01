<template>
  <div class="main-content">
    <section class="breadcrumbs">
      <b-container fluid>
        <b-row>
          <b-col lg="12">
            <slot name="breadcrumbs" />
          </b-col>
        </b-row>
      </b-container>
    </section>

    <slot name="content" />
  </div>
</template>

<script>
  export default {
    name: 'PageContentContainer',
    props: {
      pageName: {
        type: String,
        default: '',
      },
    },
  };
</script>
