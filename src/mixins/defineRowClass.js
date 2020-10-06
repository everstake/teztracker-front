export default {
  methods: {
    $_defineRowClass(item, type) {
      if (!item || type !== 'row' || !item.status) return;
      return item.status !== 'applied' ? 'table-danger' : '';
    },
  },
};
