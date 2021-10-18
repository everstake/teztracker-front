<template>
  <div class="items-group">
    <div :class="['group-title', { open: isOpen }]" @click="handleClick">
      <div class="title-text">
        {{ title }}
      </div>

      <div class="ml-auto">
        {{ itemsCount }}
      </div>

      <svg
        :class="['ml-3', 'arrow', { open: isOpen }]"
        width="7"
        height="10"
        viewBox="0 0 7 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.5 8.5L5.5 5L1.5 1.5"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <div class="items-wrap" :style="`height:${itemsWrapHeight}px;`">
      <a
        v-for="item in items"
        :key="item.link"
        class="nav-item"
        :href="`#${item.link}`"
        @click="$emit('click')"
      >
        {{ item.title }}
      </a>
    </div>
  </div>
</template>

<script>
  export const chartLinks = {
    general: {
      group: 'general',
      address: 'address',
      newAddress: 'newAddress',
      addressWithLowBalance: 'addressWithLowBalance',
      activeAddress: 'activeAddress',
      inactiveAddress: 'inactiveAddress',
      smartContracts: 'smartContracts',
      newSmartContract: 'newSmartContract',
    },
    efficiency: {
      group: 'efficiency',
      lostBlocks: 'lostBlocks',
      endorsements: 'endorsements',
      lostRewards: 'lostRewards',
    },
    decentralCentral: {
      group: 'decentralization_centralization',
    },
  };

  export default {
    name: 'ChartsNavItemGroup',
    props: {
      title: {
        type: String,
        required: true,
      },
      items: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        isOpen: false,
      };
    },
    computed: {
      itemsCount() {
        return Object.keys(this.items).length;
      },
      itemsWrapHeight() {
        return this.isOpen ? 37 * this.itemsCount + 10 : 0;
      },
    },
    methods: {
      handleClick() {
        this.isOpen = !this.isOpen;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .group-title {
    display: flex;
    align-items: center;

    border-radius: 4px;
    transition: 0.2s;
    cursor: pointer;

    color: white;
    font-size: 22px;
    font-weight: 500;

    padding: 5px 10px;

    &:hover {
      background: #ffffff33;
    }

    &.open {
      background: white;
      color: #309282;
    }

    .title-text {
      width: 220px;
    }

    .arrow {
      color: white;

      transition: 0.2s;

      &.open {
        color: #309282;
        transform: rotate(90deg);
      }
    }
  }

  .items-wrap {
    border-radius: 0 0 4px 4px;
    background: #ffffff33;

    transition: 0.2s;
    overflow: hidden;
  }

  .nav-item {
    display: block;
    box-sizing: border-box;

    height: 37px;
    margin: 0px 10px;
    padding: 5px 15px;

    border-radius: 4px;
    transition: 0.2s;

    font-size: 18px;
    text-decoration: none;
    color: white;

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    &:hover {
      background: #0000001a;
    }
  }
</style>
