<template>
  <span>
    <b-button
      v-b-tooltip.hover
      title="Create a note"
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
      :id="`note-${index}`"
      size="md"
      centered
      hide-header
      @hide="handleModalClose"
    >
      <p>Create a note</p>
      <b-form-group>
        Alias
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
        Text
        <b-form-textarea
          v-model="$v.note.content.$model"
          class="form-group"
          autofocus
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
  </span>
</template>

<script>
  import vuelidateMixin from '@/mixins/vuelidateMixin';
  import { maxLength, minLength, required } from 'vuelidate/lib/validators';
  import { mapState, mapMutations } from 'vuex';
  import { NOTE_ADD, NOTE_EDIT } from '@/store/mutations.types';

  export default {
    name: 'BtnNote',
    mixins: [vuelidateMixin],
    props: {
      rowIndex: {
        type: Number,
        default: 0,
      },
      index: {
        type: Number,
        default: 0,
      },
      alias: {
        type: String,
        default: '',
      },
      accountId: {
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
          accountId: this.accountId,
          alias: this.alias || this.accountId,
          content: '',
          tag: '',
        },
      };
    },
    computed: {
      ...mapState('user', ['notes']),
      noteExist() {
        if (!this.notes.length) return false;

        const foundNote = this.notes.find(
          (item) => item.accountId === this.note.accountId,
        );

        return foundNote;
      },
    },
    methods: {
      ...mapMutations('user', [NOTE_ADD, NOTE_EDIT]),
      handleNoteClick() {
        const noteExist = this.notes.find(
          (item) => item.accountId === this.note.accountId,
        );

        if (noteExist) {
          this.handleNoteEdit();
        } else {
          this.handleNoteCreate();
        }
      },
      handleNoteCreate() {
        this.$bvModal.show(`note-${this.rowIndex}`);
      },
      handleNoteEdit() {
        this.$v.$touch();
        this.note = this.notes.find(
          (item) => item.accountId === this.note.accountId,
        );
        this.$bvModal.show(`note-${this.rowIndex}`);
      },
      handleModalSave() {
        const noteExist = this.notes.find(
          (item) => item.accountId === this.note.accountId,
        );

        if (noteExist) {
          this[NOTE_EDIT](this.note);
        } else {
          this[NOTE_ADD](this.note);
          this.$bvToast.toast(`${this.note.alias} is added to notes`, {
            title: 'Note saved',
            variant: 'success',
            autoHideDelay: 1500,
          });
        }
        this.$bvModal.hide(`note-${this.rowIndex}`);
      },
      handleModalClose() {
        this.$v.$reset();
        this.$bvModal.hide(`note-${this.rowIndex}`);
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
