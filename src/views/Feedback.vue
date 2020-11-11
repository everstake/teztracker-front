<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <b-container fluid>
        <b-card no-body>
          <CardHeader>
            <template #left-content class="text">
              <h4 class="tz-title--bold">
                {{ $t('feedback.title') }}
              </h4>
            </template>
          </CardHeader>

          <div class="card-divider"></div>

          <b-card-body>
            <b-form class="feedback-form" @submit.prevent="onSubmit">
              <b-form-group
                :label="$t('feedback.overallOpinion')"
                :invalid-feedback="opinionErr"
              >
                <b-form-radio-group
                  id="opinion"
                  v-model="$v.feedback.opinion.$model"
                  name="opinion"
                  :options="opinionRadios"
                  :state="
                    $v.feedback.opinion.$anyDirty
                      ? !$v.feedback.opinion.$anyError
                      : null
                  "
                  :disabled="isSubmissionLoading"
                />
              </b-form-group>

              <b-form-group
                :label="$t('feedback.selectFeedbackType')"
                label-for="type-of-feedback"
                :invalid-feedback="feedbackTypeErr"
              >
                <b-form-select
                  id="type-of-feedback"
                  v-model="$v.feedback.type.$model"
                  :options="feedbackTypes"
                  :state="
                    $v.feedback.type.$anyDirty
                      ? !$v.feedback.type.$anyError
                      : null
                  "
                  :disabled="isSubmissionLoading"
                />
              </b-form-group>

              <b-form-group
                :label="$t('feedback.selectFeedbackScope')"
                label-for="scope-of-feedback"
                :description="$t('feedback.scopeDesc')"
              >
                <b-form-select
                  id="scope-of-feedback"
                  v-model="$v.feedback.scope.$model"
                  :options="feedbackScopes"
                  :state="
                    $v.feedback.scope.$anyDirty
                      ? !$v.feedback.scope.$anyError
                      : null
                  "
                  :disabled="isSubmissionLoading"
                />
              </b-form-group>

              <b-form-group
                :label="$t('feedback.summary')"
                label-for="summary"
                :description="$t('feedback.summaryDesc')"
                :invalid-feedback="summaryErr"
              >
                <b-form-textarea
                  id="summary"
                  v-model="$v.feedback.summary.$model"
                  :disabled="!isFeedbackScopeSpecific || isSubmissionLoading"
                  :state="
                    $v.feedback.summary.$anyDirty
                      ? !$v.feedback.summary.$anyError
                      : null
                  "
                />
              </b-form-group>

              <b-form-group
                :label="$t('feedback.leaveFeedback')"
                label-for="feedback"
                :invalid-feedback="feedbackTxtErr"
              >
                <b-form-textarea
                  id="feedback"
                  v-model="$v.feedback.feedbackTxt.$model"
                  :state="
                    $v.feedback.feedbackTxt.$anyDirty
                      ? !$v.feedback.feedbackTxt.$anyError
                      : null
                  "
                  :disabled="isSubmissionLoading"
                >
                </b-form-textarea>
              </b-form-group>

              <div class="d-flex justify-content-end">
                <b-btn
                  variant="success"
                  type="submit"
                  :disabled="isSubmissionLoading"
                >
                  {{ $t('feedback.submit') }}
                </b-btn>
              </div>
            </b-form>
          </b-card-body>
        </b-card>
      </b-container>
    </section>
  </div>
</template>

<script>
  import axios from 'axios';
  import Breadcrumbs from '@/components/partials/Breadcrumbs.vue';
  import CardHeader from '../components/partials/CardHeader';
  import { validationMixin } from 'vuelidate';
  import {
    required,
    requiredIf,
    maxLength,
    helpers,
  } from 'vuelidate/lib/validators';

  const latinRegexp = /^[A-Za-z0-9\s -~`₴!¬@"№#$;%:^&?*()_=+/\\[\]{}|,.]+$/;
  const initialFeedbackVals = {
    opinion: 10,
    type: null,
    scope: null,
    summary: '',
    feedbackTxt: '',
  };

  export default {
    name: 'Feedback',
    components: {
      Breadcrumbs,
      CardHeader,
    },
    mixins: [validationMixin],
    validations: {
      feedback: {
        opinion: {
          required,
        },
        type: {
          required,
        },
        scope: {},
        summary: {
          required: requiredIf((n) => n.scope === 'specific'),
          maxLength: maxLength(50),
          latin: helpers.regex('latin', latinRegexp),
        },
        feedbackTxt: {
          required,
          maxLength: maxLength(1000),
          latin: helpers.regex('latin', latinRegexp),
        },
      },
    },
    data() {
      return {
        opinionRadios: [...new Array(10)].map((el, index) => index + 1),
        feedback: { ...initialFeedbackVals },
        isSubmissionLoading: false,
      };
    },
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          { toRouteName: 'feedback', text: this.$t('feedback.title') },
        ];
      },
      feedbackTypes() {
        return [
          { value: null, text: this.$t('feedback.selectOpt'), disabled: true },
          ...Object.keys(this.$t('feedback.types')).map((key) => ({
            value: key,
            text: this.$t(`feedback.types.${key}`),
          })),
        ];
      },
      feedbackScopes() {
        return [
          { value: null, text: this.$t('feedback.selectOpt'), disabled: true },
          ...Object.keys(this.$t('feedback.scopes')).map((key) => ({
            value: key,
            text: this.$t(`feedback.scopes.${key}`),
          })),
        ];
      },
      validationErrsMap() {
        return {
          maxLength: (validatorParams) =>
            this.$t('validationErrs.maxLength', { num: validatorParams.max }),
          required: () => this.$t('validationErrs.required'),
          latin: () => this.$t('validationErrs.latin'),
          noRule: this.$t('validationErrs.noRule'),
        };
      },
      opinionErr() {
        return this.getValidationErr(this.$v.feedback.opinion);
      },
      feedbackTypeErr() {
        return this.getValidationErr(this.$v.feedback.type);
      },
      summaryErr() {
        return this.getValidationErr(this.$v.feedback.summary);
      },
      feedbackTxtErr() {
        return this.getValidationErr(this.$v.feedback.feedbackTxt);
      },
      isFeedbackScopeSpecific() {
        return this.feedback.scope === 'specific';
      },
    },
    watch: {
      isFeedbackScopeSpecific(val) {
        if (!val) {
          this.feedback.summary = '';
        }
      },
    },
    methods: {
      getValidationErr(validatedField) {
        if (!validatedField.$dirty && validatedField.$invalid) return '';

        const brokenRule = Object.keys(validatedField.$params).filter(
          (validator) => !validatedField[validator],
        )[0];

        return brokenRule
          ? this.validationErrsMap[brokenRule](
              validatedField.$params[brokenRule],
            )
          : this.validationErrsMap.noRule;
      },
      validate() {
        this.$v.$touch();
        return this.$v.$invalid;
      },
      async onSubmit() {
        if (this.validate()) return;

        try {
          this.isSubmissionLoading = true;
          const resp = await axios.post(
            process.env.VUE_APP_FORMSPREE_API,
            this.feedback,
          );

          if (resp && resp.status === 200) {
            this.$bvToast.toast(this.$t('feedback.submitted'), {
              title: this.$t('errorsNotifications.success'),
              variant: 'success',
              autoHideDelay: 1500,
            });

            this.feedback = { ...initialFeedbackVals };
          }
        } catch (e) {
          console.error(e);
        } finally {
          this.isSubmissionLoading = false;
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .feedback-form {
    max-width: 50%;

    @include for-desktop-down {
      max-width: 100%;
    }
  }
</style>
