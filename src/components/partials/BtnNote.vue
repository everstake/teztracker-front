<template>
  <span v-if="isBeaconAccountSet">
    <b-button
      v-b-tooltip.hover
      :title="noteExist ? 'Edit a note' : 'Create a note'"
      variant="icon"
      class="py-0 btn-note"
      @click="handleNoteClick"
      :disabled="notes.length >= 50"
    >
      <font-awesome-icon
        class="icon-note"
        :class="{
          'icon-note--saved': noteExist,
        }"
        :icon="['fa', 'pencil-alt']"
      />
    </b-button>
    <b-modal
      :id="`note-${accountId}`"
      size="md"
      centered
      hide-header
      @hide="handleModalClose"
    >
      <p>{{ noteExist ? 'Edit a note' : 'Create a note' }}</p>
      <b-form-group>
        Alias
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
        Text
        <b-form-textarea
          v-model="$v.note.content.$model"
          class="form-group"
          placeholder="Note"
          rows="6"
          :state="validateState('note.content')"
          autofocus
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
  </span>
</template>

<script>
  import vuelidateMixin from '@/mixins/vuelidateMixin';
  import { maxLength, minLength, required } from 'vuelidate/lib/validators';
  import {mapState, mapMutations, mapGetters} from 'vuex';
  import { NOTE_ADD, NOTE_EDIT } from '@/store/mutations.types';

  export default {
    name: 'BtnNote',
    mixins: [vuelidateMixin],
    props: {
      index: {
        type: Number,
        default: 0,
      },
      accountId: {
        type: String,
        default: '',
      },
      accountName: {
        type: String,
        default: '',
      },
    },
    validations: {
      note: {
        alias: {
          required,
          minLength: minLength(1),
          maxLength: maxLength(36),
        },
        content: {
          required,
          minLength: minLength(1),
          maxLength: maxLength(2000),
        },
      },
    },
    data() {
      return {
        note: {
          alias: '',
          content: '',
        },
      };
    },
    computed: {
      ...mapState('user', ['notes', 'beaconAccount']),
      ...mapGetters('user', ['isBeaconAccountSet']),
      noteExist() {
        if (!this.notes.length) return false;

        const foundNote = this.notes.find(
          (item) => item.address === this.accountId,
        );

        return foundNote;
      },
    },
    methods: {
      ...mapMutations('user', [NOTE_ADD, NOTE_EDIT]),
      handleNoteClick() {
        const noteExist = this.notes.find(
          (item) => item.address === this.accountId,
        );

        if (noteExist) {
          this.handleNoteEdit(noteExist);
        } else {
          this.handleNoteCreate();
        }
      },
      handleNoteCreate() {
        this.note.alias = this.accountName || this.accountId;
        this.note.content = '';
        this.$bvModal.show(`note-${this.accountId}`);
      },
      handleNoteEdit(note) {
        this.note.alias = note.alias || note.text;
        this.note.content = note.description || '';
        this.$bvModal.show(`note-${this.accountId}`);
      },
      async handleModalSave() {
        await this.$api
          .postUserNote({
            address: this.beaconAccount.address,
            text: this.accountId,
            description: this.note.content,
            alias: this.note.alias,
          })
          .then(() => {
            this[NOTE_ADD]({
              text: this.accountId,
              description: this.note.content,
              alias: this.note.alias,
            });
            this.$eventBus.$emit('onNoteSave', {accountId: this.accountId, alias: this.note.alias});
            this.$bvModal.hide(`note-${this.accountId}`);
            this.$bvToast.toast(`${this.note.alias ? this.note.alias : this.accountName ? this.accountName : this.$helpers.truncateHash(this.accountId, 8, -5)} saved`, {
              title: `Note saved (${this.notes.length}/50)`,
              variant: 'success',
              autoHideDelay: 1500,
            });
          })
          .catch((e) => {
            // eslint-disable-next-line
            console.log(e);
            this.$bvToast.toast('Oops, something went wrong!', {
              title: this.$t('errorsNotifications.error'),
              variant: 'danger',
              autoHideDelay: 1500,
            });
          });
      },
      handleModalClose() {
        this.$bvModal.hide(`note-${this.accountId}`);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .btn--copy {
    color: $color-brand;

    &:hover {
      color: darken($color-brand, 10%);
    }
  }
</style>
