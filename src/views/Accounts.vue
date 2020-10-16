<template>
  <PageContentContainer page-name="Accounts page">
    <template #breadcrumbs>
      <Breadcrumbs :crumbs="crumbs" />
    </template>

    <template #content>
      <section>
        <b-container fluid>
          <b-row>
            <b-col lg="12">
              <b-card no-body>
                <CardHeader>
                  <template #left-content class="text">
                    <h4 class="tz-title--bold">
                      {{ $t('listTypes.accsList') }}
                    </h4>
                  </template>
                  <template #right-content class="text">
                    <Counter show-line :count="count.accounts" />
                  </template>
                </CardHeader>

                <b-card-body>
                  <AccountsList />
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
        </b-container>
      </section>
    </template>
  </PageContentContainer>
</template>

<script>
  import { mapState } from 'vuex';
  import PageContentContainer from '../layouts/PageContentContainer';
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import AccountsList from '../components/accounts/AccountsList';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';

  export default {
    name: 'Accounts',
    components: {
      PageContentContainer,
      Breadcrumbs,
      AccountsList,
      Counter,
      CardHeader,
    },
    computed: {
      ...mapState('accounts', {
        count: (state) => state.counts,
      }),
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          { toRouteName: 'accounts', text: this.$t('pageTypes.accsPage') },
        ];
      },
    },
  };
</script>
