import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('app', ['isWsConnectionOpen']),
    pageAndConnection() {
      return {
        page: this.page,
        connection: this.isWsConnectionOpen,
      };
    },
  },
  watch: {
    pageAndConnection: {
      immediate: true,
      deep: true,
      handler(newVal) {
        const { page, connection } = newVal;

        if (page && connection) {
          if (
            page === 1 &&
            !this.$ws.subscriptions.includes(this.subscriptionChannel)
          ) {
            this.$ws.subscribeToChannel(this.subscriptionChannel);

            this.$ws.onmessage((res) => {
              if (res.event === this.subscriptionChannel) {
                this.items.unshift(res.data.data);
                this.items.pop();
                this.count += 1;
              }
            });
          } else if (
            page !== 1 &&
            this.$ws.subscriptions.includes(this.subscriptionChannel)
          ) {
            this.$ws.unsubscribeFromChannel(this.subscriptionChannel);
          }
        }
      },
    },
  },
  beforeDestroy() {
    if (this.$ws.subscriptions.includes(this.subscriptionChannel)) {
      this.$ws.unsubscribeFromChannel(this.subscriptionChannel);
    }
  },
};
