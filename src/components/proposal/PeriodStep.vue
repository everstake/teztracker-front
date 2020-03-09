<template>
  <div class="vote__steps">
    <CardSection :fluid="true">
      <template>
        <b-row>
          <b-col cols="12" sm="10" md="12" lg="12" xl="12" offset-cols="0" offset-sm="1" offset-md="0">
            <div class="proposal-step">
              <ul class="proposal-step__list">
                <li v-for="(period, index) of periodTypes" class="proposal-step__item">
                  <p v-if="periodStepUrls[index] === null" class="proposal-step__para">
                    {{ period }}
                  </p>
                  <router-link
                    v-else
                    :to="{name: 'period',params: { id: periodStepUrls[index] }}"
                    :class="{'proposal-step__link--active': period === currentPeriodType}"
                    class="proposal-step__link"
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
  </div>
</template>

<script>
import CardSection from "@/components/partials/CardSection";

export default {
  name: "PeriodStep",
  components: {CardSection},
  props: ["periodTypes", "currentPeriodType", "periodStepUrls"],
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
  padding: 40px 30px;
  background-color: #fff;

  @include max-width-tablet {
    /*padding: 20px 30px;*/
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
      top: 90px;
      bottom: 90px;
      left: 50%;
      transform: translateX(-50%);
      width: 1px;
      height: auto;
      background-color: #9ea0a5;
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
    min-height: 70px;
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 25px;
    font-size: 20px;
    font-weight: 600;
    color: #9ea0a5;
    text-transform: uppercase;
    background-color: white;

    @include max-width-regular-laptop {
      padding: 0 10px;
    }

    @include max-width-tablet {
      min-height: auto;
      margin: 25px;
      padding-top: 25px;
      padding-bottom: 25px;
    }

    @include for-smartphones-portrait {
      min-height: auto;
      margin: 25px;
      padding-top: 25px;
      padding-bottom: 25px;
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
      font-size: 18px;
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
      font-weight: 600;
    }

    &:hover {
      text-decoration: none;
    }

    &:before {
      position: relative;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      margin-right: 30px;
      font-weight: lighter;
      font-size: 28px;
      width: 70px;
      height: 70px;
      border: 1px solid #309282;
      color: #309282;
      border-radius: 50%;

      @include max-width-regular-laptop {
        display: none;
      }

      @include max-width-tablet {
        position: absolute;
        margin: 0;
        top: 0;
        left: 50%;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
        transform: translateX(-50%);
        font-size: 18px;
        font-weight: lighter;
        border: 1px solid #309282;
      }

      @include for-smartphones-portrait {
        position: absolute;
        top: 0;
        left: 50%;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
        transform: translateX(-50%);
        font-weight: lighter;
        border: 1px solid #309282;
      }
    }

    &--active {
      @include max-width-regular-laptop {
        font-weight: 600;
      }

      @include for-tablet-ipad-portrait {
        font-weight: 600;
      }
    }

    &--active:before {
      content: url("~@/assets/icons/done.svg") !important;
      border-color: #309282;
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
      margin-right: 30px;
      font-weight: lighter;
      font-size: 28px;
      width: 70px;
      height: 70px;
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
  }
}
</style>
