import { validationMixin } from 'vuelidate';
import get from 'lodash/get';

export default {
  mixins: [validationMixin],
  methods: {
    validateState(name) {
      const { $dirty, $error } = get(this.$v, name);
      return $dirty ? !$error : null;
    },
  },
};
