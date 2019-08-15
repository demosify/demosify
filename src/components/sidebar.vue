<template>
  <nav class="sidebar">
    <div
      class="sidebar-showMore"
      @click="isShowingMore = !isShowingMore"
      :class="{
        'sidebar-showMore--folded': isShowingMoreFolded,
        'sidebar-showMore--crossed': isShowingMoreCrossed
      }"
    >
      <div class="sidebar-showMoreItem sidebar-showMoreItem--top"></div>
      <div class="sidebar-showMoreItem sidebar-showMoreItem--mid"></div>
      <div class="sidebar-showMoreItem sidebar-showMoreItem--bottom"></div>
    </div>
    <div
      class="sidebar-menu"
      :class="{
        'sidebar-menu--folded': !isShowingMore
      }"
    >
      <div v-for="(links, group) in showLinks" :key="group">
        <!-- 不在文件夹中 -->
        <router-link
          v-if="links.length === 1"
          class="sidebar-menuItem"
          :class="{
            'sidebar-menuItem--active': currentDemo === links[0].label
          }"
          :to="`/${links[0].src}`"
        >
          {{ links[0].label }}
        </router-link>
        <div v-else class="sidebar-menu__folder">
          <p class="sidebar-menu__folderTitle" @click="toogleVisible(group)">
            {{ group }}
          </p>
          <div class="sidebar-menu__folderContent"
            v-show="unfolded.indexOf(group) > -1"
          >
            <router-link
              v-for="link in links"
              :key="link.src"
              class="sidebar-menuItem"
              :class="{
                'sidebar-menuItem--active': currentDemo === link.label
              }"
              :to="`/${link.src}`"
            >
              {{ link.label }}
            </router-link>
          </div>
        </div>
      </div>
      <!-- <router-link
        v-for="demo in showLinks"
        :key="demo.src"
        class="sidebar-menuItem"
        :class="{
          'sidebar-menuItem--active': currentDemo === demo.label
        }"
        :to="`/${demo.src}`"
      >
        {{ demo.label }}
      </router-link> -->
    </div>
  </nav>
</template>

<script>
import PerfectScrollbar from 'perfect-scrollbar';
import { mapState } from 'vuex';
export default {
  name: 'sidebar',
  data() {
    return {
      isShowingMore: false,
      showingMoreTimer: null,
      isShowingMoreFolded: false,
      isShowingMoreCrossed: false,
      unfolded: []
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
    ...mapState({
      showLinks(state) {
        const groups = {};
        state.links.forEach(link => {
          // 定义的组
          if ('demos' in link) {
            if (!groups[link.group]) groups[link.group] = [];
            groups[link.group] = [
              ...groups[link.group],
              ...link.demos.map(demo => ({
                label: demo.label,
                src: `${link.src}/${demo.src}`
              }))
            ];
          } else {
            const groupName = link.src.split('/')[0];
            if (!groups[groupName]) groups[groupName] = [];
            groups[groupName].push(link);
          }
        });
        return groups;
      }
    }),
    currentDemo() {
      this.isShowingMore = false; // eslint-disable-line vue/no-side-effects-in-computed-properties
      const src = this.$route.name;
      if (src) {
        const group = src.split('/')[0];
        this.toogleVisible(group);
      }
      return src;
    }
  },
  mounted() {
    new PerfectScrollbar(document.querySelector('.sidebar-menu'), {
      suppressScrollX: true
    });
  },
  methods: {
    toogleVisible(group) {
      console.log(group);
      const index = this.unfolded.indexOf(group);
      if (index > -1) {
        this.unfolded.splice(index, 1);
      } else {
        this.unfolded.push(group);
      }
    }
  }
};
</script>

<style lang="scss">
@import '@/css/index.scss';
@import '~perfect-scrollbar/css/perfect-scrollbar.css';
$foldedDealy: 100ms;
.sidebar {
  font-family: $link-font-family;
  position: relative;
  &-menu {
    list-style: none;
    margin: 0;
    padding: 10px 0 0 0;
    max-height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    &Item {
      font-size: 14px;
      line-height: 1.8;
      padding: 0 0 0 20px;
      color: rgba($c-font, 0.4);
      font-weight: 300;
      transition: 0.3s all ease;
      cursor: pointer;
      text-decoration: none;
      display: block;
      &:hover {
        color: $c-font;
        transform: translateX(4px);
      }
      &.router-link-active {
        opacity: 1;
        color: $c-highlight;
        position: relative;
        &::before {
          content: '';
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
    &__folder {
      &Title {
        margin: 0;
        padding: 0;
        font-size: 14px;
        line-height: 1.8;
        padding: 0 0 0 20px;
        color: rgba($c-font, 0.4);
        font-weight: 300;
        cursor: pointer;
        transition: color 0.3s ease-out;
        position: relative;
        &:hover {
          color: $c-font;
          &:after {
            border-color: $c-font transparent transparent transparent;
          }
        }
        &:after {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 6px 4px 0 4px;
          border-color: rgba($c-font, 0.4) transparent transparent transparent;
          top: 10px;
          left: 8px;
        }
      }
      &Content {
        display: flex;
        flex-direction: column;
        background: darken($c-bg, 3%);
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

@media (max-width: $c-small-screen) {
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
    height: calc(100vh - 80px);
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
