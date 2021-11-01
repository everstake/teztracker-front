<template>
  <div class="wrapper" @mousemove="handleMousePosition">
    <b-card no-body xl="6" class="mb-30">
      <CardHeader>
        <template #left-content class="text">
          <h4 class="tz-title--bold">
            {{ $t('common.biggestAccountsNetwork') }}
          </h4>
        </template>
      </CardHeader>

      <div class="card-divider" />

      <b-card-body>
        <div v-if="!isReady" class="placeholder vote__loading">
          {{ $t('common.loading') }}
        </div>

        <div id="cy" :class="{ hidden: !isReady }" />
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

      <div v-if="targetAccount.balance" class="balance">
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
      ready: () => (this.isReady = true),
      minZoom: 0.5,
      maxZoom: 2,
      pan: { x: 0, y: 0 },
    });

    cy.nodes().on('mouseover', (e) => {
      e.target.connectedEdges().forEach((edge) => {
        edge.style({
          width: 1.5,
          'arrow-scale': 0.8,
          'line-color': '#222',
          'target-arrow-color': '#222',
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
          'arrow-scale': 0.3,
          'line-color': '#ddd',
          'target-arrow-color': '#ddd',
          'z-index': 1,
        });
      });
      this.targetAccount = null;
    });

    cy.nodes().on('mousedown', () => {
      this.targetAccount = null;
    });

    cy.nodes().on('mousedown', () => {
      this.targetAccount = null;
    });
  }

  export default {
    name: 'BiggestAccountsGraph',
    components: {
      CardHeader,
      IdentIcon,
      BtnCopy,
    },
    data() {
      return {
        showInfo: false,
        isReady: false,
        infoBlockWidth: 270,
        infoBlockHeight: 90,
        wrapperWidth: 0,
        wrapperHeight: 0,
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
      // window.addEventListener('mousemove', this.handleMousePosition);

      this.fetch();
    },
    // unmounted() {
    //   window.addEventListener('mousemove', this.handleMousePosition);
    // },
    methods: {
      handleMousePosition(e) {
        const rect = e.currentTarget.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.wrapperWidth = rect.width;
        this.wrapperHeight = rect.height;

        this.mousePosition.x = x;
        this.mousePosition.y = y;
      },
      gatInfoBlockPosition() {
        const translateX =
          this.wrapperWidth - this.mousePosition.x - this.infoBlockWidth <= 0
            ? '-100%'
            : '0';

        const translateY =
          this.wrapperHeight - this.mousePosition.y - this.infoBlockHeight <= 0
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

        const checkNodes = {};

        const nodes = data.accounts.map((account) => {
          checkNodes[account.address] = true;

          return {
            id: account.address,
            balance: account.balance,
          };
        });

        const countEdges = {};

        const checkEdges = {};

        const maxCountEdges = 35;

        const edges = data.transfers
          .map((transfer) => {
            const edgeId = transfer.from + transfer.to;
            const edgeIdReverse = transfer.to + transfer.from;

            if (checkEdges[edgeIdReverse] || checkEdges[edgeId]) {
              return null;
            }

            if (!(checkNodes[transfer.from] || checkNodes[transfer.to])) {
              return null;
            }

            countEdges[transfer.from] = countEdges[transfer.from]
              ? countEdges[transfer.from] + 1
              : 1;
            countEdges[transfer.to] = countEdges[transfer.to]
              ? countEdges[transfer.to] + 1
              : 1;

            if (
              countEdges[transfer.from] > maxCountEdges ||
              countEdges[transfer.to] > maxCountEdges
            ) {
              return null;
            }

            if (!(checkNodes[transfer.from] && checkNodes[transfer.to])) {
              const nodeId = checkNodes[transfer.from]
                ? transfer.to
                : transfer.from;

              checkNodes[nodeId] = true;

              nodes.push({
                id: nodeId,
                balance: 0,
              });
            }

            checkEdges[edgeId] = transfer.amount;

            return {
              id: edgeId,
              source: transfer.from,
              target: transfer.to,
              amount: transfer.amount,
            };
          })
          .filter(Boolean);

        const nodesMap = nodes.reduce(
          (acc, node) => ({
            ...acc,
            [node.id]: node,
          }),
          {},
        );

        edges.forEach((edge) => {
          const nodeSource = nodesMap[edge.source];
          const nodeTarget = nodesMap[edge.target];

          nodeSource.children = nodeSource.children
            ? [...nodeSource.children, nodeTarget]
            : [nodeTarget];

          nodeTarget.parents = nodeTarget.parents
            ? [...nodeTarget.parents, nodeSource]
            : [nodeSource];
        });

        Object.values(nodesMap).forEach((node) => {
          if (!(node.children || node.parents)) {
            delete nodesMap[node.id];
          }
        });

        const minConnections = 5;

        const filteredEdges = edges.filter((edge) => {
          const source = nodesMap[edge.source];

          if (!source) {
            delete nodesMap[edge.source];
            delete nodesMap[edge.target];
            return false;
          }

          let connections = 0;

          const checkConnections = (el, property, prev) => {
            if (connections > minConnections || !el[property]) {
              return;
            }

            el[property].forEach((inner) => {
              if (prev && inner.id === prev.id) {
                return;
              }

              connections++;

              checkConnections(inner, 'parents', el);
              checkConnections(inner, 'children', el);
            });
          };

          checkConnections(source, 'parents');
          checkConnections(source, 'children');

          if (connections < minConnections) {
            delete nodesMap[edge.source];
            delete nodesMap[edge.target];
            return false;
          }

          return true;
        });

        const preparedNodes = Object.values(nodesMap).map(
          ({ id, balance }) => ({
            data: { id, balance },
          }),
        );

        const preparedEdges = filteredEdges.map((edge) => ({ data: edge }));

        const elements = [...preparedNodes, ...preparedEdges];

        createCy.call(this, elements);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .wrapper {
    position: relative;
  }

  #cy,
  .placeholder {
    width: 100%;
    height: 70vh;
  }

  #cy {
    background: #3b3c41;
  }

  .hidden {
    visibility: hidden;
    position: absolute;
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
