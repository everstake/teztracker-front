const PageContentContainer = () => import('@/layouts/PageContentContainer');
const Index = () => import('../views/Index');

// Middlewares
import language from '@/router/middleware/language';
import network from '@/router/middleware/network';
import page from '@/router/middleware/page';

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
const Feedback = () => import('../views/Feedback.vue');
const Mempool = () => import('../views/Mempool.vue');

// Personal account
const PersonalAccount = () => import('../views/PersonalAccount.vue');

// Errors
const Maintenance = () => import('../views/Maintenance.vue');
const NotFound = () => import('../views/errors/NotFound.vue');
const ServerError = () => import('../views/errors/ServerError.vue');

export default [
  {
    path: '/',
    name: 'index',
    redirect: { name: 'network' },
    component: PageContentContainer,
    children: [
      {
        name: 'personal_account',
        path: 'account',
        component: PersonalAccount,
        props: {
          isSearchVisible: false,
        },
      },
      {
        path: 'maintenance',
        name: 'maintenance',
        component: Maintenance,
      },
    ],
  },
  {
    path: '/:language',
    redirect: { name: 'network' },
  },
  {
    path: '/:language/:network',
    component: PageContentContainer,
    children: [
      {
        path: '',
        name: 'network',
        component: Index,
        meta: {
          middleware: [language, network],
        },
        props: {
          isSearchVisible: false,
        },
      },
      /* Blocks group */
      {
        name: 'blocks',
        path: 'blocks/:page?',
        component: Blocks,
        meta: {
          middleware: [language, network, page],
        },
      },
      {
        name: 'block',
        path: 'block/:level',
        component: Block,
        meta: {
          middleware: [language, network],
        },
      },
      {
        name: 'snapshots',
        path: 'snapshots/:page?',
        component: Snapshots,
        meta: {
          middleware: [language, network, page],
        },
      },
      {
        name: 'baking_rights',
        path: 'baking_rights',
        component: BakingRights,
        meta: {
          middleware: [language, network],
        },
      },
      /* Blocks group end */

      /* Operations group */
      // Txs
      {
        path: 'txs/:page?',
        name: 'txs',
        component: Txs,
        meta: {
          middleware: [language, network, page],
        },
      },
      {
        path: 'tx/:txhash',
        name: 'tx',
        component: Tx,
        meta: {
          middleware: [language, network],
        },
      },
      // Endorsements
      {
        path: 'endorsements/:page?',
        name: 'endorsements',
        component: Endorsements,
        meta: {
          middleware: [language, network, page],
        },
      },
      // Delegations
      {
        path: 'delegations/:page?',
        name: 'delegations',
        component: Delegations,
        meta: {
          middleware: [language, network, page],
        },
      },
      // Originations
      {
        path: 'originations/:page?',
        name: 'originations',
        component: Originations,
        meta: {
          middleware: [language, network, page],
        },
      },
      // Activations
      {
        path: 'activations/:page?',
        name: 'activations',
        component: Activations,
        meta: {
          middleware: [language, network, page],
        },
      },
      // Double baking
      {
        path: 'double_baking/:page?',
        name: 'double_baking',
        component: DoubleBaking,
        meta: {
          middleware: [language, network, page],
        },
      },
      // Double endorsement
      {
        path: 'double_endorsement/:page?',
        name: 'double_endorsement',
        component: DoubleEndorsement,
        meta: {
          middleware: [language, network, page],
        },
      },
      /* Operations group end */

      // Bakers
      {
        path: 'bakers/:page?',
        name: 'bakers',
        component: Bakers,
        meta: {
          middleware: [language, network, page],
        },
      },
      {
        path: 'public_bakers/:page?',
        name: 'public_bakers',
        component: BakersPublic,
        meta: {
          middleware: [language, network, page],
        },
      },
      {
        path: 'baker/:baker',
        name: 'baker',
        component: Baker,
        meta: {
          middleware: [language, network],
        },
      },

      /* Accounts group */
      // Accounts
      {
        path: 'accounts/:page?',
        name: 'accounts',
        component: Accounts,
        meta: {
          middleware: [language, network, page],
        },
      },
      {
        path: 'account/:account',
        name: 'account',
        component: Account,
        meta: {
          middleware: [language, network],
        },
      },
      // Top accounts
      {
        path: 'top_accounts/:page?',
        name: 'top_accounts',
        component: TopAccounts,
        meta: {
          middleware: [language, network, page],
        },
      },
      // Contracts
      {
        path: 'contracts/:page?',
        name: 'contracts',
        component: Contracts,
        meta: {
          middleware: [language, network, page],
        },
      },
      // Assets
      {
        path: 'assets/:page?',
        name: 'assets',
        component: Assets,
        meta: {
          middleware: [language, network, page],
        },
      },
      {
        path: 'asset/:id',
        name: 'asset',
        component: Asset,
        meta: {
          middleware: [language, network],
        },
      },
      /* Accounts group end */

      /* Governance group */
      {
        path: 'protocol_amendment',
        redirect: { name: 'protocol_amendment' },
      },
      {
        path: 'protocols',
        redirect: { name: 'protocols' },
      },
      {
        path: 'period/:id',
        redirect: { name: 'period' },
      },
      {
        path: 'vote/:voteHash',
        redirect: { name: 'vote' },
      },
      /* Governance group end */

      /* Charts group */
      {
        path: 'charts/baking',
        redirect: { name: 'baking_charts' },
      },
      {
        path: 'charts/general',
        redirect: { name: 'general_charts' },
      },
      /* Charts group end */

      {
        path: 'glossary',
        name: 'glossary',
        component: Glossary,
        meta: {
          middleware: [language, network],
        },
      },
      {
        path: 'feedback',
        name: 'feedback',
        component: Feedback,
        meta: {
          middleware: [language, network],
        },
      },
      {
        path: 'mempool',
        name: 'mempool',
        component: Mempool,
        meta: {
          middleware: [language, network],
        },
      },
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
        meta: {
          middleware: [language],
        },
      },
      {
        path: 'protocols',
        name: 'protocols',
        component: Protocols,
        meta: {
          middleware: [language],
        },
      },
      {
        path: 'period/:id',
        name: 'period',
        component: Period,
        meta: {
          middleware: [language],
        },
      },
      {
        path: 'vote/:voteHash',
        name: 'vote',
        component: Vote,
        meta: {
          middleware: [language],
        },
      },
      /* Governance group end */

      /* Charts group */
      {
        path: 'charts/baking',
        name: 'baking_charts',
        component: ChartsBaking,
        meta: {
          middleware: [language],
        },
      },
      {
        path: 'charts/general',
        name: 'general_charts',
        component: ChartsGeneral,
        meta: {
          middleware: [language],
        },
      },
      /* Charts group end */
    ],
  },
  /* Errors group */
  { path: '/404', name: '404', component: NotFound },
  { path: '/500', name: '500', component: ServerError },
  { path: '*', redirect: { name: '404' } },
  /* Errors group end */
];
