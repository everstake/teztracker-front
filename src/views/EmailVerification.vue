<template>
  <b-container class="verification">
    <div class="verification__loading" v-if="loading">
      <font-awesome-icon class="mb-4" :icon="['fa', 'spinner']" spin />
    </div>
    <div v-else-if="emailVerified" class="verification__content">
      <div class="mb-4">
        <h1 class="verification__title">
          Success, thank you for verifying your email
        </h1>
      </div>

      <b-btn :to="{ name: 'account_profile' }" variant="success" size="lg">
        Continue to Teztracker
      </b-btn>
    </div>
    <div v-else class="verification__content">
      <div class="mb-4">
        <h1 class="verification__title verification__title--danger">
          Oops, something went wrong!
        </h1>
      </div>

      <b-btn-group>
        <b-btn
          :to="{ name: 'network' }"
          class="err-page__btn"
          variant="success"
          size="lg"
        >
          Continue to Teztracker
        </b-btn>
        <b-btn
          size="lg"
          href="mailto:inbox@everstake.one?subject=Failed email verification"
        >
          <i class="far fa-envelope"></i> Get support by email
        </b-btn>
      </b-btn-group>
    </div>
  </b-container>
</template>

<script>
  import { GET_EMAIL_VERIFICATION } from '@/store/actions.types';
  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'EmailVerification',
    props: {
      token: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        loading: true,
      };
    },
    computed: {
      ...mapState('user', ['emailVerified']),
    },
    methods: {
      ...mapActions('user', [GET_EMAIL_VERIFICATION]),
    },
    async mounted() {
      await this[GET_EMAIL_VERIFICATION](this.token)
        .then(() => {})
        .catch(() => {});
      this.loading = false;
    },
  };
</script>

<style lang="scss" scoped>
  .verification {
    height: 100vh;
    min-height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    &__content {
      lex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px 0;
      text-align: center;
    }

    &__title {
      padding-bottom: 20px;
      font-size: 35px;
      font-weight: 700;
      color: $color-brand;

      @include for-phone-only {
        font-size: 55px;
      }
    }

    &__btn {
      font-size: 20px;
      padding: 0.6rem 6rem;
    }
  }

  .verification__title--danger {
    color: rgba(220, 49, 58, 0.85);
  }

  .verification__loading {
    font-size: 35px;
    color: #319281;
  }
</style>
