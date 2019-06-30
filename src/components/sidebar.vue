<template>
  <nav class="sidebar">
    <div
      class="sidebar-showMore"
      @click="isShowingMore = !isShowingMore"
      :class="{
        'sidebar-showMore--folded': isShowingMoreFolded,
        'sidebar-showMore--crossed': isShowingMoreCrossed,
      }"
    >
      <div class="sidebar-showMoreItem sidebar-showMoreItem--top"></div>
      <div class="sidebar-showMoreItem sidebar-showMoreItem--mid"></div>
      <div class="sidebar-showMoreItem sidebar-showMoreItem--bottom"></div>
    </div>
    <div
      class="sidebar-menu"
      :class="{
        'sidebar-menu--folded': !isShowingMore,
      }"
    >
      <router-link
        v-for="demo in links"
        :key="demo"
        class="sidebar-menuItem"
        :class="{
          'sidebar-menuItem--active': currentDemo === demo,
        }"
        :to="`/${demo}`"
      >
        {{ demo }}
      </router-link>
    </div>
  </nav>
</template>

<script>
import PerfectScrollbar from 'perfect-scrollbar';
import { mapState, mapMutations } from "vuex";
export default {
  name: "sidebar",
  data() {
    return {
      isShowingMore: false,
      showingMoreTimer: null,
      isShowingMoreFolded: false,
      isShowingMoreCrossed: false
    };
  },
  watch: {
    isShowingMore(val) {
      clearTimeout(this.showingMoreTimer);
      if (val) {
        this.isShowingMoreFolded = true;
        this.showingMoreTimer = setTimeout(() => {
          this.isShowingMoreCrossed = true;
        }, 300);
      } else {
        this.isShowingMoreCrossed = false;
        this.showingMoreTimer = setTimeout(() => {
          this.isShowingMoreFolded = false;
        }, 300);
      }
    }
  },
  computed: {
    ...mapState(['links']),
    currentDemo() {
      this.isShowingMore = false;
      return this.$route.name;
    },
  },
  mounted(){
    new PerfectScrollbar(document.querySelector('.sidebar-menu'), {
      suppressScrollX: true,
    });
  }
};
</script>

<style lang="scss">
@import "@/css/index.scss";
@import "~perfect-scrollbar/css/perfect-scrollbar.css";
$foldedDealy: 100ms;
.sidebar {
  font-family: $link-font-family;
  position: relative;
  &-menu {
    list-style: none;
    margin: 0;
    padding: 10px 0 0 0;
    max-height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    &Item {
      font-size: 14px;
      padding: 5px 0 5px 20px;
      color: rgba($c-font, 0.4);
      font-weight: 300;
      transition: 0.3s all ease;
      cursor: pointer;
      text-decoration: none;
      &:hover {
        color: $c-font;
        transform: translateX(4px);
      }
      &--active {
        opacity: 1;
        color: $c-highlight;
        position: relative;
        &::before {
          content: "";
          width: 2px;
          height: 60%;
          background: $c-highlight;
          position: absolute;
          left: 10px;
          top: 20%;
        }
        &:hover {
          color: $c-highlight;
        }
      }
    }
  }
  &-showMore {
    display: none;
    box-sizing: border-box;
    width: 60px;
    height: 60px;
    padding: 28px 15px;
    position: relative;
    &--folded {
      & .sidebar-showMoreItem--top,
      .sidebar-showMoreItem--bottom {
        transform: translateY(0);
      }
      & .sidebar-showMoreItem--mid {
        transform: scaleX(0);
      }
    }
    &--crossed {
      & .sidebar-showMoreItem--top {
        transform: translateY(0) rotate(0.375turn);
      }
      & .sidebar-showMoreItem--mid {
        transform: scaleX(0);
      }
      & .sidebar-showMoreItem--bottom {
        transform: translateY(0) rotate(0.125turn);
      }
    }
    &Item {
      background: white;
      width: 30px;
      height: 4px;
      position: absolute;
      border-radius: 10px;
      transition: 300ms all ease-out;
      &--top {
        transform: translateY(-10px);
      }
      &--bottom {
        transform: translateY(10px);
      }
    }
  }
}

@media (max-width: 900px) {
  .sidebar-showMore {
    display: block;
  }
  .sidebar-menu {
    position: absolute;
    top: 60px;
    left: 0;
    z-index: 1000;
    width: 300px;
    padding: 10px 0;
    background: lighten($c-bg, 5);
    transition: 0.3s all ease-out;
    height: calc(100vh - 60px);
    box-sizing: border-box;
    transform-origin: left center;
    &--folded {
      opacity: 0;
      transform: translateX(-100%);
      // transform: perspective(3000px) rotateY(-90deg);
      transition-duration: 0.6s;
    }
  }
}
</style>
