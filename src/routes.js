const Index = () => import("./components/pages/Index.vue");

/* Blocks group */
// Blocks
const Blocks = () => import("./components/pages/Blocks.vue");
const Block = () => import("./components/pages/Block.vue");
// Snapshots
const Snapshots = () => import("./components/pages/Snapshots.vue");
// Baking rights
const BakingRights = () => import("./components/pages/BakingRights.vue");
/* Blocks group end */

/* Operations group */
// Txs
const Txs = () => import("./components/pages/Txs.vue");
const Tx = () => import("./components/pages/Tx.vue");
// Endorsements
const Endorsements = () => import("./components/pages/Endorsements.vue");
const Endorsement = () => import("./components/pages/Endorsement.vue");
// Delegations
const Delegations = () => import("./components/pages/Delegations.vue");
// Originations
const Originations = () => import("./components/pages/Originations.vue");
// Activations
const Activations = () => import("./components/pages/Activations.vue");
// Double baking
const DoubleBaking = () => import("./components/pages/DoubleBaking.vue");
// Double endorsement
const DoubleEndorsement = () =>
  import("./components/pages/DoubleEndorsement.vue");
/* Operations group end */

// Bakers
const Bakers = () => import("./components/pages/Bakers.vue");
const Baker = () => import("./components/pages/Baker.vue");

/* Accounts group */
// Accounts
const Accounts = () => import("./components/pages/Accounts.vue");
// import Account from "./components/pages/account.vue";
const Account = () => import("./components/pages/Account.vue");
// Contracts
const Contracts = () => import("./components/pages/Contracts.vue");
/* Accounts group end */

// Errors
const NotFound = () => import("./components/pages/errors/NotFound.vue");
const ServerError = () => import("./components/pages/errors/ServerError.vue");

export default [
  { path: "/", name: "default", redirect: "/mainnet" },
  { path: "/:network/", name: "index", component: Index },

  /* Blocks group */
  // Blocks
  { path: "/:network/blocks", name: "blocks", component: Blocks },
  { path: "/:network/block/:level", name: "block", component: Block },
  // Snapshots
  { path: "/:network/snapshots", name: "snapshots", component: Snapshots },
  // Baking rights
  {
    path: "/:network/baking_rights",
    name: "baking_rights",
    component: BakingRights
  },
  /* Blocks group end */

  /* Operations group */
  // Txs
  { path: "/:network/txs", name: "txs", component: Txs },
  { path: "/:network/tx/:txhash", name: "tx", component: Tx },
  // Endorsements
  {
    path: "/:network/endorsements",
    name: "endorsements",
    component: Endorsements
  },
  {
    path: "/:network/endorsement/:txID",
    name: "endorsement",
    component: Endorsement
  },
  // Delegations
  {
    path: "/:network/delegations",
    name: "delegations",
    component: Delegations
  },
  // Originations
  {
    path: "/:network/originations",
    name: "originations",
    component: Originations
  },
  // Activations
  {
    path: "/:network/activations",
    name: "activations",
    component: Activations
  },
  // Double baking
  {
    path: "/:network/double_baking",
    name: "double_baking",
    component: DoubleBaking
  },
  // Double endorsement
  {
    path: "/:network/double_endorsement",
    name: "double_endorsement",
    component: DoubleEndorsement
  },
  /* Operations group end */

  // Bakers
  { path: "/:network/bakers", name: "bakers", component: Bakers },
  { path: "/:network/baker/:baker", name: "baker", component: Baker },

  /* Accounts group */
  // Accounts
  { path: "/:network/accounts", name: "accounts", component: Accounts },
  { path: "/:network/account/:account", name: "account", component: Account },
  // Contracts
  { path: "/:network/contracts", name: "contracts", component: Contracts },
  /* Accounts group end */

  // Errors
  { path: "/404", name: "404", component: NotFound },
  { path: "/500", name: "500", component: ServerError },
  { path: "*", redirect: "/404" }
];
