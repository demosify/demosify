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
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" clearable>
      </el-input>

      <el-tree
        class="filter-tree"
        :data="showLinks"
        :props="defaultProps"
        default-expand-all
        @node-click="treeClick"
        :filter-node-method="filterNode"
        ref="tree"
      >
      </el-tree>
    </div>
  </nav>
</template>

<script>
import PerfectScrollbar from "perfect-scrollbar";
import { mapState } from "vuex";
export default {
  name: "sidebar",
  data() {
    return {
      isShowingMore: false,
      showingMoreTimer: null,
      isShowingMoreFolded: false,
      isShowingMoreCrossed: false,
      unfolded: [],
      filterText: "",
      defaultProps: {
        children: "demos",
        label: "label",
      },
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
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  computed: {
    ...mapState(["links"]),
    ...mapState({
      showLinks(state) {
        state.links.forEach((demo) => {
          if (demo.demos) {
            demo.demos.forEach((child) => {
              if (child.demos) {
                child.demos.forEach((childs) => {
                  if (typeof childs !== "string") {
                    childs.path =
                      "/" + demo.src + "/" + child.src + "/" + childs.src;
                  }
                });
              } else if (typeof child !== "string")
                child.path = "/" + demo.src + "/" + child.src;
            });
          }
          if (typeof demo !== "string") demo.path = "/" + demo.src;
          // return demo;
        });
        console.log("state. state.demoList===>", state.links);
        return state.links;
      },
    }),
    currentDemo() {
      this.isShowingMore = false; // eslint-disable-line vue/no-side-effects-in-computed-properties
      return this.$route.name;
    },
    // currentGroup(state) {
    //   const src = this.$route.name;
    //   let currentGroupName = null;
    //   for (let groupName in state.showLinks) {
    //     var links = state.showLinks[groupName];
    //     links.forEach((link) => {
    //       if (link.src === src) {
    //         currentGroupName = groupName;
    //       }
    //     });
    //   }
    //   return currentGroupName;
    // },
  },
  mounted() {
    new PerfectScrollbar(document.querySelector(".sidebar-menu"), {
      suppressScrollX: true,
    });
    // if (this.currentGroup) {
    //   const index = this.unfolded.indexOf(this.currentGroup);
    //   if (index == -1) {
    //     this.unfolded.push(this.currentGroup);
    //   }
    // }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    treeClick(data, node, tmp) {
      console.log(data, node, tmp);
      !data.group &&
        this.$router.replace({ path: data.path }).catch((err) => {
          console.log("输出报错", err);
        });
      // this.$router.replace({path:'/framework/framework2/react test2'})
      //  !data.group && this.$router.push({path:'/framework/react test'})
    },
    toogleVisible(group) {
      const index = this.unfolded.indexOf(group);
      if (index > -1) {
        this.unfolded.splice(index, 1);
      } else {
        this.unfolded.push(group);
      }
    },
  },
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
    max-height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    &Item {
      font-size: 14px;
      line-height: 1.8;
      padding: 0 0 0 20px;
      color: $c-font-menuitem;
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
    &__folder {
      &Title {
        margin: 0;
        padding: 0;
        font-size: 14px;
        line-height: 1.8;
        padding: 0 0 0 20px;
        color: $c-font-menuitem;
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
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 6px 4px 0 4px;
          border-color: $c-font-menuitem transparent transparent transparent;
          top: 10px;
          left: 8px;
        }
      }

      &Title[data-folded="true"]:after {
        transform: rotate(-90deg);
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
