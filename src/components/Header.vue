<template>
  <header class="header">
    <BNavbar class="navbar" type="dark" variant="dark">
      <BContainer>
        <div class="logo">
          <BNavbarBrand class="home-url" href="#" @click="onClickHome">MovieDB</BNavbarBrand>
          <BIcon class="movie-icon" icon="film"/>
        </div>
        <BIcon class="favorites-button" scale="1.5" icon="heart-fill" @click="onClickFavorites"/>
        <template v-if="this.favoritesLength">
          <BBadge class="favorites-count" variant="primary">{{this.favoritesLength}}</BBadge>
        </template>
        <BNavForm class="nav-form">
          <BFormInput
            class="mr-sm-2 search-input"
            placeholder="Search"
            v-model="searchValue"
            debounce="1000"
          >
          </BFormInput>
        </BNavForm>
      </BContainer>
    </BNavbar>
  </header>
</template>

<script>
import { mapActions } from "vuex";
import { mapGetters } from "vuex";

export default {
  name: "Header",
  data: () => ({
    searchValue: ""
  }),
  watch: {
    searchValue: "onSearchValueChanged"
  },
  computed: {
    ...mapGetters('movies', ['favoritesLength']),
  },
  methods: {
    ...mapActions("movies",
      ["searchMovies",
        "fetchMovies",
        "toggleSearchState",
        "toggleFavoritesState",
        "showFavoriteMovies"]
    ),
    onSearchValueChanged(value) {
      if (value) {
        this.searchMovies(value);
        this.toggleSearchState(true);
      } else {
        this.fetchMovies();
        this.toggleSearchState(false);
      }
    },
    onClickHome() {
      this.toggleFavoritesState(false);
      const searchInput = document.querySelector('.search-input');

      if (searchInput) {
        searchInput.value = '';
        this.toggleSearchState(false);
        this.fetchMovies();
      }

      //this.$router.push('/');
    },
    onClickFavorites() {
      this.toggleSearchState(false);
      this.toggleFavoritesState(true);
      this.showFavoriteMovies();
    }
  }
};
</script>

<style scoped>
.header {
  margin-bottom: 30px;
}

.navbar {
  background-color: rgba(0, 0, 0, 0.7) !important;
}

.search-input {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(102, 16, 243, 1);
}

.nav-form {
  display: flex;
}

.favorites-button {
  margin-right: 15px;
  margin-left: auto;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
}

.favorites-button:hover {
  transform: scale(1.3);
}

.favorites-count {
  margin-right: 10px;
  align-self: self-start;
  background-color: rgba(102, 16, 243, 1);
}

.movie-icon {
  color: #ffffff;
}

.logo {
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.logo:hover {
  transform: scale(1.2);
}

.home-url {
  margin-right: 10px;
}
</style>