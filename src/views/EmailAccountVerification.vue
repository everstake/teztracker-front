<template>
  <b-container class="email">
    <div v-if="emailVerified" class="email__content">
      <div class="mb-4">
        <h1 class="email__title">
          Success, you email address has been verified
        </h1>
      </div>

      <b-btn
        :to="{ name: 'personal_account' }"
        class="err-page__btn"
        variant="success"
        size="lg"
      >
        Continue to Teztracker
      </b-btn>
    </div>
    <div v-else class="email__content">
      <div class="mb-4">
        <h1 class="email__title email__title--danger">
          Oops, something went wrong!
        </h1>
      </div>

      <b-btn
        :to="{ name: 'network' }"
        class="err-page__btn"
        variant="success"
        size="lg"
      >
        Continue to Teztracker
      </b-btn>
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
    computed: {
      ...mapState('user', ['emailVerified']),
    },
    methods: {
      ...mapActions('user', [GET_EMAIL_VERIFICATION]),
    },
    async created() {
      await this[GET_EMAIL_VERIFICATION](this.token);
    },
  };
</script>

<style lang="scss" scoped>
  .email {
    height: 100vh;
    min-height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    &__content {
      text-align: center;
      padding: 20px 0;
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

  .email__title--danger {

  }
</style>
