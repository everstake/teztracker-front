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