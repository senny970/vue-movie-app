<template>
  <div id="app">
    <Notification/>
    <Loader/>
    <PosterBg :poster="posterBg"/>
    <Header/>
    <MoviesList :list="moviesList" @changePoster="onChangePoster" />
    <template v-if="!this.isFavorites && !this.isSearch">
      <MoviesPagination
          :current-page="currentPage"
          :per-page="moviesPerPage"
          :total="moviesLength"
          @pageChanged="onPageChanged"
      />
    </template>
    <template v-else>
      <div class="movies-bottom-mr"></div>
    </template>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {mapActions} from 'vuex';
import Header from "@/components/Header";
import MoviesList from "@/components/MoviesList";
import PosterBg from "@/components/PosterBg";
import MoviesPagination from "@/components/MoviesPagination";
import Loader from "./components/Loader";
import Notification from "./components/Notification";

export default {
  name: "App",
  components: {
    MoviesList,
    PosterBg,
    MoviesPagination,
    Loader,
    Header,
    Notification
  },
  data: () => ({
    posterBg: '',
  }),
  computed: {
    ...mapGetters('movies',
        ['moviesList',
          'currentPage',
          'moviesPerPage',
          'moviesLength',
          'isSearch',
          'isFavorites']
    ),
  },
  watch: {
    '$route.query': {
      handler: "onPageQueryChange",
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.loadFavoriteMovies();
  },
  methods: {
    ...mapActions('movies', ['fetchMovies', 'changeCurrentPage', 'loadFavoriteMovies']),
    onChangePoster(poster) {
      this.posterBg = poster;
    },
    onPageChanged(page) {
      this.$router.push({query: {page}});
      /*this.changeCurrentPage(page);*/
    },
    onPageQueryChange({page = 1}) {
      this.changeCurrentPage(Number(page));
    }
  },
};
</script>

<style>
#app {
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.movies-bottom-mr {
  margin-top: 25px;
}
</style>
