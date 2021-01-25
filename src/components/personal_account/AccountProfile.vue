<template>
  <div class="profile">
    <div class="profile__heading">
      <h3>
        My profile
      </h3>
    </div>
    <hr />

    <div class="profile__content">
      <div class="profile__email email mb-3">
        <div v-if="loading.email">
          <b-skeleton width="150px" />
        </div>
        <div v-else>
          <div v-if="!email">
            <b-btn
              v-b-tooltip.hover.bottom
              title="To enable Accounts & Notifications"
              variant="success"
              @click="handleEmailAdd"
            >
              Add email address
            </b-btn>
            <b-modal id="email-add" size="sm" title="Email" hide-footer>
              <div class="mb-3">
                <b-form-input
                  v-model.lazy="$v.user.email.$model"
                  type="text"
                  :state="validateState('user.email')"
                />
                <b-form-invalid-feedback id="input-1-live-feedback"
                  >Please enter a valid email address.</b-form-invalid-feedback
                >
              </div>
              <div class="mb-1">
                <b-btn
                  @click="handleEmailSave"
                  :disabled="!user.email.length || !$v.user.email.email"
                  class="w-100"
                  variant="success"
                  >Save</b-btn
                >
              </div>
            </b-modal>
          </div>
          <div class="d-flex justify-content-between align-items-center" v-else>
            <div>
              Email:
              <span
                :class="!emailVerified ? 'color-secondary' : 'color-accent'"
                >{{ email }}</span
              >
              <b-badge
                v-b-tooltip.bottom.hover
                title="We have sent a verification letter on your email address"
                v-if="!emailVerified"
                class="ml-2"
                variant="secondary"
                >email not verified</b-badge
              >
            </div>
            <b-btn size="sm" v-if="email" @click="handleEmailEdit"
              >Edit email</b-btn
            >
            <b-modal id="email-edit" size="sm" title="Edit email" hide-footer>
              <div>
                <p class="mb-0">
                  <label class="mr-4" for="profile-edit-email">Email</label>
                </p>
                <b-form-input
                  id="profile-edit-email"
                  v-model.lazy="$v.profileEdit.email.$model"
                  :state="validateState('profileEdit.email')"
                  type="text"
                  autofocus
                />
                <b-form-invalid-feedback id="input-1-live-feedback"
                  >Please enter a valid email address.</b-form-invalid-feedback
                >
                <b-btn
                  class="mt-4 w-100"
                  :disabled="
                    !profileEdit.email.length || !$v.profileEdit.email.email
                  "
                  variant="success"
                  @click="handleEmailEditSave"
                  >Save</b-btn
                >
              </div>
            </b-modal>
          </div>
        </div>
      </div>

      <div class="profile__username username mb-3">
        <div v-if="loading.username">
          <b-skeleton width="150px" />
        </div>
        <div v-else>
          <div v-if="!username">
            <b-btn
              @click="handleUsernameAdd"
              class="username__btn"
              variant="success"
              >Add username</b-btn
            >
            <b-modal id="username-add" size="sm" title="Username" hide-footer>
              <div>
                <b-form-input
                  v-model.lazy="$v.user.username.$model"
                  type="text"
                  :state="validateState('user.username')"
                />
                <b-form-invalid-feedback id="input-1-live-feedback"
                  >This field is required and must be between 3 and 30
                  characters.</b-form-invalid-feedback
                >
              </div>
              <div class="mb-1">
                <b-btn
                  @click="handleUsernameSave"
                  :disabled="
                    !user.username.length ||
                      !$v.user.username.minLength ||
                      !$v.user.username.maxLength
                  "
                  class="w-100"
                  variant="success"
                  >Save</b-btn
                >
              </div>
            </b-modal>
          </div>
          <div class="d-flex justify-content-between align-items-center" v-else>
            <span
              >Username: <span class="color-accent">{{ username }}</span></span
            >

            <b-btn size="sm" v-if="username" @click="handleUsernameEdit"
              >Edit username</b-btn
            >
            <b-modal
              id="username-edit"
              size="sm"
              title="Edit username"
              hide-footer
            >
              <div class="mb-3">
                <p class="mb-0">
                  <label class="mr-4" for="profile-edit-username"
                    >Username</label
                  >
                </p>
                <b-form-input
                  id="profile-edit-username"
                  v-model.lazy="$v.profileEdit.username.$model"
                  :state="validateState('profileEdit.username')"
                  type="text"
                  autofocus
                />
                <b-form-invalid-feedback id="input-1-live-feedback"
                  >This field is required and must be between 3 and 30
                  characters.</b-form-invalid-feedback
                >
                <b-btn
                  class="mt-4 w-100"
                  :disabled="
                    !profileEdit.username.length ||
                      !$v.profileEdit.username.minLength ||
                      !$v.profileEdit.username.maxLength
                  "
                  variant="success"
                  @click="handleUsernameEditSave"
                  >Save</b-btn
                >
              </div>
            </b-modal>
          </div>
        </div>
      </div>

      <!--    <b-form-group label="Username">-->
      <!--      <div v-if="loading">-->
      <!--        <b-skeleton width="150px" />-->
      <!--      </div>-->
      <!--      &lt;!&ndash;      <div v-if="username">&ndash;&gt;-->
      <!--      &lt;!&ndash;        <p>{{ username }}</p>&ndash;&gt;-->
      <!--      &lt;!&ndash;      </div>&ndash;&gt;-->
      <!--      &lt;!&ndash;      <div v-else>&ndash;&gt;-->
      <!--      &lt;!&ndash;        <b-form-input&ndash;&gt;-->
      <!--      &lt;!&ndash;          v-model="$v.user.username.$model"&ndash;&gt;-->
      <!--      &lt;!&ndash;          :state="validateState('user.username')"&ndash;&gt;-->
      <!--      &lt;!&ndash;          class="form-group email-input"&ndash;&gt;-->
      <!--      &lt;!&ndash;          type="text"&ndash;&gt;-->
      <!--      &lt;!&ndash;          placeholder="Username"&ndash;&gt;-->
      <!--      &lt;!&ndash;          >{{ username }}</b-form-input&ndash;&gt;-->
      <!--      &lt;!&ndash;        >&ndash;&gt;-->
      <!--      &lt;!&ndash;        <b-btn&ndash;&gt;-->
      <!--      &lt;!&ndash;          variant="success"&ndash;&gt;-->
      <!--      &lt;!&ndash;          :disabled="loading || !user.username || $v.user.username.$anyError"&ndash;&gt;-->
      <!--      &lt;!&ndash;          @click="handleUserNameSave"&ndash;&gt;-->
      <!--      &lt;!&ndash;        >&ndash;&gt;-->
      <!--      &lt;!&ndash;          <span v-if="loading">&ndash;&gt;-->
      <!--      &lt;!&ndash;            <font-awesome-icon&ndash;&gt;-->
      <!--      &lt;!&ndash;                :class="loading ? 'spinner' : 'icon-white'"&ndash;&gt;-->
      <!--      &lt;!&ndash;                :icon="loading ? 'spinner' : 'search'"&ndash;&gt;-->
      <!--      &lt;!&ndash;                :spin="loading"&ndash;&gt;-->
      <!--      &lt;!&ndash;            />&ndash;&gt;-->
      <!--      &lt;!&ndash;             Loading&ndash;&gt;-->
      <!--      &lt;!&ndash;             </span>&ndash;&gt;-->
      <!--      &lt;!&ndash;          <span v-else>Save</span>&ndash;&gt;-->
      <!--      &lt;!&ndash;        </b-btn>&ndash;&gt;-->
      <!--      &lt;!&ndash;        <b-form-invalid-feedback&ndash;&gt;-->
      <!--      &lt;!&ndash;          v-if="!$v.user.username.minLength"&ndash;&gt;-->
      <!--      &lt;!&ndash;          id="input-1-live-feedback"&ndash;&gt;-->
      <!--      &lt;!&ndash;          >This field must be at least 3 characters.</b-form-invalid-feedback&ndash;&gt;-->
      <!--      &lt;!&ndash;        >&ndash;&gt;-->
      <!--      &lt;!&ndash;        <b-form-invalid-feedback&ndash;&gt;-->
      <!--      &lt;!&ndash;          v-if="!$v.user.username.maxLength"&ndash;&gt;-->
      <!--      &lt;!&ndash;          id="input-1-live-feedback"&ndash;&gt;-->
      <!--      &lt;!&ndash;          >This field must be less than 30 characters.</b-form-invalid-feedback&ndash;&gt;-->
      <!--      &lt;!&ndash;        >&ndash;&gt;-->
      <!--      &lt;!&ndash;      </div>&ndash;&gt;-->
      <!--    </b-form-group>-->

      <p class="d-flex align-items-center">
        <span class="mr-2">Notifications:</span>
        <b-skeleton class="mb-0" v-if="loaded" width="50px" />
        <router-link v-else :to="{ name: 'account_notifications' }">
          {{ notifications.length }} / 100
        </router-link>
      </p>
      <p class="d-flex align-items-center">
        <span class="mr-2">Favorites:</span>
        <b-skeleton class="mb-0" v-if="loaded" width="50px" />
        <router-link v-else :to="{ name: 'account_favorites' }">
          {{ favorites.length }} / 50
        </router-link>
      </p>
      <p class="d-flex align-items-center">
        <span class="mr-2">Notes:</span>
        <b-skeleton class="mb-0" v-if="loaded" width="50px" />
        <router-link v-else :to="{ name: 'account_notes' }">
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
  </div>
</template>

<script>
  import { mapMutations, mapState, mapActions } from 'vuex';
  import { validationMixin } from 'vuelidate';
  import {
    email,
    maxLength,
    minLength,
    required,
  } from 'vuelidate/lib/validators';
  import {
    SET_ACCOUNT_EMAIL,
    SET_ACCOUNT_USERNAME,
    SET_USER_PROFILE,
  } from '@/store/mutations.types';
  import vuelidateMixin from '@/mixins/vuelidateMixin';
  import {
    GET_ACCOUNTS_NOTIFICATIONS,
    GET_USER_NOTES,
    GET_USER_PROFILE,
  } from '@/store/actions.types';

  export default {
    name: 'AccountProfile',
    mixins: [validationMixin, vuelidateMixin],
    validations: {
      profileEdit: {
        username: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(30),
        },
        email: {
          required,
          email,
        },
      },
      email: {
        email,
      },
      username: {
        minLength: minLength(3),
        maxLength: maxLength(30),
      },
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
        profileEdit: {
          email: '',
          username: '',
        },
        timer: 60,
        loading: {
          email: false,
          username: false,
        },
        loaded: false,
      };
    },
    methods: {
      ...mapMutations('user', [
        SET_ACCOUNT_EMAIL,
        SET_ACCOUNT_USERNAME,
        SET_USER_PROFILE,
      ]),
      ...mapActions('user', [
        GET_USER_PROFILE,
        GET_ACCOUNTS_NOTIFICATIONS,
        GET_USER_NOTES,
      ]),
      handleEmailEdit() {
        this.$bvModal.show('email-edit');
      },
      handleUsernameEdit() {
        this.$bvModal.show('username-edit');
      },
      handleEmailAdd() {
        this.$bvModal.show('email-add');
      },
      handleUsernameAdd() {
        this.$bvModal.show('username-add');
      },
      async handleEmailSave() {
        this.loading.email = true;
        await this.$api
          .updateUserProfile({
            address: this.beaconAccount.address,
            email: this.user.email,
            username: this.user.username,
          })
          .then(() => {
            this[SET_ACCOUNT_EMAIL](this.user.email);
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
        this.loading.email = false;
      },
      async handleUsernameSave() {
        this.loading.username = true;
        await this.$api
          .updateUserProfile({
            address: this.beaconAccount.address,
            username: this.user.username,
            email: this.email,
          })
          .then(() => {
            this[SET_ACCOUNT_USERNAME](this.user.username);
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
        this.loading.username = false;
      },
      async handleEmailEditSave() {
        if (this.profileEdit.email === this.email) return;
        this.loading.email = true;
        await this.$api
          .updateUserProfile({
            address: this.beaconAccount.address,
            username: this.username,
            email: this.profileEdit.email,
          })
          .then(() => {
            this[SET_ACCOUNT_EMAIL](this.profileEdit.email);
            this.$bvToast.toast('Email changed', {
              title: 'Email successfully changed',
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
        this.loading.email = false;
      },
      async handleUsernameEditSave() {
        this.loading.username = true;
        await this.$api
          .updateUserProfile({
            address: this.beaconAccount.address,
            username: this.profileEdit.username,
            email: this.email,
          })
          .then(() => {
            this[SET_ACCOUNT_USERNAME](this.profileEdit.username);
            this.$bvToast.toast('Username changed', {
              title: 'Username successfully changed',
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
        this.loading.username = false;
      },
    },
    watch: {
      beaconAccount: {
        immediate: true,
        deep: true,
        async handler({ address }) {
          if (address) {
            this.loading = {
              email: true,
              username: true,
            };
            this.loaded = true;
            await this[GET_USER_PROFILE]({
              address: this.beaconAccount.address,
            });
            await this[GET_ACCOUNTS_NOTIFICATIONS]({
              address: this.beaconAccount.address,
            });
            await this[GET_USER_NOTES]({ address: this.beaconAccount.address });
            this.loaded = false;
            this.loading = {
              email: false,
              username: false,
            };
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

  .profile__heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

  .profile__email-change {
    padding: 0;
    color: $color-brand;
    background: none;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid transparent;
    cursor: pointer;
  }

  .profile__email-change:hover {
    border-bottom: 1px solid $color-brand;
  }

  .username__btn {
    padding: 0;
    color: $color-brand;
    background: none;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid transparent;
  }

  .username__btn:hover,
  .username__btn:active,
  .username__btn:focus {
    color: $color-brand !important;
    background: none !important;
    outline: none;
    border: none;
    border-bottom: 1px solid $color-brand;
    box-shadow: none;
  }
</style>
