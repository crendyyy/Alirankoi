const orderKeys = {
  lists: ["ordersAdmin", "list"],
  list: (filter) => ['ordersAdmin', 'list', { ...filter }],
  detail: (id) => ['ordersAdmin', 'detail', id],
};

export default orderKeys;
