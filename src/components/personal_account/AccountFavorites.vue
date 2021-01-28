<template>
  <div class="favorites">
    <div class="favorites__header">
      <h3>
        Favorites
        <span v-if="favorites.length">({{ favorites.length }}/50)</span>
      </h3>

      <b-btn
        variant="success"
        @click="handleFavoriteAdd"
        :disabled="favorites.length >= 50"
      >
        <font-awesome-icon :icon="['fa', 'plus']" /> Favorite
      </b-btn>
    </div>
    <b-modal
      id="favorite-add"
      size="md"
      centered
      hide-header
      @hide="handleModalClose"
    >
      <p>Add favorite account by id</p>
      <b-form-group>
        <b-form-input
          class="form-group"
          type="text"
          placeholder="Account id"
          autofocus
          v-model="$v.address.$model"
          :state="validateState('address')"
        >
        </b-form-input>
        <b-form-invalid-feedback
          v-if="!$v.address.isAddress"
          id="input-1-live-feedback"
          >Account id must starts with KT1, tz1, tz2 or tz3
          symbols.</b-form-invalid-feedback
        >
        <b-form-invalid-feedback id="input-1-live-feedback"
          >This field must be 36 characters.</b-form-invalid-feedback
        >
      </b-form-group>
      <template #modal-footer>
        <b-btn @click="handleModalClose">
          Close
        </b-btn>
        <b-btn
          variant="success"
          @click="handleModalSave"
          :disabled="!validateState('address')"
        >
          Save
        </b-btn>
      </template>
    </b-modal>
    <hr />
    <div v-if="loading" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="5"
        :columns="2"
        :table-props="{ borderless: true, responsive: true }"
        animation="none"
        class="table-skeleton"
      />
    </div>
    <b-table
      responsive
      show-empty
      :items="favorites"
      :fields="fields"
      borderless
      class="transactions-table profile-table"
      :empty-text="$t('common.noData')"
      :per-page="limit"
      :current-page="page"
    >
      <template #cell(favorite)="row">
        <font-awesome-icon
          class="icon-favorite cursor-text"
          :class="{
            'icon-favorite--active': isAccountFavorite({
              accountId: row.item.accountId,
            }),
          }"
          :icon="['fa', 'star']"
        />
      </template>
      <template #cell(accountId)="row">
        <router-link
          v-if="row.item.accountType === 'baker'"
          :to="{
            name: 'baker',
            params: { network: getAppNetwork, baker: row.item.accountId },
          }"
        >
          {{ row.item.accountName }}
        </router-link>
        <router-link
          v-else-if="row.item.accountType === 'account'"
          :to="{
            name: 'account',
            params: { network: getAppNetwork, account: row.item.accountId },
          }"
        >
          {{ row.item.accountId }}
        </router-link>
        <div v-else>
          {{ row.item.accountId }}
          <BtnCopy :text-to-copy="row.item.accountId" />
        </div>
      </template>
      <template #cell(actions)="row">
        <b-button-group>
          <b-btn
            size="sm"
            variant="danger"
            @click="handleFavoriteDelete(row.item.accountId)"
            >Delete</b-btn
          >
        </b-button-group>
      </template>
    </b-table>
    <PaginationSelect
      v-model="page"
      :total-rows="favorites.length"
      :per-page="limit"
      :current-page="page"
      :loading="loading"
      @onPageChange="(page) => handlePageChange(page)"
    />
  </div>
</template>

<script>
  import { mapState, mapMutations, mapGetters } from 'vuex';
  import { FAVORITE_DELETE, FAVORITE_SET } from '@/store/mutations.types';
  import favoriteAccount from '@/mixins/favoriteAccount';
  import vuelidateMixin from '@/mixins/vuelidateMixin';
  import { required, minLength, maxLength } from 'vuelidate/lib/validators';
  import BtnCopy from '@/components/partials/BtnCopy';
  import PaginationSelect from '@/components/partials/PaginationSelect';

  export default {
    name: 'AccountFavorites',
    components: { BtnCopy, PaginationSelect },
    mixins: [favoriteAccount, vuelidateMixin],
    validations: {
      address: {
        required,
        minLength: minLength(36),
        maxLength: maxLength(36),
        isAddress: (value) =>
          ['KT1', 'tz1', 'tz2', 'tz3'].some((w) => w === value.slice(0, 3)),
      },
    },
    data() {
      return {
        address: '',
        limit: 5,
        count: 0,
        page: 1,
        loading: false,
      };
    },
    computed: {
      ...mapState('user', ['favorites']),
      ...mapGetters('app', ['getAppNetwork']),
      fields() {
        if (!this.$i18n.locale) return [];
        return [
          {
            key: 'favorite',
            label: 'Fav',
            sortDirection: 'asc',
            thClass: 'favorite-heading',
          },
          { key: 'accountId', label: 'Address' },
          { key: 'actions', label: 'Actions' },
        ];
      },
    },
    methods: {
      ...mapMutations('user', [FAVORITE_SET]),
      handleFavoriteAdd() {
        this.$bvModal.show('favorite-add');
      },
      handleModalSave() {
        const addressAlreadyFavorite = this.favorites.includes(
          (fav) => fav.accountId === this.address,
        );
        if (addressAlreadyFavorite) {
          this.$bvToast.toast('This address has already been added.', {
            title: 'Favorite address',
            variant: 'danger',
            autoHideDelay: 5000,
          });
          return;
        }
        this[FAVORITE_SET]({ accountId: this.address });
        this.$bvToast.toast(
          `${this.$helpers.truncateHash(this.address)} is added to favorites`,
          {
            title: `Favorite added (${this.favorites.length}/50)`,
            variant: 'success',
            autoHideDelay: 1500,
          },
        );
        this.$bvModal.hide('favorite-add');
      },
      handleModalClose() {
        this.address = '';
        this.$v.$reset();
        this.$bvModal.hide('favorite-add');
      },
      handlePageChange(page) {
        this.page = page;
      },
      handleFavoriteDelete(accountId) {
        this.$bvModal
          .msgBoxConfirm('Are you sure?')
          .then(async (confirmed) => {
            if (confirmed) {
              this[FAVORITE_DELETE](accountId);
            }
          })
          .catch(() => {});
      },
    },
  };
</script>

<style lang="scss" scoped>
  .favorites__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
