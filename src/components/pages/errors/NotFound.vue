<template>
  <div class="main-content error-page">
    <section class="error-section">
      <div class="container-fluid">
        <div class="row justify-content-lg-center align-items-center">
          <div class="col-lg-3">
            <img src="../../../assets/img/404.svg" width="100%" alt />
          </div>
        </div>

        <div class="row justify-content-lg-center align-items-center">
          <div class="col-lg-8 text-center">
            <h1 class="error-text text-center">
              Page
              <span class="error-number">404</span>
            </h1>
            <h2 class="error-subtitle">Something`s missing</h2>
            <a class="go-home" @click="back()">Go back</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  methods: {
    back() {
      if (window.history.length <= 2) {
        return this.$router.push({ name: "index" });
      }
      this.$router.go(-2);
    }
  }
};
</script>
