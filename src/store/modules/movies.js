import axios from "@/plugins/axios";
import top25IDs from "@/store/mock/imdb250";
import mutations from "@/store/mutations";

function serializeResponse(movies) {
    return movies.reduce((acc, movie) => {
        acc[movie.imdbID] = movie;
        return acc;
    }, {});
}

const {
    MOVIES,
    CURRENT_PAGE,
    REMOVE_FAVORITE_MOVIE,
    TOGGLE_SEARCH,
    TOGGLE_FAVORITES,
    ADD_FAVORITE_MOVIE,
    SAVE_FAVORITE_MOVIES,
    LOAD_FAVORITE_MOVIES,
    SETUP_MOVIE_IDS
} = mutations;

const moviesStore = {
    namespaced: true,
    state: {
        movieIDs: top25IDs,
        favoriteMoviesIDs: [],
        moviesPerPage: 12,
        currentPage: 1,
        movies: {},
        isSearch: false,
        isFavorites: false
    },
    getters: {
        moviesList: ({movies}) => movies,
        slicedIDs: ({movieIDs}) => (from, to) => movieIDs.slice(from, to),
        currentPage: ({currentPage}) => currentPage,
        moviesPerPage: ({moviesPerPage}) => moviesPerPage,
        moviesLength: ({movieIDs}) => Object.keys(movieIDs).length,
        favoritesLength: ({favoriteMoviesIDs}) => Object.keys(favoriteMoviesIDs).length,
        isSearch: ({isSearch}) => isSearch,
        isFavorites: ({isFavorites}) => isFavorites,
    },
    mutations: {
        [MOVIES](state, value) {
            state.movies = value;
        },
        [CURRENT_PAGE](state, value) {
            state.currentPage = value;
        },
        [REMOVE_FAVORITE_MOVIE](state, index) {
            state.favoriteMoviesIDs.splice(index, 1);
        },
        [TOGGLE_SEARCH](state, status) {
            state.isSearch = status;
        },
        [TOGGLE_FAVORITES](state, status){
            state.isFavorites = status;
        },
        [ADD_FAVORITE_MOVIE](state, id) {
            state.favoriteMoviesIDs.push(id);
        },
        [SAVE_FAVORITE_MOVIES](state) {
            const favorites = state.favoriteMoviesIDs;
            localStorage.setItem("favorites", JSON.stringify(favorites));
        },
        [LOAD_FAVORITE_MOVIES](state) {
            const favoritesRecord = localStorage.getItem("favorites");

            if (favoritesRecord) {
                state.favoriteMoviesIDs = JSON.parse(localStorage.getItem("favorites"));
            }
        },
        [SETUP_MOVIE_IDS](state, array) {
            state.movieIDs = [];
            state.movieIDs = array;
        }
    },
    actions: {
        async fetchMovies({getters, commit, dispatch}) {
            try {
                commit("SETUP_MOVIE_IDS", top25IDs);
                dispatch("toggleLoader", true, {root: true});
                const {currentPage, moviesPerPage, slicedIDs} = getters;
                const from = currentPage * moviesPerPage - moviesPerPage;
                const to = currentPage * moviesPerPage;
                const moviesToFetch = slicedIDs(from, to);
                const requests = moviesToFetch.map((id) => axios.get(`/?i=${id}`));
                const response = await Promise.all(requests);
                const movies = serializeResponse(response);
                commit(MOVIES, movies);
            } catch (err) {
                console.log(err);
            } finally {
                dispatch("toggleLoader", false, {root: true});
            }
        },
        changeCurrentPage({commit, dispatch}, page) {
            commit("CURRENT_PAGE", page);
            dispatch("fetchMovies");
        },
        removeFavoriteMovie({commit, dispatch, state}, id) {
            const index = state.favoriteMoviesIDs.findIndex(item => item === id);

            if (index !== -1) {
                commit("REMOVE_FAVORITE_MOVIE", index);
                commit("SAVE_FAVORITE_MOVIES");
                dispatch("showFavoriteMovies");
            }

            if (index === 0) {
                state.isFavorites = false;
                dispatch("fetchMovies");
            }
        },
        async searchMovies({commit, dispatch}, query) {
            try {
                dispatch("toggleLoader", true, {root: true});
                const searchResponse = await axios.get(`/?s=${query}`);

                if (searchResponse.Error) {
                    throw Error(searchResponse.Error);
                }

                let searchMoviesIDs = [];

                searchResponse.Search.reduce((acc, response) => {
                    return searchMoviesIDs.push(response.imdbID);
                }, 0);

                const requests = searchMoviesIDs.map((id) => axios.get(`/?i=${id}`));
                const moviesResponse = await Promise.all(requests);
                const movies = serializeResponse(moviesResponse);

                commit(MOVIES, movies);
            } catch (err) {
                dispatch("showNotify", {
                    msg: err.message,
                    title: "Error",
                    variant: "danger"
                }, {root: true});
            } finally {
                dispatch("toggleLoader", false, {root: true});
            }
        },
        toggleSearchState({commit}, status) {
            commit("TOGGLE_SEARCH", status);
        },
        toggleFavoritesState({commit}, status) {
            commit("TOGGLE_FAVORITES", status);
        },
        addMovie({commit}, id) {
            commit("ADD_FAVORITE_MOVIE", id);
            commit("SAVE_FAVORITE_MOVIES");
        },
        async showFavoriteMovies({commit, dispatch, state}) {
            try {
                dispatch("toggleLoader", true, {root: true});
                const requests = state.favoriteMoviesIDs.map((id) => axios.get(`/?i=${id}`));
                const moviesResponse = await Promise.all(requests);
                const movies = serializeResponse(moviesResponse);
                commit("SETUP_MOVIE_IDS", state.favoriteMoviesIDs);
                commit("MOVIES", movies);
            } catch (err) {
                dispatch("showNotify", {
                    msg: err.message,
                    title: "Error",
                    variant: "danger"
                }, {root: true});
            } finally {
                dispatch("toggleLoader", false, {root: true});
            }
        },
        loadFavoriteMovies({commit}) {
            commit("LOAD_FAVORITE_MOVIES");
        }
    }
};

export default moviesStore;
