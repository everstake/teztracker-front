<template>
  <div class="proposal-step">
    <ul class="proposal-step__list">
      <li
        v-for="period of periodsTypes"
        class="proposal-step__item"
        :class="period === type ? 'proposal-step__item--active' : ''"
      >
        {{ period }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ProposalPeriodStep',
  props: ['type'],
  data: () => ({
    periodsTypes: ['proposal', 'exploration', 'testing', 'promotion']
  })
};
</script>

<style lang="scss" scoped>
.proposal-step {
  position: relative;
  padding: 40px 30px;
  background-color: #fff;

  &:after {
    z-index: 5;
    content: '';
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
  }

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: 600;
    color: #9ea0a5;
    text-transform: uppercase;
    cursor: pointer;

    &:nth-child(1):before {
      content: '1'
    }

    &:nth-child(2):before {
      content: '2'
    }

    &:nth-child(3):before {
      content: '3'
    }

    &:nth-child(4):before {
      content: '4'
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
      border-radius: 50%;
    }

    &--active {
      color: #309282;

      &:before {
        border-color: #309282;
      }
    }
  }
}
</style>
