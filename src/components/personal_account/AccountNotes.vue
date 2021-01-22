<template>
  <div class="notes">
    <div class="notes__heading">
      <h3>
        Notes
      </h3>

      <b-btn
        variant="success"
        @click="handleNoteClick"
        :disabled="notes.length >= 50"
      >
        <font-awesome-icon :icon="['fa', 'plus']" /> Note
      </b-btn>
    </div>
    <b-modal
      id="add-note"
      size="md"
      centered
      hide-header
      @hide="handleModalClose"
    >
      <b-form-group>
        Account ID *
        <b-form-input
          v-model="$v.note.accountId.$model"
          class="form-group"
          type="text"
          placeholder="Title"
          :state="validateState('note.accountId')"
          autofocus
          :disabled="notes.find((item) => item.accountId === note.accountId)"
        >
        </b-form-input>
        <b-form-invalid-feedback
          v-if="!$v.note.accountId.isAddress"
          id="input-1-live-feedback"
          >Account string must start with KT1, tz1, tz2 or tz3
          symbols.</b-form-invalid-feedback
        >
        <b-form-invalid-feedback id="input-1-live-feedback"
          >This field must be 36 characters.</b-form-invalid-feedback
        >
      </b-form-group>
      <b-form-group>
        Alias *
        <b-form-input
          v-model="$v.note.alias.$model"
          class="form-group"
          type="text"
          placeholder="Title"
          :state="validateState('note.alias')"
        >
        </b-form-input>
        <b-form-invalid-feedback id="input-1-live-feedback"
          >This field is required and must be between 1 and 30
          characters.</b-form-invalid-feedback
        >
      </b-form-group>
      <b-form-group>
        Tag
        <b-form-input
          v-model="$v.note.tag.$model"
          class="form-group"
          type="text"
          :state="validateState('note.tag')"
        >
        </b-form-input>
        <b-form-invalid-feedback id="input-1-live-feedback"
          >This field includes maximum 20 characters.</b-form-invalid-feedback
        >
      </b-form-group>
      <b-form-group>
        Text *
        <b-form-textarea
          v-model="$v.note.content.$model"
          class="form-group"
          placeholder="Note"
          rows="6qw"
          :state="validateState('note.content')"
        >
        </b-form-textarea>
        <b-form-invalid-feedback id="input-1-live-feedback"
          >This field is required and must be between 1 and 2000
          characters.</b-form-invalid-feedback
        >
      </b-form-group>
      <template #modal-footer>
        <b-btn @click="handleModalClose">
          Close
        </b-btn>
        <b-btn
          variant="success"
          :disabled="note.alias.length < 1 || note.content.length < 1"
          @click="handleModalSave"
        >
          Save
        </b-btn>
      </template>
    </b-modal>
    <hr />
    <div v-if="loading" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="3"
        :columns="6"
        :table-props="{ borderless: true, responsive: true }"
        animation="none"
        class="table-skeleton"
      />
    </div>
    <b-table
      v-else
      responsive
      show-empty
      :items="notes"
      :fields="fields"
      borderless
      class="transactions-table profile-table"
      :empty-text="$t('common.noData')"
      :per-page="limit"
      :current-page="page"
    >
      <template #cell(accountId)="row">
        {{ row.item.accountId | longhash }}
        <BtnCopy :text-to-copy="row.item.accountId" />
      </template>
      <template #cell(tag)="row">
        {{ row.item.tag || '-' }}
      </template>
      <template #cell(notification)="row">
        {{ row.item.notification }}
      </template>
      <template #cell(actions)="row">
        <b-button-group>
          <b-btn
            size="sm"
            variant="danger"
            @click="handleNoteDelete(row.item)"
            >Delete</b-btn
          >

          <b-btn variant="primary" @click="handleNoteEdit(row.item.accountId)"
            >Edit</b-btn
          >
        </b-button-group>
      </template>
    </b-table>
    <PaginationSelect
      v-model="page"
      :total-rows="notes.length"
      :per-page="limit"
      :current-page="page"
      :loading="loading"
      @onPageChange="(page) => handlePageChange(page)"
    />
  </div>
</template>

<script>
  import vuelidateMixin from '@/mixins/vuelidateMixin';
  import { minLength, maxLength, required } from 'vuelidate/lib/validators';
  import { mapMutations, mapState, mapActions } from 'vuex';
  import {
    NOTE_ADD,
    NOTE_EDIT,
    NOTE_DELETE,
  } from '@/store/mutations.types';
  import BtnCopy from '@/components/partials/BtnCopy';
  import PaginationSelect from '@/components/partials/PaginationSelect';
  import { GET_USER_NOTES } from '@/store/actions.types';

  export default {
    name: 'AccountNotes',
    components: {
      BtnCopy,
      PaginationSelect,
    },
    validations: {
      note: {
        accountId: {
          required,
          minLength: minLength(36),
          maxLength: maxLength(36),
          isAddress: (value) =>
            ['KT1', 'tz1', 'tz2', 'tz3'].some((w) => w === value.slice(0, 3)),
        },
        content: {
          required,
          minLength: minLength(1),
          maxLength: maxLength(2000),
        },
        alias: {
          required,
          minLength: minLength(1),
          maxLength: maxLength(36),
        },
        tag: {
          maxLength: maxLength(20),
        },
      },
    },
    mixins: [vuelidateMixin],
    data() {
      return {
        note: {
          accountId: '',
          alias: '',
          content: '',
          tag: '',
        },
        fields: [
          { key: 'actions', label: 'Actions' },
          { key: 'alias', label: 'Alias' },
          { key: 'tag', label: 'Tag' },
          { key: 'content', label: 'Note' },
        ],
        limit: 5,
        count: 0,
        page: 1,
        loading: false,
      };
    },
    computed: {
      ...mapState('user', ['notes', 'beaconAccount']),
    },
    methods: {
      ...mapMutations('user', [NOTE_ADD, NOTE_EDIT, NOTE_DELETE]),
      ...mapActions('user', [GET_USER_NOTES]),
      handleNoteClick() {
        this.note = {
          accountId: '',
          alias: '',
          content: '',
          tag: '',
        };
        this.$bvModal.show('add-note');
      },
      handleNoteEdit(accountId) {
        this.note = this.notes.find((item) => item.accountId === accountId);
        this.$bvModal.show('add-note');
      },
      async handleNoteDelete({ accountId }) {
        await this.$api
          .deleteUserNote({
            address: this.beaconAccount.address,
            accountId: accountId,
          })
          .then(() => {
            this[NOTE_DELETE](this.note);
          })
          .catch(() => {
            this.$bvToast.toast('Oops, something went wrong!', {
              title: this.$t('errorsNotifications.error'),
              variant: 'danger',
              autoHideDelay: 1500,
            });
          });
      },
      handleModalClose() {
        this.$v.$reset();
        this.$bvModal.hide('add-note');
      },
      async handleModalSave() {
        const noteExist = this.notes.find(
          (item) => item.accountId === this.note.accountId,
        );

        if (noteExist) {
          this[NOTE_EDIT](this.note);
        } else {
          await this.$api
            .postUserNote({
              address: this.beaconAccount.address,
              text: this.note.content,
              alias: this.note.alias,
            })
            .then(() => {
              this[NOTE_ADD](this.note);
              this.$bvToast.toast(`${this.note.alias} is added to notes`, {
                title: 'Note saved',
                variant: 'success',
                autoHideDelay: 1500,
              });
            })
            .catch(() => {
              this.$bvToast.toast('Oops, something went wrong!', {
                title: this.$t('errorsNotifications.error'),
                variant: 'danger',
                autoHideDelay: 1500,
              });
            });
        }
        this.$bvModal.hide('add-note');
      },
      handlePageChange(page) {
        this.page = page;
      },
    },
    watch: {
      beaconAccount: {
        immediate: true,
        deep: true,
        async handler({ address }) {
          if (address && !this.notes.length) {
            this.loading = true;
            await this[GET_USER_NOTES]({
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
  .notes__heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
