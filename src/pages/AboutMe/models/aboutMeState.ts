const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default {
  namespace: "aboutMeState",

  state: {
    myInfo: {
      name: "张三",
      age: 18,
    },
  },

  reducers: {
    save(state: any, { payload }: any) {
      return { ...state, ...payload };
    },
  },

  effects: {},
};
