import mutations from "../mutations";

const { TOGGLE_LOADER } = mutations;

const loaderStore = {
  state: {
    isShowLoader: false,
  },
  getters: {
    isShowLoader: ({ isShowLoader }) => isShowLoader,
  },
  mutations: {
    [TOGGLE_LOADER](state, status) {
      state.isShowLoader = status;
    },
  },
  actions: {
    toggleLoader({ commit }, status) {
      commit("TOGGLE_LOADER", status);
    },
  },
};

export default loaderStore;
