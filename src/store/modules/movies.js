import axios from "@/plugins/axios";

const moviesStore = {
    namespaced: true,
    state: {},
    mutations: {},
    actions: {
        async fetchMovies(context) {
            console.log(context);
            const response = await axios.get('/?i=tt3896198');
            console.log(response);
        },
    },
};

export default moviesStore;