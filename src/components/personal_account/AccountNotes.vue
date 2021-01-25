<template>
  <div class="notes">
    <div class="notes__heading">
      <h3>
        Notes
        <span v-if="notes.length">({{ notes.length }}/50)</span>
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
      id="note-add"
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
          placeholder="Account id"
          :state="validateState('note.accountId')"
          autofocus
          :disabled="notes.find((item) => item.text === note.accountId)"
        >
        </b-form-input>
        <b-form-invalid-feedback
          v-if="!$v.note.accountId.isAddress"
          id="input-1-live-feedback"
          >Account id must starts with KT1, tz1, tz2 or tz3
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
          placeholder="Alias"
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
        :columns="4"
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
      <template #cell(text)="row">
        <div class="d-flex">
          {{ $helpers.truncateHash(row.item.text, 3, -5) }}
          <BtnCopy :text-to-copy="row.item.text" />
        </div>
      </template>
      <template #cell(tag)="row">
        {{ row.item.tag || '-' }}
      </template>
      <template #cell(description)="row">
        {{ row.item.description }}
      </template>
      <template #cell(balance)="row">
        <span v-if="row.item.balance">
          {{ row.item.balance | denominate }}
        </span>
        <span v-else>-</span>
      </template>
      <template #cell(actions)="row">
        <b-button-group>
          <b-btn size="sm" variant="danger" @click="handleNoteDelete(row)"
            >Delete</b-btn
          >

          <b-btn size="sm" variant="primary" @click="handleNoteEdit(row)">Edit</b-btn>
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
  import { NOTE_ADD, NOTE_EDIT, NOTE_DELETE } from '@/store/mutations.types';
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
          { key: 'tag', label: 'Tag', sortable: true, thClass: 'notes__tag' },
          { key: 'text', label: 'Address' },
          { key: 'alias', label: 'Alias' },
          { key: 'description', label: 'Notes' },
          { key: 'balance', label: 'Balance' },
        ],
        limit: 5,
        count: 0,
        page: 1,
        loading: true,
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
        this.$bvModal.show('note-add');
      },
      handleNoteEdit(row) {
        const foundNote = this.notes.find((item) => item.text === row.item.text);

        const note = {
          accountId: foundNote.text,
          alias: foundNote.alias || '',
          content: foundNote.description || '',
          tag: foundNote.tag || '',
        };
        this.note = note;
        this.$bvModal.show('note-add');
      },
      async handleNoteDelete({ item }) {
        await this.$api
          .deleteUserNote({
            address: this.beaconAccount.address,
            text: item.text,
          })
          .then(() => {
            this[NOTE_DELETE]({ accountId: item.accountId });
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
        this.$bvModal.hide('note-add');
      },
      async handleModalSave() {
        await this.$api
          .postUserNote({
            address: this.beaconAccount.address,
            text: this.note.accountId,
            description: this.note.content,
            alias: this.note.alias,
            tag: this.note.tag,
          })
          .then(async () => {
            await this[GET_USER_NOTES]({
              address: this.beaconAccount.address,
            });
            this.$bvModal.hide('note-add');
            this.$bvToast.toast(`${this.accountName ? this.accountName : this.$helpers.truncateHash(this.accountId, 8, -5)} saved`, {
              title: `Note saved (${this.notes.length}/50)`,
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
          if (address) {
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

  ::v-deep .notes__tag {
    position: relative;
  }
</style>
