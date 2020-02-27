<template>
  <div>
    <footer class="footer">
      <div v-if="showLogo" class="footer__logo">
        <Logo />
      </div>
      <div class="footer__description">
        <div class="copyright">© {{ currentYear }} TZ Tracker. All rights reserved.</div>
        <div class="contacts">
          <a href="mailto:inbox@everstake.one" class="contacts__item">
            <i class="far fa-envelope"></i> Contact Us
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Logo from "../icons/logo";

export default {
  name: "Footer",
  components: { Logo },
  props: {
    showLogo: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
};
</script>

<style lang="scss" scoped>


.footer {
  padding: 15px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;

  &__description {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column-reverse;

    font-size: 16px;
    font-weight: 500;
    line-height: 2;
    color: #2d2e2c;
    @include for-tablet-portrait-up {
      flex-direction: row;
    }
    @include for-phone-only {
      text-align: center;
    }
  }

  .contacts {
    text-align: center;

    a {
      text-decoration: none;
      color: #2d2e2c;
      cursor: pointer;
      &:hover {
        text-decoration: none;
        color: #309282;
      }
    }

    i {
      font-size: 20px;
      margin-right: 6px;
      vertical-align: sub;
    }
  }
  &__logo {
    padding: 15px;
    @include for-tablet-portrait-up {
      display: none;
    }
  }
}
</style>
