<template>
  <header class="header">
    <BNavbar class="navbar" type="dark" variant="dark">
      <BContainer>
        <BNavbarBrand href="#">MovieDB</BNavbarBrand>
          <BNavForm class="nav-form">
            <BFormInput
                class="mr-sm-2 search-input"
                placeholder="Search"
                v-model="searchValue"
            >
            </BFormInput>
          </BNavForm>
      </BContainer>
    </BNavbar>
  </header>
</template>

<script>
export default {
  name: "Header",
  data: () => ({
    searchValue: '',
  }),
  watch: {
    searchValue: 'onSearchValueChanged',
  },
  methods: {
    onSearchValueChanged(value) {
      console.log(value);
    }
  }
}
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
</style>