<template>
  <b-card lg="12" no-body>
    <b-card-header class="card__heading">
      <h3 class="mb-2">
        <b-skeleton v-if="loading || !contract" />

        <span v-else>
          {{ contract.name }}
        </span>
      </h3>

      <div class="subtitle">
        {{ $t('infoTypes.contractInfo') }}
      </div>
    </b-card-header>

    <div class="card-divider" />

    <b-card-body>
      <div class="item-info">
        <div lg="4" class="label">
          {{ $t('bakerSingle.address') }}
        </div>

        <div lg="8" class="text-accent">
          <b-skeleton v-if="loading || !contract" />

          <span v-else class="d-flex align-items-center text-break">
            {{ contract.address }}

            <BtnCopy :text-to-copy="contract.address" />
          </span>
        </div>
      </div>

      <div class="item-info">
        <div lg="4" class="label">
          {{ $t('nft.description') }}
        </div>

        <div lg="8" class="text-accent">
          <b-skeleton v-if="loading || !contract" />

          <span v-else>
            {{ contract.description }}
          </span>
        </div>
      </div>

      <div class="item-info">
        <div lg="4" class="label">
          {{ $t('nft.nftsNumber') }}
        </div>

        <div lg="8" class="text-accent">
          <b-skeleton v-if="loading || !contract" />

          <span v-else>
            {{ contract.nfts_number }}
          </span>
        </div>
      </div>

      <div class="item-info">
        <div lg="4" class="label">
          {{ $t('nft.operationsNumber') }}
        </div>

        <div lg="8" class="text-accent">
          <b-skeleton v-if="loading || !contract" />

          <span v-else>
            {{ contract.operations_number }}
          </span>
        </div>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
  import BtnCopy from '@/components/partials/BtnCopy';

  export default {
    name: 'NftContractCard',
    components: { BtnCopy },
    data() {
      return {
        contract: null,
        loading: false,
      };
    },
    computed: {
      address() {
        return this.$route.params.address;
      },
    },
    mounted() {
      this.fetch();
    },
    methods: {
      async fetch() {
        this.loading = true;

        try {
          const response = await this.$api.getNftContract({
            address: this.address,
          });

          this.contract = response.data;
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        }

        this.loading = false;
      },
    },
  };
</script>
