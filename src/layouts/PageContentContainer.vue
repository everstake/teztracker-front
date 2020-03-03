<template>
  <div class="main-content">
    <section class="breadcrumbs">
      <b-container fluid>
        <b-row>
          <b-col lg="12">
            <div class="page-title ml-2">
              <h2>
                Tezos (XTZ) Blockchain Explorer -
                <span>{{ pageName }}</span>
              </h2>
            </div>

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
  name: "PageContentContainer",
  props: {
    pageName: {
      type: String,
      default: ""
    }
  }
};
</script>
