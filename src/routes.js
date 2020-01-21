import Index from "./components/pages/index.vue";
import Blocks from "./components/pages/blocks.vue";
import Block from "./components/pages/block.vue";
import Snapshots from "./components/pages/snapshots.vue";
import BakingRights from "./components/pages/baking_rights.vue";

import Txs from "./components/pages/txs.vue";
import Tx from "./components/pages/tx.vue";

import Endorsements from "./components/pages/endorsements.vue";
import Endorsement from "./components/pages/endorsement.vue";

import Delegations from "./components/pages/delegations.vue";
import Bakers from "./components/pages/bakers.vue";
import Baker from "./components/pages/baker.vue";

import Accounts from "./components/pages/accounts.vue";
import Account from "./components/pages/account.vue";

import Contracts from "./components/pages/contracts.vue";
import NetworkRedirect from "./components/pages/networkredirect.vue";

import Originations from "./components/pages/originations.vue";
import Activations from "./components/pages/activations.vue";
import DoubleBaking from "./components/pages/double_baking.vue";
import DoubleEndorsement from "./components/pages/double_endorsement.vue";

//Errors
import NotFound from "./components/pages/404.vue";
import ServerError from "./components/pages/500.vue";


// src/middleware/log.js
export function setNetwork({ next, to }) {
  console.log(to.name);
  return next();
}



export default [
  { path: "/", name: "default", component: NetworkRedirect },
  { path: "/:network/", name: "index", component: Index },
  { path: "/:network/blocks", name: "blocks", component: Blocks },
  { path: "/:network/block/:level", name: "block", component: Block },
  { path: "/:network/snapshots", name: "snapshots", component: Snapshots },
  { path: "/:network/baking_rights", name: "baking_rights", component: BakingRights },
  { path: "/:network/txs", name: "txs", component: Txs },
  { path: "/:network/tx/:txhash", name: "tx", component: Tx },
  { path: "/:network/endorsements", name: "endorsements", component: Endorsements },
  { path: "/:network/endorsement/:txID", name: "endorsement", component: Endorsement },
  { path: "/:network/delegations", name: "delegations", component: Delegations },
  { path: "/:network/originations", name: "originations", component: Originations },
  { path: "/:network/activations", name: "activations", component: Activations },
  { path: "/:network/double_baking", name: "double_baking", component: DoubleBaking },
  { path: "/:network/double_endorsement", name: "double_endorsement", component: DoubleEndorsement },
  { path: "/:network/bakers", name: "bakers", component: Bakers },
  { path: "/:network/baker/:baker", name: "baker", component: Baker },
  { path: "/:network/accounts", name: "accounts", component: Accounts },
  { path: "/:network/contracts", name: "contracts", component: Contracts },
  { path: "/:network/account/:account", name: "account", component: Account },
  { path: "/404", name: "404", component: NotFound },
  { path: "/500", name: "500", component: ServerError }

];
