<template>
  <div class="vote__steps">
    <CardSection :fluid="true">
      <template>
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
  }

  &__list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    margin-bottom: 0;
    padding-left: 0;
    list-style: none;

    &:before {
      content: "";
      position: absolute;
      left: 30px;
      right: 30px;
      height: 1px;
      background-color: #9ea0a5;
      top: 50%;
      transform: translateY(-50%);
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
      border: 1px solid #9ea0a5;
      color: #9ea0a5;
      border-radius: 50%;
    }

    &--active:before {
      content: url("~@/assets/icons/done.svg") !important;
      border-color: #309282;
    }
  }

  &__para {
    margin-bottom: 0;
    color: #9ea0a5;

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
    }
  }
}
</style>
