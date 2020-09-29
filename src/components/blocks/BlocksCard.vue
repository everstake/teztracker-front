<template>
  <b-card no-body>
    <CardHeader>
      <template v-slot:left-content class="text">
        <h4 class="tz-title--bold">
          {{ $t('listTypes.blocksList') }}
        </h4>
        <!--        <Dropdown dropdownTitle="This year" />-->
      </template>
      <template v-slot:right-content class="text">
        <Counter show-line :count="count" />
        <router-link class="link fs-14" :to="{ name: 'blocks' }">
          {{ $t('common.viewAll') }}
        </router-link>
      </template>
    </CardHeader>

    <b-card-body>
      <BlocksList
        :show-per-page-filter="showPerPageFilter"
        :is-table-complete="false"
      />
    </b-card-body>
  </b-card>
</template>

<script>
  import { mapState } from 'vuex';
  import CardHeader from '../partials/CardHeader';
  // import Dropdown from "../partials/Dropdown";
  import Counter from '../partials/Counter';
  import BlocksList from '@/components/blocks/BlocksList';

  export default {
    name: 'BlocksCard',
    components: {
      CardHeader,
      // Dropdown,
      Counter,
      BlocksList,
    },
    props: ['showPerPageFilter'],
    computed: {
      ...mapState('blocks', {
        count: (state) => state.counts.blocks,
      }),
    },
  };
</script>
