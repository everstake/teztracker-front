<template>
  <div class="main-content">
    <section class="breadcrumbs">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="page-title ml-2">
              <h2>
                Tezos (XTZ) Blockchain Explorer -
                <span>Endorsements page</span>
              </h2>
            </div>

            <ol class="breadcrumb ml-2">
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'network' }">Home</router-link>
              </li>
              <li class="breadcrumb-item active">Endorsements page</li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="card ml-2 mr-2">
              <div class="card-header">
                <div class="title">
                  <h3>
                    <span class="text">Endorsements list</span>
                    <div class="counter">
                      <span class="line"></span>
                      <span class="counter-text">
                        {{
                        count.endorsements | bignum
                        }}
                      </span>
                    </div>
                  </h3>
                </div>
              </div>

              <div class="card-body">
                <EndorsementsList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";
import EndorsementsList from "../endorsements/EndorsementsList";
export default {
  name: "Endorsements",
  components: {
    EndorsementsList
  },
  computed: {
    ...mapState('blocks', {
      count: state => state.counts
    })
  }
};
</script>

<style />
