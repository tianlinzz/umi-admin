const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

/*
 * dva中的model
 * 1. namespace: 当前model的命名空间
 * 2. state: 当前model的初始值
 * 3. reducers: 纯函数，用于处理同步操作，可以修改state
 * 4. effects: 生成器函数，用于处理异步操作，不能修改state，需要通过put方法触发reducer
 * 5. subscriptions: 生成器函数，用于订阅一个数据源，然后根据需要dispatch相应的action
 */
export default {
  namespace: "count",
  state: {
    num: 0,
  },
  reducers: {
    add(state: any) {
      state.num += 1;
    },
  },

  effects: {
    *addAsync(_action: any, { put }: any) {
      yield delay(1000);
      yield put({ type: "add" });
    },
  },
  subscriptions: {
    setup({ dispatch, history }: any) {
      return history.listen(({ location: { pathname } }: any) => {
        console.log(pathname);
      });
    },
  },
};
