<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <b-container fluid>
        <b-row>
          <b-col lg="12">
            <b-card no-body>
              <CardHeader>
                <template #left-content class="text">
                  <h4 class="tz-title--bold">
                    {{ $t('listTypes.delegateComparison') }}
                  </h4>
                </template>
              </CardHeader>

              <b-card-body>
                <DelegateComparisonList
                  :loading="loading"
                  :items="delegateComparison"
                />
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </section>
  </div>
</template>

<script>
  import { mapMutations, mapState, mapActions } from 'vuex';
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import CardHeader from '../components/partials/CardHeader';
  import { SET_DELEGATE_COMPARISON } from '@/store/mutations.types';
  import DelegateComparisonList from '../components/bakers/DelegateComparisonList';
  import { GET_DELEGATE_COMPARISON } from '@/store/actions.types';

  export default {
    name: 'DelegateComparison',
    components: {
      Breadcrumbs,
      DelegateComparisonList,
      CardHeader,
    },
    data() {
      return {
        loading: false,
      };
    },
    computed: {
      ...mapState('accounts', ['delegateComparison']),
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'delegate_comparison',
            text: this.$t('pageTypes.delegateComparison'),
          },
        ];
      },
    },
    methods: {
      ...mapMutations('accounts', [SET_DELEGATE_COMPARISON]),
      ...mapActions('accounts', [GET_DELEGATE_COMPARISON]),
      async reload() {
        this.loading = true;
        await this[GET_DELEGATE_COMPARISON]();
        this.loading = false;
      },
    },
    async created() {
      await this.reload();
    },
  };
</script>
