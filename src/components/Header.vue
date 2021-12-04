<template>
  <header class="header">
    <BNavbar class="navbar" type="dark" variant="dark">
      <BContainer>
        <BNavbarBrand class="home-url" href="#" @click="onClickHome">MovieDB</BNavbarBrand>
        <BNavForm class="nav-form">
          <BFormInput
            class="mr-sm-2 search-input"
            placeholder="Search"
            v-model="searchValue"
            debounce="500"
          >
          </BFormInput>
        </BNavForm>
      </BContainer>
    </BNavbar>
  </header>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Header",
  data: () => ({
    searchValue: ""
  }),
  watch: {
    searchValue: "onSearchValueChanged"
  },
  methods: {
    ...mapActions("movies", ["searchMovies", "fetchMovies", "toggleSearchState"]),
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
      this.fetchMovies();
      this.$router.push('/');
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

.home-url {
  transition: all 0.2s ease;
}

.home-url:hover {
  transform: scale(1.2);
}
</style>