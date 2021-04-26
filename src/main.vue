<template>
  <div id="fakeBody" :class="{ 'fakeBody--max': !isSidebarShown }">
    <div class="header">
      <a
        class="header-logo"
        :href="config.homePage || '#'"
        target="_blank"
        :style="{ backgroundImage: `url(${config.logo})` }"
      >
        {{ config.logo ? '' : config.name }}
      </a>
      <span v-if="config.version" class="header-version">
        {{ config.version }}
      </span>
    </div>
    <sidebar class="sidebar"></sidebar>
    <router-view class="vessel"></router-view>
    <div
      class="handler"
      :class="{
        'handler--hidden': !isSidebarShown
      }"
      @click="TOGGLE_SIDEBAR"
    ></div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import Sidebar from '@/components/sidebar.vue';
export default {
  name: 'fakeBody',
  components: {
    Sidebar
  },
  mounted() {
    window.test = this;
  },
  computed: {
    ...mapState(['config', 'isSidebarShown'])
  },
  methods: {
    ...mapActions(['setBoxes']),
    ...mapMutations(['TOGGLE_SIDEBAR'])
  }
};
</script>

<style lang="scss">
@import '~@/css/index.scss';
#fakeBody {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: $c-gap;
  display: grid;
  grid-gap: 1px;
  overflow: hidden;
  grid-template: 60px 1fr / 250px repeat(2, 1fr);
  &.fakeBody--max {
    grid-template: 60px 1fr / 0px repeat(2, 1fr);
  }
}
.header {
  display: flex;
  box-sizing: border-box;
  padding: 0 20px;
  font-family: $link-font-family;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  transition: 0.3s all ease-out;
  text-decoration: none;
  background-color: $c-bg;
  &-logo {
    font-family: $logo-font-family;
    flex-grow: 1;
    text-align: left;
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: left center;
    line-height: 60px;
    text-decoration: none;
  }
  &-version {
    width: 4em;
    text-align: right;
    pointer-events: none;
    line-height: 60px;
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
.handler {
  position: absolute;
  width: 12px;
  height: 40px;
  background: rgba(#000, 0.3);
  left: 240px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
  cursor: pointer;
  &--hidden {
    left: 0;
  }
  &:hover {
    opacity: 1;
  }
  &:active {
    opacity: 0.8;
  }
  &::after,
  &::before {
    content: '';
    position: absolute;
    width: 1px;
    height: 30px;
    top: 5px;
    left: 3px;
    background: rgba(#fff, 0.3);
  }
  &::after {
    left: 7px;
  }
}
.vessel {
  grid-column: 2 / -1;
  grid-row: 1 / -1;
  transition: 0.3s all ease-out;
}

@media (max-width: $c-small-screen) {
  #fakeBody {
    grid-template: 60px 1fr / repeat(12, 1fr);
    &.fakeBody--max {
      grid-template: 60px 1fr / repeat(2, 1fr);
      & .sidebar,
      .header {
        display: none;
      }
      & .vessel {
        grid-column: 1 / -1;
        grid-row: 1 / -1;
      }
    }
    & .sidebar {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }
    & .header {
      grid-column: 2 / -1;
      grid-row: 1 / 2;
    }
    & .vessel {
      grid-column: 1 / -1;
      grid-row: 2 / -1;
    }
    & .handler {
      left: 50%;
      top: 48px;
      transform: translateY(-50%) rotate(90deg);
      transform-origin: left center;
      &--hidden {
        top: 0px;
      }
    }
  }
}
</style>
