<template>
  <div>
    <b-card no-body xl="6" class="mb-30">
      <CardHeader>
        <template #left-content class="text">
          <h4 class="tz-title--bold">
            {{ $t('common.accountsNetwork') }}
          </h4>
        </template>
      </CardHeader>

      <div class="card-divider" />

      <b-card-body>
        <div id="cy" />
      </b-card-body>
    </b-card>

    <div v-if="targetAccount" class="info-block" :style="infoBlockStyle">
      <div class="account">
        <IdentIcon :seed="targetAccount.address" />

        <b-link
          :to="{ name: 'account', params: { account: targetAccount.address } }"
        >
          <template>
            {{ targetAccount.address | longhash }}
          </template>
        </b-link>

        <BtnCopy :text-to-copy="targetAccount.address" />
      </div>

      <div class="balance">
        <span>
          Balance:
        </span>

        <span>
          {{ targetAccount.balance | denominate }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import cytoscape from 'cytoscape';
  import style from './style';
  import layout from './layout';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import BtnCopy from '@/components/partials/BtnCopy';
  import CardHeader from '@/components/partials/CardHeader';

  function createCy(elements) {
    const cy = cytoscape({
      container: document.getElementById('cy'),
      elements,
      style,
      layout,
    });

    cy.nodes().on('mouseover', (e) => {
      e.target.connectedEdges().forEach((edge) => {
        edge.style({
          width: 1.5,
          'line-color': '#222',
          'z-index': 2,
        });
      });

      this.targetAccount = {
        address: e.target.id(),
        balance: e.target.data().balance,
      };
    });

    cy.nodes().on('mouseout', (e) => {
      e.target.connectedEdges().forEach((edge) => {
        edge.style({
          width: 0.5,
          'line-color': '#ddd',
          'z-index': 1,
        });
      });
      this.targetAccount = null;
    });

    cy.nodes().on('mousedown', () => {
      this.targetAccount = null;
    });
  }

  export default {
    name: 'NetworkGraph',
    components: {
      CardHeader,
      IdentIcon,
      BtnCopy,
    },
    data() {
      return {
        showInfo: false,
        infoBlockWidth: 270,
        infoBlockHeight: 90,
        viewPortWidth: window.innerWidth,
        viewPortHeight: window.innerHeight,
        mousePosition: {
          x: 0,
          y: 0,
        },
        infoBlockStyle: {},
        targetAccount: null,
      };
    },
    watch: {
      targetAccount() {
        this.infoBlockStyle = this.getInfoBlockStyle();
      },
    },
    mounted() {
      window.addEventListener('mousemove', this.handleMousePosition);

      this.fetch();
    },
    unmounted() {
      window.addEventListener('mousemove', this.handleMousePosition);
    },
    methods: {
      handleMousePosition(e) {
        this.mousePosition.x = e.x;
        this.mousePosition.y = e.y;
      },
      gatInfoBlockPosition() {
        const translateX =
          this.viewPortWidth - this.mousePosition.x - this.infoBlockWidth <= 0
            ? '-100%'
            : '0';

        const translateY =
          this.viewPortHeight - this.mousePosition.y - this.infoBlockHeight <= 0
            ? '-100%'
            : '0';

        return {
          left: this.mousePosition.x + 'px',
          top: this.mousePosition.y + 'px',
          transform: `translate(${translateX}, ${translateY})`,
        };
      },
      getInfoBlockStyle() {
        return {
          width: this.infoBlockWidth + 'px',
          height: this.infoBlockHeight + 'px',
          ...this.gatInfoBlockPosition(),
        };
      },
      async fetch() {
        const { data } = await this.$api.getWhaleAccounts();

        const check = {};

        const nodes = data.accounts.map((account) => {
          check[account.address] = true;

          return {
            data: {
              id: account.address,
              balance: account.balance,
            },
          };
        });

        const edges = data.transfers
          .map((transfer) => {
            if (!(check[transfer.from] && check[transfer.to])) {
              return null;
            }

            return {
              data: {
                id: transfer.from + transfer.to,
                source: transfer.from,
                target: transfer.to,
              },
            };
          })
          .filter(Boolean);

        const elements = [...nodes, ...edges];

        createCy.call(this, elements);
      },
    },
  };
</script>

<style lang="scss" scoped>
  #cy {
    width: 100%;
    height: 70vh;
    background: #3b3c41;
  }

  .info-block {
    position: absolute;

    display: flex;
    flex-direction: column;
    justify-content: center;

    gap: 10px;
    padding: 12px 0;

    background: #f0f0f1;

    box-shadow: 2px 3px 10px #1c1b1b8e;

    .account,
    .balance {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .account {
      padding-left: 12px;
    }

    .balance {
      padding-left: 12px;
      padding-right: 12px;
    }
  }
</style>
