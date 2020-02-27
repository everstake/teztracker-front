<template>
  <div class="main-content">
    <section class="breadcrumbs">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="page-title ml-2">
              <h2>
                Tezos (XTZ) Blockchain Explorer -
                <span>{{ pageName }}</span>
              </h2>
            </div>

            <slot name="breadcrumbs" />
          </div>
        </div>
      </div>
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
