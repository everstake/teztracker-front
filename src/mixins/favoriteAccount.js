import { mapState, mapMutations } from 'vuex';
import { FAVORITE_DELETE, FAVORITE_SET } from '@/store/mutations.types';

export default {
  computed: {
    ...mapState({
      favoriteAccounts: (state) => state.favorite.account,
    }),
  },
  methods: {
    ...mapMutations('favorite', [FAVORITE_SET, FAVORITE_DELETE]),
    isAccountFavorite(accountId) {
      return this.favoriteAccounts.find((favorite) => favorite === accountId);
    },
    toggleFavorite(accountId) {
      const accountFavorite = this.isAccountFavorite(accountId);
      const payload = { account: accountId };

      if (accountFavorite) {
        this[FAVORITE_DELETE](payload);
        return;
      }

      this[FAVORITE_SET](payload);
    },
    sortFavoriteAccounts(a, b, key) {
      if (key === 'favorite') {
        if (!this.isAccountFavorite(a.accountId)) {
          return 1;
        } else if (!this.isAccountFavorite(b.accountId)) {
          return -1;
        } else {
          return 0;
        }
      } else {
        return false;
      }
    },
  },
  mounted() {
    const th = document.getElementsByClassName('favorite-heading');
    if (th) {
      th[0].click();
    }
  },
};
