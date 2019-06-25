<template>
  <div id="fakeBody">
    <a class="header"
      :href="config.homePage || '#'"
      target="_blank">
      <span class="header-logo"
        :style="{ backgroundImage: `url(${config.logo})` }">{{ config.logo ? '' : config.name }}</span>
      <span v-if="config.version"
        class="header-version">{{
        config.version
        }}</span>
    </a>
    <sidebar class="sidebar"></sidebar>
    <router-view class="vessel"></router-view>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Sidebar from '@/components/sidebar.vue';
export default {
  name: 'fakeBody',
  components: {
    Sidebar,
  },
  mounted() {
    window.test = this;
  },
  computed: {
    ...mapState(['config']),
  },
  methods: {
    ...mapActions(['setBoxes']),
  }
};
</script>

<style lang="scss">
@import '~@/css/index.scss';
#fakeBody {
  width: 100%;
  min-height: 100vh;
  background-color: $c-gap;
  display: grid;
  grid-gap: 1px;
  grid-template: 60px 1fr / 250px repeat(2, 1fr);
}
.header {
  display: flex;
  box-sizing: border-box;
  padding: 0 20px;
  font-family: $link-font-family;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  transition: 0.6s all ease-out;
  text-decoration: none;
  background-color: $c-bg;
  & span {
    line-height: 60px;
  }
  &-logo {
    font-family: $logo-font-family;
    flex-grow: 1;
    text-align: left;
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: left center;
  }
  &-version {
    width: 4em;
    text-align: right;
    pointer-events: none;
  }
  &:hover {
    filter: brightness(1.2);
    transition-duration: 0.2s;
  }
}
.sidebar {
  grid-column: 1 / 2;
  grid-row: 2 / -1;
  background-color: $c-bg;
}
.vessel {
  grid-column: 2 / -1;
  grid-row: 1 / -1;
}

@media (max-width: 900px) {
  #fakeBody {
    grid-template-columns: repeat(12, 1fr);
    min-width: 400px;
  }
  .header {
    grid-column: 2 / -1;
    grid-row: 1 / 2;
  }
  .sidebar {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    min-width: 60px;
  }
  .vessel {
    grid-column: 1 / -1;
    grid-row: 2 / -1;
  }
}
</style>
