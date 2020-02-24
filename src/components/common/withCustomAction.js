import Vue from "vue";
import { ACTIONS } from "../../store";

const withCustomAction = (pagination, customAction) => {
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
      async fireAction(page) {
        await this.$store.dispatch(ACTIONS[customAction], {
          page,
          perPage: this.perPage
        });
      }
    },
    created() {
      this.fireAction();
    }
  });
};

export default withCustomAction;
