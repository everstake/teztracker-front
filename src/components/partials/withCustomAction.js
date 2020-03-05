import Vue from "vue";
import * as ACTIONS from "@/store/actions.types";

const withCustomAction = (pagination, storeModuleNamespace, customAction) => {
  const originalProps = pagination.props || [];

  return Vue.component("withCustomAction", {
    render(h) {
      return h(pagination, {
        props: this.$props,
        on: { ...this.$listeners, change: this.fireAction }
      });
    },
    props: { ...originalProps },
    watch: {
      // Passed through props.
      // Needed to repeat request if the number of per page items changes.
      perPage() {
        this.fireAction();
      }
    },
    methods: {
      async fireAction(page = 1) {
        await this.$store.dispatch(
          `${[storeModuleNamespace]}/${ACTIONS[customAction]}`,
          {
            page,
            limit: this.perPage
          }
        );
      }
    },
    created() {
      this.fireAction();
    }
  });
};

export default withCustomAction;
