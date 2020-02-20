<template>
  <div class="main-content error-page">
    <section class="error-section">
      <div class="container-fluid">
        <div class="row justify-content-lg-center align-items-center">
          <div class="col-lg-3">
            <img src="img/404.svg" width="100%" alt />
          </div>
        </div>

        <div class="row justify-content-lg-center align-items-center">
          <div class="col-lg-8 text-center">
            <h1 class="error-text text-center">
              Page
              <span class="error-number">500</span>
            </h1>
            <h2 class="error-subtitle">Something`s wrong</h2>
            <router-link class="go-home" :to="{ name: 'index' }"
              >Go to homepage</router-link
            >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
