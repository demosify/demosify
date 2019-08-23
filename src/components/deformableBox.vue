<template>
  <!-- author: Betsey(冰晶)
  可形变区域组件:
  inspiredby:https://github.com/PUGE/deformation, thank you with love
  可设定该区域resize的方向，上下左右及四角
  目前拉伸仅可以改变宽度和高度
  todo（可优化）：
  1. 针对绝对定位，调整top和left的值实现绝对的resize，但是注意，此时需要监测绝对定位是什么方向的定位，根据方向进行调整，留到有需求的时候完成；
-->

  <div class="c-deformableBox" :style="style" ref="content">
    <!-- 不可见的控制区域 -->
    <template v-if="resizable">
      <div
        class="ctrl ctrl-v ctrl-t"
        v-if="canResizeDirection('top')"
        @mousedown.stop.left.prevent="handleResizeStart(['t'])"
      ></div>
      <div
        class="ctrl ctrl-h ctrl-r"
        v-if="canResizeDirection('right')"
        @mousedown.stop.left.prevent="handleResizeStart(['r'])"
      ></div>
      <div
        class="ctrl ctrl-v ctrl-b"
        v-if="canResizeDirection('bottom')"
        @mousedown.stop.left.prevent="handleResizeStart(['b'])"
      ></div>
      <div
        class="ctrl ctrl-h ctrl-l"
        v-if="canResizeDirection('left')"
        @mousedown.stop.left.prevent="handleResizeStart(['l'])"
      ></div>
      <div
        class="ctrl ctrl-c ctrl-t ctrl-r"
        v-if="canResizeDirection('top') && canResizeDirection('right')"
        @mousedown.stop.left.prevent="handleResizeStart(['t', 'r'])"
      ></div>
      <div
        class="ctrl ctrl-c ctrl-t ctrl-l"
        v-if="canResizeDirection('top') && canResizeDirection('left')"
        @mousedown.stop.left.prevent="handleResizeStart(['t', 'l'])"
      ></div>
      <div
        class="ctrl ctrl-c ctrl-b ctrl-r"
        v-if="canResizeDirection('bottom') && canResizeDirection('right')"
        @mousedown.stop.left.prevent="handleResizeStart(['b', 'r'])"
      ></div>
      <div
        class="ctrl ctrl-c ctrl-b ctrl-l"
        v-if="canResizeDirection('left') && canResizeDirection('right')"
        @mousedown.stop.left.prevent="handleResizeStart(['b', 'l'])"
      ></div>
    </template>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'deformable-box',
  data() {
    return {
      w: undefined,
      h: undefined,
      resizeDirections: [],
      resizing: false
    };
  },
  props: {
    // 区域是否可以拖动，拖动方向, 默认可以拖动
    resizable: {
      // 要求是一个布尔值或者一个指定值的数组
      validator(val) {
        if (typeof val === 'boolean') return val;
        return Array.isArray(val) && // eslint-disable-line
          val.every(each => ['top', 'left', 'right', 'bottom'].indexOf(each) > -1); // eslint-disable-line
      },
      default: true
    },
    // 初始宽度
    initWidth: Number,
    // 初始高度
    initHeight: Number,
    // 高度及宽度限制
    maxHeight: Number,
    minHeight: Number,
    maxWidth: Number,
    minWidth: Number
  },
  mounted() {
    this.init();
  },
  computed: {
    style() {
      if (this.w === 0 && this.h === 0) return {};
      const result = {};
      // 判断可以改变大小的方向，从而修改宽度或者高度
      if (this.canResizeDirection('left') || this.canResizeDirection('right')) {
        result.width = `${this.w}px`;
      }
      if (this.canResizeDirection('top') || this.canResizeDirection('bottom')) {
        result.height = `${this.h}px`;
      }
      return result;
    }
  },
  methods: {
    init() {
      this.w = this.initWidth || this.$el.clientWidth;
      this.h = this.initHeight || this.$el.clientHeight;
    },
    // 判断该方向可否改变大小
    canResizeDirection(direction) {
      if (typeof this.resizable === 'boolean') return this.resizable;
      return this.resizable.indexOf(direction) > -1;
    },
    handleResizeStart(directionArray) {
      this.resizeDirections = directionArray;
      this.resizing = true;
      this.$emit('resize-start');
      document.documentElement.addEventListener('mousemove', this.handleResize);
      // 当鼠标抬起的时候解除监听
      document.documentElement.addEventListener(
        'mouseup',
        this.handleResizeEnd,
        { once: true }
      );
      document.getElementById('monitor-iframe').addEventListener('mouseover', this.handleResizeEnd); //eslint-disable-line
    },
    getElementLeft(el) {
      let actualLeft = el.offsetLeft;
      let parent = el.offsetParent;
      while (parent !== null) {
        actualLeft += parent.offsetLeft + parent.clientLeft;
        parent = parent.offsetParent;
      }
      return actualLeft;
    },
    getElementTop(el) {
      let actualTop = el.offsetTop;
      let parent = el.offsetParent;
      while (parent !== null) {
        actualTop += parent.offsetTop + parent.clientTop;
        parent = parent.offsetParent;
      }
      return actualTop;
    },
    handleResize(e) {
      console.log('resizing');
      if (this.resizeDirections.indexOf('r') > -1) {
        const widthAfterMove =
          e.pageX - this.getElementLeft(this.$refs.content);
        this.w = Math.max(Math.min(widthAfterMove, this.maxWidth || Infinity), this.minWidth || 1); // eslint-disable-line
      }
      if (this.resizeDirections.indexOf('l') > -1) {
        const widthAfterMove =
          this.getElementLeft(this.$refs.content) + this.w - e.pageX;
        this.w = Math.max(Math.min(widthAfterMove, this.maxWidth || Infinity), this.minWidth || 1); // eslint-disable-line
      }

      if (this.resizeDirections.indexOf('b') > -1) {
        const heightAfterMove =
          e.pageY - this.getElementTop(this.$refs.content);
        this.h = Math.max(Math.min(heightAfterMove, this.maxHeight || Infinity), this.minHeight || 1); // eslint-disable-line
      }
      if (this.resizeDirections.indexOf('t') > -1) {
        const heightAfterMove =
          this.getElementTop(this.$refs.content) + this.h - e.pageY;
        this.h = Math.max(Math.min(heightAfterMove, this.maxHeight || Infinity), this.minHeight || 1); // eslint-disable-line
      }

      this.$emit('resizing', {
        width: this.w,
        height: this.h
      });
    },
    handleResizeEnd() {
      this.resizeDirections = [];
      document.documentElement.removeEventListener(
        'mousemove',
        this.handleResize
      );
      this.$emit('resize-end');
    }
  }
};
</script>
<style lang="scss">
.c-deformableBox {
  height: 100%;
  position: relative;
  & .ctrl {
    position: absolute;

    &-h {
      width: 4px;
      height: calc(100% + 4px);
      top: -2px;
      cursor: ew-resize;
    }
    &-v {
      width: calc(100% + 4px);
      height: 4px;
      left: -2px;
      cursor: ns-resize;
    }

    &-c {
      width: 4px;
      height: 4px;
    }

    &-t {
      top: -2px;
    }
    &-r {
      right: -2px;
    }
    &-b {
      bottom: -2px;
    }
    &-l {
      left: -2px;
    }

    &.ctrl-t.ctrl-l,
    &.ctrl-b.ctrl-r {
      cursor: nwse-resize;
    }

    &.ctrl-t.ctrl-r,
    &.ctrl-b.ctrl-l {
      cursor: nesw-resize;
    }
  }
}
</style>
