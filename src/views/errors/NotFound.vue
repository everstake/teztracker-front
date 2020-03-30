<template>
  <div class="main-content error-page">
    <section class="error-section">
      <b-container fluid>
        <b-row class="justify-content-lg-center align-items-center">
          <b-col lg="3">
            <img src="../../assets/img/404.svg" width="100%" alt />
          </b-col>
        </b-row>

        <b-row class="justify-content-lg-center align-items-center">
          <b-col lg="8" class="text-center">
            <h1 class="error-text text-center">
              {{ $t("errPages.page") }}
              <span class="error-number">404</span>
            </h1>
            <h2 class="error-subtitle">
              {{ $t("errPages.pageNotFound") }}
            </h2>
            <router-link :to="{ name: 'network' }" class="go-home">
              {{ $t("common.home") }}
            </router-link>
          </b-col>
        </b-row>
      </b-container>
    </section>
  </div>
</template>

<script>
export default {
  name: "NotFound"
};
</script>
