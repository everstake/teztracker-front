<template>
  <div class="personal-account">
    <b-container>
      <b-row>
        <b-col class="col" cols="12" lg="3">
          <ul class="nav personal-account__nav">
            <li
              v-for="(tab, index) in tabslist"
              :key="tab + index"
              class="nav__item"
            >
              <button
                @click="handleTabChange(index)"
                class="nav-button"
                :class="{
                  'nav-button--active': index === currentTabIndex,
                }"
              >
                {{ tab }}
              </button>
            </li>
            <li class="nav__item text-center">
              <button class="nav-button button-logout" @click="handleSignOut">
                Sign out
              </button>
            </li>
          </ul>
        </b-col>
        <b-col class="col pl-0 pr-0" cols="12" lg="8">
          <div class="content personal-account__content">
            <router-view />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex';
  import { SET_BEACON_ACCOUNT } from '@/store/mutations.types';

  export default {
    name: 'PersonalAccount',
    data() {
      return {
        loading: true,
        tabslist: [
          'My profile',
          'Accounts & Notifications',
          'My operations',
          'Favorites',
          'Notes',
          'Settings',
        ],
        tabsRoutes: [
          'account_profile',
          'account_notifications',
          'account_operations',
          'account_favorites',
          'account_notes',
          'account_settings',
        ],
        currentTabIndex: 0,
      };
    },
    watch: {
      $route: {
        immediate: true,
        handler(to) {
          const foundIndex = this.tabsRoutes.findIndex((route) => route === to.name);

          if (foundIndex > -1) {
            this.currentTabIndex = foundIndex;
          }
        },
      },
    },
    methods: {
      ...mapMutations('user', [SET_BEACON_ACCOUNT]),
      handleTabChange(index) {
        this.$router.push({ name: this.tabsRoutes[index] });
      },
      handleSignOut() {
        this.$beacon.resetConnection();
        this[SET_BEACON_ACCOUNT]({});
        this.$router.push({ name: 'network' });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .personal-account {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }

  .col {
    align-self: flex-start;
    margin-left: 20px;
    background-color: #fff;
  }

  .personal-account__nav {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .personal-account__content {
    min-height: 350px;
    padding: 10px 15px;
  }

  .nav__item {
    display: block;
    width: 100%;
  }

  .nav-button {
    color: #309282;
    text-decoration: none;
    background-color: transparent;
    outline: none;
    border: none;
    line-height: 2;
    padding: 10px 0;
    width: 100%;
    display: block;
  }

  .nav-button:hover,
  .nav-button--active {
    font-weight: bold;
    transition: font-weight 100ms ease-out;
  }

  .nav-button--disabled,
  .nav-button--disabled:hover {
    font-weight: 400;
    color: rgba(0, 0, 0, 0.3);
    transition: none;
    cursor: text;
    user-select: none;
  }

  .loading {
    position: relative;

    &:after {
      position: absolute;
      overflow: hidden;
      display: inline-block;
      vertical-align: bottom;
      animation: ellipsis steps(4, end) 900ms infinite;
      content: '\2026';
      width: 0;
    }
  }

  .button-logout {
    display: inline-block;
    width: auto;
    color: red;
  }
</style>
