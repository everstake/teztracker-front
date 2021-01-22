<template>
  <div class="profile">
    <h3>
      My profile
    </h3>
    <hr />

    <b-form-group label="Email address">
      <div v-if="email && emailVerified">
        <p class="profile__email">{{ email }}</p>
        <button class="profile__button" @click="handleEmailChange">
          Change email address
        </button>
      </div>
      <div v-else-if="email && !emailVerified">
        <p>{{ user.email }}</p>
        <p>
          <button
              class="profile__button profile__button--important"
              @click="handleEmailChange"
              :disabled="loading"
          >
            <span>Resend verification email</span>
          </button>
        </p>
      </div>
      <div v-else-if="!email">
        <b-form-input
          v-model="$v.user.email.$model"
          :state="validateState('user.email')"
          class="form-group email-input"
          type="text"
          placeholder="email@gmail.com"
          >{{ email }}</b-form-input
        >

        <b-btn
          variant="success"
          :disabled="loading || !user.email || $v.user.email.$anyError"
          @click="handleUserEmailSave"
        >
          Save
        </b-btn>

        <b-form-invalid-feedback id="input-1-live-feedback"
          >Please enter a valid email address.</b-form-invalid-feedback
        >
      </div>
    </b-form-group>

    <b-form-group label="Username">
      <div v-if="username">
        <p>{{ username }}</p>
      </div>
      <div v-else>
        <b-form-input
          v-model="$v.user.username.$model"
          :state="validateState('user.username')"
          class="form-group email-input"
          type="text"
          placeholder="Username"
          >{{ username }}</b-form-input
        >
        <b-btn
          variant="success"
          :disabled="loading || !user.username || $v.user.username.$anyError"
          @click="handleUserNameSave"
        >
          Save
        </b-btn>
        <b-form-invalid-feedback
          v-if="!$v.user.username.minLength"
          id="input-1-live-feedback"
          >This field must be at least 3 characters.</b-form-invalid-feedback
        >
        <b-form-invalid-feedback
          v-if="!$v.user.username.maxLength"
          id="input-1-live-feedback"
          >This field must be less than 30 characters.</b-form-invalid-feedback
        >
      </div>
    </b-form-group>

    <p>
      Notifications:
      <router-link
        :to="{ name: 'personal_account' }"
        @click.native.prevent="$emit('changeCurrentTab', 1)"
      >
        {{ notifications.length }} / 100
      </router-link>
    </p>
    <p>
      Favorites:
      <router-link
        :to="{ name: 'personal_account' }"
        @click.native.prevent="$emit('changeCurrentTab', 3)"
      >
        {{ favorites.length }} / 50
      </router-link>
    </p>
    <p>
      Notes:
      <router-link
        :to="{ name: 'personal_account' }"
        @click.native.prevent="$emit('changeCurrentTab', 4)"
      >
        {{ notes.length }} / 50
      </router-link>
    </p>
    <p v-if="beaconAccount && beaconAccount.connectedAt">
      Last login:
      <span>
        {{ (beaconAccount.connectedAt / 1000) | timeformat(dateFormat) }}
      </span>
    </p>
  </div>
</template>

<script>
  import { mapMutations, mapState, mapActions } from 'vuex';
  import { validationMixin } from 'vuelidate';
  import { email, maxLength, minLength } from 'vuelidate/lib/validators';
  import {
    SET_ACCOUNT_EMAIL,
    SET_ACCOUNT_USERNAME,
    SET_USER_PROFILE,
  } from '@/store/mutations.types';
  import vuelidateMixin from '@/mixins/vuelidateMixin';
  import { GET_USER_PROFILE } from '@/store/actions.types';

  export default {
    name: 'AccountProfile',
    mixins: [validationMixin, vuelidateMixin],
    validations: {
      user: {
        email: {
          email,
        },
        username: {
          minLength: minLength(3),
          maxLength: maxLength(30),
        },
      },
    },
    computed: {
      ...mapState('user', [
        'beaconAccount',
        'notifications',
        'notes',
        'emailVerified',
        'favorites',
        'email',
        'username',
      ]),
      ...mapState('app', ['dateFormat', 'network']),
    },
    data() {
      return {
        user: {
          email: '',
          username: '',
          verified: false,
        },
        loading: false,
        timer: 60,
      };
    },
    methods: {
      ...mapMutations('user', [
        SET_ACCOUNT_EMAIL,
        SET_ACCOUNT_USERNAME,
        SET_USER_PROFILE,
      ]),
      ...mapActions('user', [GET_USER_PROFILE]),
      async handleEmailChange() {
        this[SET_USER_PROFILE]({
          email: null,
          emailVerified: false,
        });
      },
      async handleSettingsSave() {
        this.$v.user.$touch();
        if (this.$v.user.$anyError) {
          return;
        }
        this.$emit('onLoading', true);
        await this.$api
          .setAccountProfile({
            address: this.beaconAccount.address,
            email: this.user.email,
            username: this.user.username,
          })
          .then(() => {
            this.$bvToast.toast({
              title: this.$t('errorsNotifications.success'),
              variant: 'success',
              autoHideDelay: 1500,
            });
          })
          .catch(() => {
            this.$bvToast.toast({
              title: this.$t('errorsNotifications.error'),
              variant: 'error',
              autoHideDelay: 1500,
            });
          });
        this.$emit('onLoading', false);
      },
      onUsernameInput(value) {
        this.$v.user.$touch();
        if (this.$v.user.$anyError) {
          return;
        }
        this[SET_ACCOUNT_USERNAME](value);
      },
      onEmailInput(value) {
        this.$v.user.$touch();
        if (this.$v.user.$anyError) {
          return;
        }
        this.user.email = value;
      },
      async handleProfileSave() {
        this.loading = true;
        await this.$api
          .updateUserProfile({
            address: this.beaconAccount.address,
            email: this.user.email,
            username: this.user.username ? this.user.username : undefined,
          })
          .then((data) => {
            this[SET_ACCOUNT_EMAIL](data.data.email);
            this[SET_ACCOUNT_USERNAME](data.data.username);
            this.$bvToast.toast('Profile successfully saved', {
              title: 'Profile saved',
              variant: 'success',
              autoHideDelay: 1500,
            });
          })
          .catch((e) => {
            console.log(e);
            this.$bvToast.toast('Oops, something went wrong!', {
              title: this.$t('errorsNotifications.error'),
              variant: 'danger',
              autoHideDelay: 2500,
            });
          });
        this.loading = false;
      },
      async handleUserEmailSave() {
        this.loading = true;
        await this.$api
          .updateUserProfile({
            address: this.beaconAccount.address,
            email: this.user.email,
          })
          .then((data) => {
            this[SET_ACCOUNT_EMAIL](data.data.email);
            this.$bvToast.toast('Email saved', {
              title: 'Email successfully saved',
              variant: 'success',
              autoHideDelay: 1500,
            });
          })
          .catch((e) => {
            console.log(e);
            this.$bvToast.toast('Oops, something went wrong!', {
              title: this.$t('errorsNotifications.error'),
              variant: 'danger',
              autoHideDelay: 2500,
            });
          });
        this.loading = false;
      },
      async handleUserNameSave() {
        this.loading = true;
        await this.$api
          .updateUserProfile({
            address: this.beaconAccount.address,
            username: this.user.username,
          })
          .then((data) => {
            this[SET_ACCOUNT_USERNAME](data.data.username);
            this.$bvToast.toast('Username saved', {
              title: 'Username successfully saved',
              variant: 'success',
              autoHideDelay: 1500,
            });
          })
          .catch((e) => {
            console.log(e);
            this.$bvToast.toast('Oops, something went wrong!', {
              title: this.$t('errorsNotifications.error'),
              variant: 'danger',
              autoHideDelay: 2500,
            });
          });
        this.loading = false;
      },
    },
    watch: {
      beaconAccount: {
        immediate: true,
        deep: true,
        async handler({ address }) {
          if (address) {
            await this[GET_USER_PROFILE]({
              address: this.beaconAccount.address,
            });
          }
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .email-input {
    max-width: 230px;
    display: inline-block;
    margin-right: 15px;
  }

  .profile__email {
    margin-bottom: 0.5rem;
  }

  .profile__button {
    font-size: 13px;
    outline: none;
    border: none;
    background: transparent;
    padding: 0;
    margin: 0;
    border-bottom: 1px transparent solid;
    color: #319281;
  }

  .profile__button:hover {
    border-bottom: $color-brand 1px solid;
  }

  .profile__button--important {
    border-bottom: 2px solid transparent;
    font-weight: bold;
  }

  .profile__button--important:hover {
    border-bottom: 2px solid $color-brand;
  }
</style>
