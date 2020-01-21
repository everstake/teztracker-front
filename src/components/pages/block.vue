<template>
  <div class="main-content">
    <section class="breadcrumbs">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="page-title ml-2">
              <h2>
                Tezos (XTZ) Blockchain Explorer -
                <span>Blocks page</span>
              </h2>
            </div>

            <ol class="breadcrumb ml-2">
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'index' }">Home</router-link>
              </li>
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'blocks' }">Block page</router-link>
              </li>
              <li class="breadcrumb-item active">{{ level }}</li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container-fluid">
        <BlockInfo :level="level" />
      </div>
    </section>

    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="card ml-2 mr-2">
              <!-- Nav tabs -->
              <ul class="nav nav-tabs">
                <li class="nav-item">
                  <a class="nav-link active" data-toggle="tab" href="#transactions">Transactions</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" data-toggle="tab" href="#endorsements">Endorsements</a>
                </li>
              </ul>

              <!-- Tab panes -->
              <div class="tab-content">
                <div class="tab-pane active" id="transactions">
                  <div class="card-header">
                    <div class="title">
                      <h3>
                        <span class="text">Transactions list</span>
                      </h3>
                    </div>
                  </div>

                  <div class="card-body">
                    <Transactions :block="block" />
                  </div>
                </div>

                <div class="tab-pane" id="endorsements">
                  <div class="card-body">
                    <Endorsements :block="block.level" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import BlockInfo from "../blocks/block";
import Endorsements from "../endorsements/list";
import Transactions from "../transactions/transactions";

export default {
  name: "Block",
  components: {
    BlockInfo,
    Endorsements,
    Transactions
  },
  data() {
    return {
      block: {}
    };
  },
  computed: {
    level() {
      return this.$route.params.level;
    }
  },
  async created() {
    const result = await this.$store.getters.API.getBlock({
      block: this.level
    });
    this.block = result.data.block || {};
  }
};
</script>

<style />
