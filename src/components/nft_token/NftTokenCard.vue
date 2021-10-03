<template>
  <b-card lg="12" no-body>
    <b-card-header class="card__heading">
      <h3 class="mb-2">
        <b-skeleton v-if="loading || !token" />

        <span v-else>
          {{ token.name }}
        </span>
      </h3>

      <div class="subtitle">
        {{ $t('nft.tokenInfo') }}
      </div>
    </b-card-header>

    <div class="card-divider" />

    <b-card-body>
      <div class="item-info">
        <div lg="4" class="label">
          {{ $t('nft.category') }}
        </div>

        <div lg="8" class="text-accent">
          <b-skeleton v-if="loading || !token" />

          <span v-else>
            {{ token.category }}
          </span>
        </div>
      </div>

      <div class="item-info">
        <div lg="4" class="label">
          {{ $t('nft.description') }}
        </div>

        <div lg="8" class="text-accent">
          <b-skeleton v-if="loading || !token" />

          <span v-else>
            {{ token.description }}
          </span>
        </div>
      </div>

      <div class="item-info">
        <div lg="4" class="label">
          {{ $t('nft.lastPrice') }}
        </div>

        <div lg="8" class="text-accent">
          <b-skeleton v-if="loading || !token" />

          <span v-else>
            {{ token.last_price | currencyPrecision }}
          </span>
        </div>
      </div>

      <div class="item-info">
        <div lg="4" class="label">
          {{ $t('common.amount') }}
        </div>

        <div lg="8" class="text-accent">
          <b-skeleton v-if="loading || !token" />

          <span v-else>
            {{ token.amount }}
          </span>
        </div>
      </div>

      <div class="item-info">
        <div lg="4" class="label">
          {{ $t('nft.created') }}
        </div>

        <div lg="8" class="text-accent">
          <b-skeleton v-if="loading || !token" />

          <span v-else>
            {{ token.created_at | timeformat(dateFormat) }}
          </span>
        </div>
      </div>

      <div class="item-info">
        <div lg="4" class="label">
          {{ $t('nft.lastActive') }}
        </div>

        <div lg="8" class="text-accent">
          <b-skeleton v-if="loading || !token" />

          <span v-else>
            {{ token.last_active_at | timeformat(dateFormat) }}
          </span>
        </div>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'NftTokenCard',
    data() {
      return {
        token: null,
        loading: false,
      };
    },
    computed: {
      ...mapState({
        dateFormat: (state) => state.app.dateFormat,
      }),
      address() {
        return this.$route.params.address;
      },
      tokenId() {
        return this.$route.params.tokenId;
      },
    },
    mounted() {
      this.fetch();
    },
    methods: {
      async fetch() {
        this.loading = true;

        try {
          const response = await this.$api.getNftToken({
            address: this.address,
            tokenId: this.tokenId,
          });

          this.token = response.data;
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        }

        this.loading = false;
      },
    },
  };
</script>
