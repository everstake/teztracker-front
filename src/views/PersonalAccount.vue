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
              @click="activeTabIndex = index"
            >
              <button
                class="nav-button"
                :class="{
                  'nav-button--active': index === activeTabIndex,
                }"
              >
                {{ tab }}
              </button>
            </li>
          </ul>
        </b-col>
        <b-col class="col" cols="12" lg="8">
          <div class="content personal-account__content">
            <div v-if="loading" class="loading">Loading</div>
            <div v-else></div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  export default {
    name: 'PersonalAccount',
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
        activeTabIndex: 0,
      };
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
