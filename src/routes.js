import Index from "./components/pages/index.vue";
import Blocks from "./components/pages/blocks.vue";
import Block from "./components/pages/block.vue";

import Txs from "./components/pages/txs.vue";
import Tx from "./components/pages/tx.vue";

import Endorsements from "./components/pages/endorsements.vue";
import Endorsement from "./components/pages/endorsement.vue";

import Delegations from "./components/pages/delegations.vue";
import Bakers from "./components/pages/bakers.vue";
import Baker from "./components/pages/baker.vue";

import Accounts from "./components/pages/accounts.vue";
import Account from "./components/pages/account.vue";

//Errors
import NotFound from "./components/pages/404.vue";
import ServerError from "./components/pages/500.vue";

export default [
  { path: "/", name: "index", component: Index },
  { path: "/blocks", name: "blocks", component: Blocks },
  { path: "/block/:level", name: "block", component: Block },
  { path: "/txs", name: "txs", component: Txs },
  { path: "/tx/:txhash", name: "tx", component: Tx },
  { path: "/endorsements", name: "endorsements", component: Endorsements },
  { path: "/endorsement/:txID", name: "endorsement", component: Endorsement },
  { path: "/delegations", name: "delegations", component: Delegations },
  { path: "/bakers", name: "bakers", component: Bakers },
  { path: "/baker/:baker", name: "baker", component: Baker },
  { path: "/accounts", name: "accounts", component: Accounts },
  { path: "/account/:account", name: "account", component: Account },
  { path: "/404", name: "404", component: NotFound },
  { path: "/500", name: "500", component: ServerError }

];
