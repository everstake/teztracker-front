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
                  'nav-button--disabled': !allowedTabIndexes.includes(index),
                }"
              >
                {{ tab }}
              </button>
            </li>
          </ul>
        </b-col>
        <b-col class="col" cols="12" lg="8">
          <div class="content personal-account__content">
            <AccountProfile v-if="currentTabIndex === 0" />
            <AccountFavorites v-if="currentTabIndex === 3" />
            <AccountSettings v-else-if="currentTabIndex === 5" />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import AccountProfile from '@/components/personal_account/AccountProfile';
  import AccountFavorites from '@/components/personal_account/AccountFavorites';
  import AccountSettings from '@/components/personal_account/AccountSettings';

  export default {
    name: 'PersonalAccount',
    components: { AccountProfile, AccountSettings, AccountFavorites },
    data() {
      return {
        loading: true,
        tabslist: [
          'My profile',
          'Accounts & Notifications',
          'My operations',
          'Favourites',
          'Notes',
          'Settings',
        ],
        currentTabIndex: 3,
        allowedTabIndexes: [3, 5],
      };
    },
    methods: {
      handleTabChange(index) {
        const tabNotDisabled = this.allowedTabIndexes.includes(index);

        if (tabNotDisabled) {
          this.currentTabIndex = index;
        }
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
    padding-top: 10px;
    padding-bottom: 10px;
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
</style>
