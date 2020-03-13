<template>
  <CardSection
    :fluid="true"
  >
    <template>
      <b-row>
        <b-col cols="12" sm="10" md="12" lg="12" xl="12" offset-cols="0" offset-sm="1" offset-md="0">
          <div class="vote-card vote-card__empty margin-bottom">
            <div class="vote-card__header">
              <p class="vote-card--margin-none vote-card__font-size--20 vote-card__font-size--centered font font--regular">
                Period {{ $route.params.id }} was not found.
              </p>
            </div>
          </div>
        </b-col>
      </b-row>
    </template>
  </CardSection>
</template>

<script>
  import CardSection from "@/components/partials/CardSection";

  export default {
    name: 'PeriodLoading',
    components: {
      CardSection
    }
  }
</script>