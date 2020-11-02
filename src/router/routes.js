import { translation } from '@/plugins/translation';
import { state as applicationState } from '@/store/modules/app.module';

const PageContentContainer = () => import('@/layouts/PageContentContainer');
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
const Account = () => import('../views/Account.vue');
const TopAccounts = () => import('../views/TopAccounts.vue');
// Contracts
const Contracts = () => import('../views/Contracts.vue');
const Assets = () => import('../views/Assets.vue');
const Asset = () => import('../views/Asset.vue');
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

const Glossary = () => import('../views/Glossary.vue');

// Errors
const Maintenance = () => import('../views/Maintenance.vue');
const NotFound = () => import('../views/errors/NotFound.vue');
const ServerError = () => import('../views/errors/ServerError.vue');

export default [
  {
    path: '/',
    name: 'index',
    redirect() {
      const userLanguage = translation.getUserLang().langNoISO;
      return `${userLanguage}/${applicationState.network}`;
    },
  },
  {
    path: '/:language',
    redirect() {
      const userLanguage = translation.getUserLang().langNoISO;
      return `${userLanguage}/${applicationState.network}`;
    },
  },
  {
    path: '/:language/:network',
    component: PageContentContainer,
    children: [
      {
        path: '',
        name: 'network',
        component: Index,
      },
      /* Blocks group */
      {
        name: 'blocks',
        path: 'blocks/:page?',
        component: Blocks,
      },
      {
        name: 'block',
        path: 'block/:level',
        component: Block,
      },
      {
        name: 'snapshots',
        path: 'snapshots/:page?',
        component: Snapshots,
      },
      {
        name: 'baking_rights',
        path: 'baking_rights',
        component: BakingRights,
      },
      /* Blocks group end */

      /* Operations group */
      // Txs
      { path: 'txs/:page?', name: 'txs', component: Txs },
      { path: 'tx/:txhash', name: 'tx', component: Tx },
      // Endorsements
      {
        path: 'endorsements/:page?',
        name: 'endorsements',
        component: Endorsements,
      },
      // Delegations
      {
        path: 'delegations/:page?',
        name: 'delegations',
        component: Delegations,
      },
      // Originations
      {
        path: 'originations/:page?',
        name: 'originations',
        component: Originations,
      },
      // Activations
      {
        path: 'activations/:page?',
        name: 'activations',
        component: Activations,
      },
      // Double baking
      {
        path: 'double_baking/:page?',
        name: 'double_baking',
        component: DoubleBaking,
      },
      // Double endorsement
      {
        path: 'double_endorsement/:page?',
        name: 'double_endorsement',
        component: DoubleEndorsement,
      },
      /* Operations group end */

      // Bakers
      { path: 'bakers/:page?', name: 'bakers', component: Bakers },
      {
        path: 'public_bakers/:page?',
        name: 'public_bakers',
        component: BakersPublic,
      },
      { path: 'baker/:baker', name: 'baker', component: Baker },

      /* Accounts group */
      // Accounts
      { path: 'accounts/:page?', name: 'accounts', component: Accounts },
      {
        path: 'account/:account',
        name: 'account',
        component: Account,
      },
      // Top accounts
      {
        path: 'top_accounts/:page?',
        name: 'top_accounts',
        component: TopAccounts,
      },
      // Contracts
      { path: 'contracts/:page?', name: 'contracts', component: Contracts },
      // Assets
      { path: 'assets/:page?', name: 'assets', component: Assets },
      { path: 'asset/:id', name: 'asset', component: Asset },
      /* Accounts group end */

      /* Governance group */
      {
        path: 'protocol_amendment',
        redirect: { name: 'protocol_amendment' },
      },
      { path: 'protocols', redirect: { name: 'protocols' } },
      { path: 'period/:id', redirect: { name: 'period' } },
      { path: 'vote/:voteHash', redirect: { name: 'vote' } },
      /* Governance group end */

      /* Charts group */
      { path: 'charts/baking', redirect: { name: 'baking_charts' } },
      { path: 'charts/general', redirect: { name: 'general_charts' } },
      /* Charts group end */

      { path: 'glossary', name: 'glossary', component: Glossary },

      /* Errors group */
      {
        path: 'maintenance',
        name: 'maintenance',
        component: Maintenance,
      },
      { path: '404', name: '404', component: NotFound },
      { path: '500', name: '500', component: ServerError },
      { path: '*', redirect: { name: '404' } },
      /* Errors group end */
    ],
  },
  {
    name: 'mainnet',
    path: '/:language/mainnet',
    component: PageContentContainer,
    children: [
      /* Governance group */
      {
        path: 'protocol_amendment',
        name: 'protocol_amendment',
        component: ProtocolAmendment,
      },
      { path: 'protocols', name: 'protocols', component: Protocols },
      { path: 'period/:id', name: 'period', component: Period },
      { path: 'vote/:voteHash', name: 'vote', component: Vote },
      /* Governance group end */

      /* Charts group */
      {
        path: 'charts/baking',
        name: 'baking_charts',
        component: ChartsBaking,
      },
      {
        path: 'charts/general',
        name: 'general_charts',
        component: ChartsGeneral,
      },
      /* Charts group end */
    ],
  },
];
