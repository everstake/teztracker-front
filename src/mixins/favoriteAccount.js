import { mapState, mapMutations } from 'vuex';
import { FAVORITE_DELETE, FAVORITE_SET } from '@/store/mutations.types';

export default {
  computed: {
    ...mapState('favorite', {
      favoriteList: (state) => state.favoriteList,
    }),
  },
  methods: {
    ...mapMutations('favorite', [FAVORITE_SET, FAVORITE_DELETE]),
    isAccountFavorite(accountId) {
      return this.favoriteList.includes(accountId);
    },
    toggleFavorite(accountId) {
      const accountFavorite = this.isAccountFavorite(accountId);

      if (accountFavorite) {
        this[FAVORITE_DELETE](accountId);
        return;
      }

      this[FAVORITE_SET](accountId);
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
    try {
      if (th) {
        th[0].click();
      }
    } catch (e) {
      console.log(e);
    }
  },
};
