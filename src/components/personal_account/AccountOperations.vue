<template>
  <div class="notifications">
    <h3>
      My operations
    </h3>
    <hr />
    <p>
      <b-button-group>
        <b-btn
          v-for="(operation, index) in operations"
          :key="index + generateKey()"
          :variant="currentOperationIndex === index ? 'primary' : 'secondary'"
          @click="currentOperationIndex = index"
          class="notifications__btn"
          >{{ operation }}</b-btn
        >
      </b-button-group>
    </p>
    <b-form-group>
      Baker Account ID:
      <b-form-input
        class="form-group"
        type="text"
        placeholder="Account ID"
        v-model="$v.accountId.$model"
        :state="validateState('accountId')"
      >
      </b-form-input>
      <b-form-invalid-feedback
        v-if="!$v.accountId.required"
        id="input-1-live-feedback"
        >This field is required.</b-form-invalid-feedback
      >
      <b-form-invalid-feedback
        v-if="!$v.accountId.isAddress"
        id="input-1-live-feedback"
        >Account id must starts with KT1, tz1, tz2 or tz3
        symbols.</b-form-invalid-feedback
      >
      <b-form-invalid-feedback
        v-if="!$v.accountId.minLength || !$v.accountId.maxLength"
        id="input-1-live-feedback"
        >This field must be 36 characters.</b-form-invalid-feedback
      >
    </b-form-group>
    <b-form-group v-if="currentOperationIndex === 0">
      Amount:
      <b-form-input
        class="form-group"
        type="text"
        placeholder="0"
        v-model="$v.amount.$model"
        :state="validateState('amount')"
      >
      </b-form-input>
      <b-form-invalid-feedback id="input-1-live-feedback"
        >This field is required.</b-form-invalid-feedback
      >
      <b-form-invalid-feedback
        v-if="!$v.amount.isNumeric"
        id="input-1-live-feedback"
        >This field is numeric only.</b-form-invalid-feedback
      >
    </b-form-group>
    <b-form-group>
      Fee:
      <b-form-select
        :options="feeOptions"
        v-model="feeSelected"
        class="form-group"
        type="text"
        placeholder="Put address here"
      >
      </b-form-select>
      <b-form-input
        v-if="feeSelected === 3"
        class="form-group"
        type="text"
        placeholder="0"
        autofocus
        v-model="$v.feeCustom.$model"
        :state="validateState('feeCustom')"
      >
      </b-form-input>
      <b-form-invalid-feedback
        v-if="!$v.feeCustom.required"
        id="input-1-live-feedback"
        >This field is required.</b-form-invalid-feedback
      >
      <b-form-invalid-feedback
        v-if="!$v.feeCustom.isNumeric"
        id="input-1-live-feedback"
        >This field is numeric only.</b-form-invalid-feedback
      >
      <b-form-invalid-feedback
        id="input-1-live-feedback"
        v-if="!$v.feeCustom.greaterThanZero"
        >This field must be greater than 0.</b-form-invalid-feedback
      >
      <b-form-invalid-feedback
        id="input-1-live-feedback"
        v-if="!$v.feeCustom.lessOrEqualThanOne"
        >This field must be less than 1 tezos.</b-form-invalid-feedback
      >
    </b-form-group>

    <b-btn
      :disabled="loading || !isBeaconAccountSet"
      variant="success"
      size="md"
      @click="handleSendClick"
      >Send</b-btn
    >
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import vuelidateMixin from '@/mixins/vuelidateMixin';
  import {
    minLength,
    maxLength,
    required,
    maxValue,
  } from 'vuelidate/lib/validators';
  import uuid from '@/mixins/uuid';

  export default {
    name: 'AccountOperations',
    mixins: [vuelidateMixin, uuid],
    validations: {
      accountId: {
        required,
        minLength: minLength(36),
        maxLength: maxLength(36),
        isAddress: (value) =>
          ['KT1', 'tz1', 'tz2', 'tz3'].some((w) => w === value.slice(0, 3)),
      },
      feeCustom: {
        required,
        maxValue: maxValue(1),
        isNumeric: (num) => !isNaN(num),
        greaterThanZero: (num) => num > 0,
        lessOrEqualThanOne: (num) => num <= 1,
      },
      amount: {
        required,
        isNumeric: (num) => !isNaN(num),
      },
    },
    data() {
      return {
        currentOperationIndex: 0,
        operations: ['Send tx', 'Delegate'],
        amount: null,
        accountId: '',
        feeOptions: [
          { value: 0, text: 'Low fee: 0.000000 ꜩ' },
          { value: 1, text: 'Medium fee: 0.004066 ꜩ' },
          { value: 2, text: 'High fee: 0.016075 ꜩ' },
          { value: 3, text: 'Custom fee:' },
        ],
        feeSelected: 0,
        feeCustom: null,
        loading: false,
      };
    },
    computed: {
      ...mapGetters('user', ['isBeaconAccountSet']),
    },
    methods: {
      async handleSendClick() {
        this.loading = true;
        if (this.currentOperationIndex === 0) {
          await this.$beacon.sendTx(this.amount, this.accountId);
        }

        if (this.currentOperationIndex === 1) {
          await this.$beacon.sendDelegation(this.accountId);
        }
        this.loading = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .notifications .notifications__btn:hover {
    transition: all 1s;
  }
</style>
