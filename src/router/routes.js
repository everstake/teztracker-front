const Index = () => import('../views/Index');
/* Blocks group */
// Blocks
const Blocks = () => import('../views/Blocks.vue');
const Block = () => import('../views/Block.vue');
// Snapshots
const Snapshots = () => import('../views/Snapshots.vue');
// Baking rights
const BakingRights = () => import('../views/BakingRights.vue');
/* Blocks group end */

/* Operations group */
// Txs
const Txs = () => import('../views/Txs.vue');
const Tx = () => import('../views/Tx.vue');
// Endorsements
const Endorsements = () => import('../views/Endorsements.vue');
// Delegations
const Delegations = () => import('../views/Delegations.vue');
// Originations
const Originations = () => import('../views/Originations.vue');
// Activations
const Activations = () => import('../views/Activations.vue');
// Double baking
const DoubleBaking = () => import('../views/DoubleBaking.vue');
// Double endorsement
const DoubleEndorsement = () => import('../views/DoubleEndorsement.vue');
/* Operations group end */

// Bakers
const Bakers = () => import('../views/Bakers.vue');
const BakersPublic = () => import('../views/BakersPublic.vue');
const Baker = () => import('../views/Baker.vue');

/* Accounts group */
// Accounts
const Accounts = () => import('../views/Accounts.vue');
// import Account from "./components/pages/account.vue";
const Account = () => import('../views/Account.vue');
const TopAccounts = () => import('../views/TopAccounts.vue');
// Contracts
const Contracts = () => import('../views/Contracts.vue');
/* Accounts group end */

// Protocol amendment
const ProtocolAmendment = () => import('@/views/ProtocolAmendment.vue');
const Period = () => import('@/views/Period.vue');
const Protocols = () => import('@/views/Protocols.vue');

/* Votes group */
//Votes
const Vote = () => import('../views/Vote.vue');
/* Votes group end */

/* Charts group */
const ChartsBaking = () => import('../views/chart-views/ChartsBaking.vue');
const ChartsGeneral = () => import('../views/chart-views/ChartsGeneral.vue');
/* Charts group end */

// Errors
// TODO: Implement the logic of redirect
// const Maintenance = () => import('../views/Maintenance.vue');
const NotFound = () => import('../views/errors/NotFound.vue');
const ServerError = () => import('../views/errors/ServerError.vue');

export default [
  {
    path: '/',
    name: 'index',
    redirect: { name: 'network', params: { network: 'mainnet' } },
  },
  {
    name: 'network',
    path: '/:network',
    component: Index,
  },
  {
    name: 'blocks',
    path: '/:network/blocks',
    component: Blocks,
  },
  {
    name: 'block',
    path: '/:network/block/:level',
    component: Block,
  },
  {
    name: 'snapshots',
    path: '/:network/snapshots',
    component: Snapshots,
  },
  {
    name: 'baking_rights',
    path: '/:network/baking_rights',
    component: BakingRights,
  },
  /* Operations group */
  // Txs
  { path: '/:network/txs', name: 'txs', component: Txs },
  { path: '/:network/tx/:txhash', name: 'tx', component: Tx },
  // Endorsements
  {
    path: '/:network/endorsements',
    name: 'endorsements',
    component: Endorsements,
  },
  // Delegations
  {
    path: '/:network/delegations',
    name: 'delegations',
    component: Delegations,
  },
  // Originations
  {
    path: '/:network/originations',
    name: 'originations',
    component: Originations,
  },
  // Activations
  {
    path: '/:network/activations',
    name: 'activations',
    component: Activations,
  },
  // Double baking
  {
    path: '/:network/double_baking',
    name: 'double_baking',
    component: DoubleBaking,
  },
  // Double endorsement
  {
    path: '/:network/double_endorsement',
    name: 'double_endorsement',
    component: DoubleEndorsement,
  },
  /* Operations group end */

  // Bakers
  { path: '/:network/bakers', name: 'bakers', component: Bakers },
  {
    path: '/:network/public_bakers',
    name: 'public_bakers',
    component: BakersPublic,
  },
  { path: '/:network/baker/:baker', name: 'baker', component: Baker },

  /* Accounts group */
  // Accounts
  { path: '/:network/accounts', name: 'accounts', component: Accounts },
  { path: '/:network/account/:account', name: 'account', component: Account },
  {
    path: '/:network/top_accounts',
    name: 'top_accounts',
    component: TopAccounts,
  },
  // Contracts
  { path: '/:network/contracts', name: 'contracts', component: Contracts },
  /* Accounts group end */

  /* Governance group */
  // Votes
  {
    path: '/:network/protocol_amendment',
    redirect: { name: 'protocol_amendment' },
  },
  {
    path: '/mainnet/protocol_amendment',
    name: 'protocol_amendment',
    component: ProtocolAmendment,
  },
  { path: '/:network/protocols', redirect: { name: 'protocols' } },
  { path: '/mainnet/protocols', name: 'protocols', component: Protocols },
  { path: '/:network/period/:id', redirect: { name: 'period' } },
  { path: '/mainnet/period/:id', name: 'period', component: Period },
  { path: '/:network/vote/:voteHash', name: 'vote', component: Vote },
  /* Governance group end */

  /* Charts group */
  {
    path: '/mainnet/charts/baking',
    name: 'baking_charts',
    component: ChartsBaking,
  },
  { path: '/:network/charts/baking', redirect: { name: 'baking_charts' } },
  {
    path: '/mainnet/charts/general',
    name: 'general_charts',
    component: ChartsGeneral,
  },
  { path: '/:network/charts/general', redirect: { name: 'general_charts' } },
  /* Charts group end */

  // Errors
  // TODO: Implement the logic of redirect
  // {
  //   path: '/:network/maintenance',
  //   name: 'Maintenance',
  //   component: Maintenance,
  // },
  { path: '/:network/404', name: '404', component: NotFound },
  { path: '/:network/*', redirect: { name: '404' } },
  { path: '/:network/500', name: '500', component: ServerError },
];
