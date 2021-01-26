import Vue from 'vue';
import { mapState, mapMutations } from 'vuex';
import {FAVORITE_DELETE, FAVORITE_SET} from '@/store/mutations.types';

export default {
  computed: {
    ...mapState('user', {
      favorites: (state) => state.favorites,
    }),
  },
  methods: {
    ...mapMutations('user', [FAVORITE_SET, FAVORITE_DELETE]),
    isAccountFavorite(accountId) {
      return this.favorites.includes(accountId);
    },
    toggleFavorite(accountId, accountName) {
      const accountFavorite = this.isAccountFavorite(accountId);

      if (accountFavorite) {
        this.$bvModal
          .msgBoxConfirm('Are you sure?')
          .then(async (confirmed) => {
            if (confirmed) {
              this[FAVORITE_DELETE](accountId);
            }
          })
          .catch(() => {});
        return;
      }
      if (this.favorites.length >= 50) {
        this.$bvToast.toast('You have been selected 50/50 favorite addresses', {
          title: 'Limit has been reached',
          variant: 'danger',
          autoHideDelay: 1500,
        });
      } else {
        this[FAVORITE_SET](accountId);
        this.printNotification(accountId, accountName);
      }
    },
    printNotification(id, name) {
      const alias = name ? name : Vue.prototype.$helpers.truncateHash(id);

      this.$bvToast.toast(`${alias} is added to favorites`, {
        title: `Favorite added (${this.favorites.length}/50)`,
        variant: 'success',
        autoHideDelay: 1500,
      });
    },
  },
  mounted() {
    const th = document.getElementsByClassName('favorite-heading');
    try {
      if (th) {
        th[0].click();
      }
    } catch (e) {
      // eslint-disable-next-line
      console.log(e);
    }
  },
};
