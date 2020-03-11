<template>
  <CardSection :fluid="true" class="margin-bottom">
      <template>
        <b-row>
          <b-col cols="12" sm="10" md="12" lg="12" xl="12" offset-cols="0" offset-sm="1" offset-md="0">
            <div class="proposal-step">
              <ul class="proposal-step__list">
                <li v-for="(period, index) of periodTypes" class="proposal-step__item font font--mini">
                  <p
                    v-if="periodStepUrls[index] === null && !loading"
                    class="proposal-step__para font font--mini"
                    :class="{
                      'proposal-step__para--disabled': loading
                    }"
                  >
                    {{ period }}
                  </p>
                  <router-link
                    v-else
                    :to="{ name: 'period',params: { id: periodStepUrls[index] || true }}"
                    :class="{
                      'proposal-step__link--active': period === currentPeriodType && !loading,
                      'proposal-step__link--disabled': loading
                    }"
                    class="proposal-step__link font font--mini"
                  >
                    {{ period }}
                  </router-link>
                </li>
              </ul>
            </div>
          </b-col>
        </b-row>
      </template>
    </CardSection>
</template>

<script>
import CardSection from "@/components/partials/CardSection";

export default {
  name: "PeriodStep",
  components: {CardSection},
  props: [
    "periodTypes",
    "currentPeriodType",
    "periodStepUrls",
    "loading"
  ],
  methods: {
    getLink(index) {
      return this.periodStepUrls[index];
    }
  }
};
</script>

<style lang="scss" scoped>
.proposal-step {
  position: relative;
  padding: 10px 0;
  background-color: #fff;

  @include from-laptop-to-desktop {
    padding: 10px;
  }

  @include from-tablet-to-laptop {
    padding: 10px;
  }

  @include from-smartphone-portrait-to-tablet {
    padding: 10px;
  }

  @include from-smartphone-to-portrait {
    padding: 10px;
  }

  @include from-smartphone {
    padding: 10px;
  }

  &:after {
    z-index: 5;
    content: "";
    display: inline-block;
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    color: #9ea0a5;
    text-transform: capitalize;

    @include max-width-tablet {
      display: none;
    }

    @include for-smartphones-portrait {
      top: 90px;
      bottom: 90px;
      left: 50%;
      transform: translateX(-50%);
      width: 1px;
      height: auto;
      background-color: #9ea0a5;
    }
  }

  &__list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    margin-bottom: 0;
    padding-left: 0;
    list-style: none;

    @include max-width-tablet {
      flex-wrap: wrap;
      flex-direction: column;
      position: relative;
      z-index: 6;
    }

    @include for-smartphones-portrait {
      position: relative;
      z-index: 6;
    }

    &:before {
      content: "";
      position: absolute;
      left: 30px;
      right: 30px;
      height: 1px;
      background-color: #9ea0a5;
      top: 50%;
      transform: translateY(-50%);

      @include max-width-tablet {
        display: none;
      }
    }
  }

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 50px;
    font-size: 20px;
    font-weight: 600;
    color: #9ea0a5;
    text-transform: uppercase;
    background-color: white;

    @include max-width-regular-laptop {
      padding: 0 30px;
    }

    @include max-width-tablet {
      min-height: auto;
      margin: 0;
      padding-top: 10px;
      padding-bottom: 10px;
    }

    @include from-smartphone-to-portrait {
      min-height: auto;
      margin: 0;
      padding: 10px;
    }

    @include from-smartphone {
      margin: 0;
      padding: 10px;
    }

    &:nth-child(1) .proposal-step__link:before,
    &:nth-child(1) .proposal-step__para:before {
      content: "1";
    }

    &:nth-child(2) .proposal-step__link:before,
    &:nth-child(2) .proposal-step__para:before {
      content: "2";
    }

    &:nth-child(3) .proposal-step__link:before,
    &:nth-child(3) .proposal-step__para:before {
      content: "3";
    }

    &:nth-child(4) .proposal-step__link:before,
    &:nth-child(4) .proposal-step__para:before {
      content: "4";
    }
  }

  &__link {
    color: #309282;

    @include max-width-tablet {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 18px;
      padding-top: 60px;
      padding-bottom: 0;
    }

    @include for-smartphones-portrait {
      padding-top: 60px;
      padding-bottom: 0;
      font-size: 16px;
    }

    @include for-tablet-ipad-portrait {
      font-weight: 400;
    }

    @include max-width-regular-laptop {
      font-weight: 400;
    }

    @include max-width-tablet {
      padding-top: 0;
      font-weight: 400;
    }

    &:hover {
      text-decoration: none;
    }

    &:before {
      position: relative;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 35px;
      height: 35px;
      margin-right: 10px;
      font-size: 16px;
      font-weight: 400;
      color: #309282;
      border: 1px solid #309282;
      border-radius: 50%;

      @include max-width-regular-laptop {
        display: none;
      }

      @include max-width-tablet {
        display: none;
      }
    }

    &--active {
      @include max-width-regular-laptop {
        font-weight: 600;
      }

      @include for-tablet-ipad-portrait {
        font-weight: 600;
      }

      @include from-smartphone-portrait-to-tablet {
        font-weight: 600;
      }
    }

    &--active:before {
      content: url("~@/assets/icons/done.svg") !important;
      border-color: #309282;
    }

    &--disabled {
      color: #9ea0a5;
      user-select: none;
      cursor: text;
      pointer-events: none;

      &:before {
        color: #9ea0a5;
        border-color: #9ea0a5;
      }
    }
  }

  &__para {
    margin-bottom: 0;
    color: #9ea0a5;

    @include max-width-tablet {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 18px;
    }

    &:before {
      position: relative;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      font-weight: lighter;
      font-size: 16px;
      width: 35px;
      height: 35px;
      border: 1px solid #9ea0a5;
      color: #9ea0a5;
      border-radius: 50%;

      @include max-width-regular-laptop {
        display: none;
      }

      @include max-width-tablet {
        display: none;
      }

      @include for-smartphones-portrait {
        display: none;
      }
    }

    @include for-smartphones-portrait {
      font-size: 16px;
    }

    @include for-tablet-ipad-portrait {
      font-weight: 400;
    }

    @include max-width-regular-laptop {
      font-weight: 400;
    }

    @include max-width-tablet {
      font-weight: 600;
    }

    &--disabled {
      color: #9ea0a5;
      user-select: none;
      cursor: text;
      pointer-events: none;

      &:before {
        border-color: #9ea0a5;
      }
    }
  }
}
</style>
