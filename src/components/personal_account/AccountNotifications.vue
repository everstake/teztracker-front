<template>
  <div class="notifications">
    <div class="notifications__heading">
      <h3>
        Accounts & Notifications
        <span v-if="notifications.length"
          >({{ notifications.length }}/100)</span
        >
        <b-btn
          v-if="!email || !emailVerified"
          v-b-tooltip.bottom.hover
          :title="
            !email
              ? 'Add email address to enable email notification'
              : email && !emailVerified
              ? 'Please, verify your email. We have sent a verification letter on your email address'
              : ''
          "
          variant="icon"
          class="btn--tooltip notifications__tooltip d-inline-block"
        >
          <font-awesome-icon icon="question-circle" class="icon icon-circle" />
        </b-btn>
      </h3>
      <b-btn
        :disabled="notifications.length >= 100 || !email || !emailVerified"
        variant="success"
        @click="handleAddAddress"
      >
        <font-awesome-icon :icon="['fa', 'plus']" /> Address
      </b-btn>
      <b-modal id="add-address" size="md" centered hide-header>
        <p>Add new address</p>
        <b-form-group>
          <b-form-input
            class="form-group"
            type="text"
            placeholder="Put address here"
            autofocus
            v-model="$v.accountId.$model"
            :state="validateState('accountId')"
          >
          </b-form-input>
          <b-form-invalid-feedback
            v-if="!$v.accountId.isAddress"
            id="input-1-live-feedback"
            >Account id must starts with KT1, tz1, tz2 or tz3
            symbols.</b-form-invalid-feedback
          >
          <b-form-invalid-feedback id="input-1-live-feedback"
            >This field must be 36 characters.</b-form-invalid-feedback
          >
        </b-form-group>
        <div class="export-operations">
          <b-row>
            <b-col>
              <b-form-checkbox-group
                v-model="modal.selected"
                :options="modal.operations"
                switches
                size="md"
                @change="handleCheckboxChange"
              />
            </b-col>
          </b-row>
        </div>
        <template #modal-footer>
          <b-btn
            variant="success"
            @click="onModalSave"
            :disabled="!validateState('accountId')"
          >
            Save
          </b-btn>
        </template>
      </b-modal>
    </div>
    <hr />
    <div v-if="loading" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="3"
        :columns="4"
        :table-props="{ borderless: true, responsive: true }"
        animation="none"
        class="table-skeleton"
      />
    </div>
    <div v-else>
      <b-table
        responsive
        show-empty
        :items="notifications"
        :fields="fields"
        borderless
        class="transactions-table profile-table"
        :empty-text="$t('common.noData')"
        :per-page="limit"
        :current-page="page"
      >
        <template #cell(address)="row">
          {{ row.item.address | longhash }}
          <BtnCopy :text-to-copy="row.item.address" />
        </template>
        <template #cell(balance)="row">
          <span v-if="row.item.balance">
            {{ row.item.balance | denominate }}
          </span>
          <span v-else>-</span>
        </template>
        <template #cell(notification)="row">
          {{ email }}
        </template>
        <template #cell(actions)="row">
          <b-button-group>
            <b-btn size="sm" variant="danger" @click="onNotificationDelete(row)"
              >Delete</b-btn
            >
          </b-button-group>
        </template>
      </b-table>
      <PaginationSelect
        v-model="page"
        :total-rows="notifications.length"
        :per-page="limit"
        :current-page="page"
        :loading="loading"
        @onPageChange="(page) => handlePageChange(page)"
      />
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex';
  import {
    SET_ACCOUNT_NOTIFICATION,
    DELETE_ACCOUNT_NOTIFICATION,
    EDIT_ACCOUNT_NOTIFICATION,
  } from '@/store/mutations.types';
  import {
    GET_ACCOUNTS_NOTIFICATIONS,
    GET_USER_PROFILE,
  } from '@/store/actions.types';
  import { required, minLength, maxLength } from 'vuelidate/lib/validators';
  import vuelidateMixin from '@/mixins/vuelidateMixin';
  import BtnCopy from '@/components/partials/BtnCopy';
  import PaginationSelect from '@/components/partials/PaginationSelect';

  export default {
    name: 'AccountNotifications',
    components: {
      BtnCopy,
      PaginationSelect,
    },
    validations: {
      accountId: {
        required,
        minLength: minLength(36),
        maxLength: maxLength(36),
        isAddress: (value) =>
          ['KT1', 'tz1', 'tz2', 'tz3'].some((w) => w === value.slice(0, 3)),
      },
    },
    mixins: [vuelidateMixin],
    data() {
      return {
        fields: [
          { key: 'address', label: this.$tc('common.acc', 1) },
          {
            key: 'balance',
            label: this.$t('common.balance'),
          },
          { key: 'notification', label: 'Email Notifications' },
          { key: 'actions', label: 'Actions' },
        ],
        modal: {
          accountId: null,
          selected: ['no_notifications'],
          operations: [
            { text: 'Delegations', value: 'delegations_enabled' },
            {
              text: 'Incoming transfers (received)',
              value: 'in_transfers_enabled',
            },
            {
              text: 'Outgoing tranfers (sent)',
              value: 'out_transfers_enabled',
            },
            { text: 'No notifications', value: 'no_notifications' },
          ],
        },
        accountId: '',
        limit: 5,
        count: 0,
        page: 1,
        loading: true,
      };
    },
    methods: {
      ...mapMutations('user', [
        SET_ACCOUNT_NOTIFICATION,
        DELETE_ACCOUNT_NOTIFICATION,
        EDIT_ACCOUNT_NOTIFICATION,
      ]),
      ...mapActions('user', [GET_ACCOUNTS_NOTIFICATIONS, GET_USER_PROFILE]),
      handleAddAddress() {
        this.$bvModal.show('add-address');
      },
      async onModalSave() {
        const operations = !this.modal.selected.includes('no_notifications');
        let selectedOperations;
        const defaultOperations = {
          delegations_enabled: false,
          in_transfers_enabled: false,
          out_transfers_enabled: false,
        };

        if (operations) {
          selectedOperations = {
            ...defaultOperations,
            ...this.modal.selected.reduce(
              (acc, curr) => ((acc[curr] = true), acc),
              {},
            ),
          };
        } else {
          selectedOperations = defaultOperations;
        }

        await this.$api
          .postUserNotification({
            address: this.beaconAccount.address,
            accountId: this.accountId,
            ...selectedOperations,
          })
          .then(async () => {
            await this[GET_ACCOUNTS_NOTIFICATIONS]({
              address: this.beaconAccount.address,
            });

            this.resetModal();
            this.$bvModal.hide('add-address');
          })
          .catch(() => {
            this.$bvToast.toast('Oops, something went wrong!', {
              title: this.$t('errorsNotifications.error'),
              variant: 'danger',
              autoHideDelay: 1500,
            });
          });
      },
      resetModal() {
        this.accountId = '';
      },
      onModalClose() {
        this.resetModal();
        this.$bvModal.hide('add-address');
      },
      async onNotificationDelete({ item, index }) {
        await this.$api
          .deleteUserNotification({
            address: this.beaconAccount.address,
            accountId: item.address,
          })
          .then(() => {
            this[DELETE_ACCOUNT_NOTIFICATION](index);
          })
          .catch(() => {
            this.$bvToast.toast('Oops, something went wrong!', {
              title: this.$t('errorsNotifications.error'),
              variant: 'danger',
              autoHideDelay: 1500,
            });
          });
      },
      handlePageChange(page) {
        this.page = page;
      },
      handleCheckboxChange(arr) {
        if (!arr.length) {
          this.modal.selected = ['no_notifications'];
          return;
        }

        if (arr[arr.length - 1] === 'no_notifications') {
          this.modal.selected = ['no_notifications'];
          return;
        }

        const foundIndex = this.modal.selected.findIndex(
          (operation) => operation === 'no_notifications',
        );
        if (foundIndex > -1) {
          this.modal.selected = [
            ...this.modal.selected.slice(0, foundIndex),
            ...this.modal.selected.slice(foundIndex + 1),
          ];
        }
      },
    },
    computed: {
      ...mapState('user', [
        'notifications',
        'email',
        'emailVerified',
        'beaconAccount',
      ]),
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
            await this[GET_ACCOUNTS_NOTIFICATIONS]({
              address: this.beaconAccount.address,
            });
            this.loading = false;
          }
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .notifications__heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .notifications__tooltip {
    margin-left: 0;
  }

  .notifications__tooltip:focus {
    box-shadow: none;
  }
</style>
