<template>
  <div class="favorites">
    <h3>
      Favorites
      <button @click="handleFavoriteAdd" class="favorite__add">
        <font-awesome-icon :icon="['fa', 'plus']" />
      </button>
      <b-modal id="favorite-add" size="md" centered hide-header>
        <p>Add favorite account</p>
        <b-form-group>
          <b-form-input
            class="form-group"
            type="text"
            placeholder="Put account hash here"
            autofocus
            @input="onFavoriteAccountInput"
          >
          </b-form-input>
        </b-form-group>
        <template #modal-footer>
          <b-btn @click="closeFavoriteModal">
            Close
          </b-btn>
          <b-btn variant="success" @click="saveFavoriteModal">
            Save
          </b-btn>
        </template>
      </b-modal>
    </h3>
    <hr />
    <b-table
      responsive
      show-empty
      :items="favoriteList"
      :fields="fields"
      :current-page="page"
      :per-page="0"
      borderless
      class="transactions-table"
      :empty-text="$t('common.noData')"
      :sort-compare="sortFavoriteAccounts"
    >
      <template #cell(favorite)="row">
        {{ row }}
        <font-awesome-icon
          @click="toggleFavorite(row.item)"
          class="icon-favorite"
          :class="{
            'icon-favorite--active': isAccountFavorite(row.item),
          }"
          :icon="['fa', 'star']"
        />
      </template>
    </b-table>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import favoriteAccount from '@/mixins/favoriteAccount';

  export default {
    name: 'AccountFavorites',
    mixins: [favoriteAccount],
    data() {
      return {
        page: 1,
        favoriteModal: {
          account: '',
        },
      };
    },
    computed: {
      ...mapState('favorite', {
        favoriteList: (state) => state.favoriteList,
      }),
      fields() {
        if (!this.$i18n.locale) return [];
        return [
          {
            key: 'favorite',
            label: 'Fav',
            sortDirection: 'asc',
            thClass: 'favorite-heading',
          },
          { key: 'accountId', label: 'Account ID' },
        ];
      },
    },
    methods: {
      handleFavoriteAdd() {
        this.$bvModal.show('favorite-add');
      },
      onFavoriteAccountInput(value) {
        this.favoriteModal.account = value;
      },
      resetFavoriteModal() {
        this.favoriteModal.account = '';
      },
      closeFavoriteModal() {
        this.resetFavoriteModal();
        this.$bvModal.hide('favorite-add');
      },
      saveFavoriteModal() {
        this.$bvModal.hide('favorite-add');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .favorite__add {
    font-size: 12px;
    outline: none;
    border: none;
    background: #309282;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
  }
</style>
