<template>
  <BContainer>
    <h3 class="list-title">{{ listTitle }}</h3>
    <BRow>
      <template v-if="isExist">
        <BCol cols="3" v-for="(movie, key) in list" :key="key">
          <MovieItem
              :movie="movie"
              @mouseover.native="onMouseOver(movie.Poster)"
              @removeItem="onRemoveItem"
              @showModal="onShowMovieInfo"
              @addToFavorite="onAddToFavorite"
          />
        </BCol>
      </template>
      <template v-else>
        <div>
          <h1>Empty</h1>
        </div>
      </template>
    </BRow>
    <BModal class="movie-modal-body" :id="movieInfoModalID" size="xl" hide-footer hide-header>
      <MovieInfoModal :movie="selectedMovie" @closeModal="onCloseModal"/>
    </BModal>
  </BContainer>
</template>

<script>
import MovieItem from "@/components/MovieItem";
import {mapActions, mapGetters} from 'vuex';
import MovieInfoModal from "./MovieInfoModal";

export default {
  name: "MoviesList",
  components: {
    MovieItem,
    MovieInfoModal
  },
  data: () => ({
    movieInfoModalID: 'movie-info',
    selectedMovieID: '',
  }),
  props: {
    list: {
      type: Object,
      default: () => ({}),
    }
  },
  computed: {
    ...mapGetters('movies', ['isSearch', 'isFavorites']),
    isExist() {
      return Boolean(Object.keys(this.list).length);
    },
    listTitle() {
      if (this.isSearch)
        return 'Search results';

      if (this.isFavorites)
        return 'Favorites';

      return 'IMDB Top 250';
    },
    selectedMovie() {
      return this.selectedMovieID ? this.list[this.selectedMovieID] : null;
    }
  },
  methods: {
    ...mapActions('movies', ['removeFavoriteMovie', 'addMovie']),
    ...mapActions(['showNotify']),
    onMouseOver(poster) {
      this.$emit('changePoster', poster);
    },
    async onRemoveItem({id, title}) {
      const isConfirm = await this.$bvModal.msgBoxConfirm(`Remove ${title} ?`);

      if (isConfirm) {
        this.removeFavoriteMovie(id);
        this.showNotify({
          msg: `${title} deleted successful!`,
          variant: "success",
          title: "Success"
        })
      }
    },
    onShowMovieInfo(id) {
      this.selectedMovieID = id;
      this.$bvModal.show(this.movieInfoModalID);
    },
    onCloseModal() {
      this.$bvModal.hide(this.movieInfoModalID);
    },
    async onAddToFavorite(id, movie) {
      const isConfirm = await this.$bvModal.msgBoxConfirm(`Add to favorite ${movie.Title} ?`);

      if (isConfirm) {
        this.showNotify({
          msg: `${movie.Title} add to favorites!`,
          variant: "success",
          title: "Success"
        })
        this.addMovie(id);
      }
    }
  },
}
</script>

<style scoped>
.list-title {
  font-size: 50px;
  margin-bottom: 30px;
  color: #ffffff;
}
</style>

