<template>
  <div
    class="vessel"
    ref="vessel"
    :class="{
      'vessel--rotate': isBackface,
      'vessel--isPc': isPC
    }"
  >
    <monitor class="monitor" :style="{order: config.editorLayout === 'reverse' ? 0: 1}"></monitor>
    <deformable-box
      class="deformableContainer"
      :style="{width: isMonitorHidden ? '0' : '800px'}"
      v-if="isPC"
      :resizable="[config.editorLayout === 'reverse' ? 'left' : 'right']"
      :initWidth="800"
      :maxWidth="1100"
      :minWidth="400"
    >
      <button :style="{left: config.editorLayout === 'reverse' ? '-20px' : 'auto', right: config.editorLayout === 'reverse' ? 'auto' : '-20px'}" class="hideButton" @click="isMonitorHidden = !isMonitorHidden">{{isMonitorHidden ? '展开' : '收起'}}</button>
      <editor class="editor"></editor>
    </deformable-box>
    <editor v-else class="editor"></editor>
    <div
      class="flipButton"
      @click="isBackface = !isBackface"
      @touchmove.stop="onFlipBtnDrag"
      :style="{ top: `${flipBtnTop}px` }"
    >
      <svg
        t="1562510307124"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2037"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <path
          d="M213.333333 259.84v512l-55.04-55.466667a42.666667 42.666667 0 0 0-60.586666 60.586667l128 128a42.666667 42.666667 0 0 0 60.586666 0l128-128a42.666667 42.666667 0 0 0 0-60.586667 42.666667 42.666667 0 0 0-60.586666 0L298.666667 771.84v-512A66.56 66.56 0 0 1 363.946667 192H469.333333a42.666667 42.666667 0 0 0 0-85.333333H363.946667A151.893333 151.893333 0 0 0 213.333333 259.84zM609.706667 247.04a42.666667 42.666667 0 0 0 60.586666 60.586667L725.333333 252.16v512a66.56 66.56 0 0 1-65.28 67.84H554.666667a42.666667 42.666667 0 0 0 0 85.333333h105.386666A151.893333 151.893333 0 0 0 810.666667 764.16v-512l55.04 55.466667a42.666667 42.666667 0 0 0 60.586666 0 42.666667 42.666667 0 0 0 0-60.586667l-128-128a42.666667 42.666667 0 0 0-60.586666 0z"
          p-id="2038"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Editor from '@/components/editor.vue';
import Monitor from '@/components/monitor.vue';
import DeformableBox from '@/components/deformableBox.vue';
export default {
  name: 'vessel',
  data() {
    return {
      isBackface: false,
      flipBtnTop: 200,
      isMonitorHidden: false,
    };
  },
  components: {
    Editor,
    Monitor,
    DeformableBox
  },
  computed: {
    isPC() {
      var userAgentInfo = navigator.userAgent;
      var Agents = new Array(
        'Android',
        'iPhone',
        'SymbianOS',
        'Windows Phone',
        'iPad',
        'iPod'
      );
      var flag = true;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    },
    ...mapState(['config']),
  },
  methods: {
    // 翻页按钮
    onFlipBtnDrag(e) {
      let top = e.targetTouches[0].clientY;
      top = Math.min(window.screen.height - 40, Math.max(0, top));
      this.flipBtnTop = top;
    }
  }
};
</script>

<style lang="scss">
@import '@/css/index.scss';
.vessel {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1px;
  & .editor {
    background: $c-bg;
  }
  & .hideButton {
    position: absolute;
    top: 50%;
    background: $c-highlight;
    border: none;
    color: $c-font-contrast;
    font-size: 12px;
    width: 18px;  
    margin: 0 auto;  
    line-height: 20px; 
    border-radius: 4px;
    padding: 4px 0;
    transform: translateY(-50%);
    opacity: 0.4;
    &:hover{
      opacity: 1;
    }
  } 
  & .monitor {
    background: $c-bg;
  }
  & .flipButton {
    display: none;
  }
  &--isPc {
    display: flex;
    & .editor {
      margin-right: 1px;
    }
    & .monitor {
      flex-grow: 1;
    }
  }
}

@media (max-width: $c-small-screen) {
  .vessel {
    position: relative;
    display: block;
    & .editor,
    .monitor {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      transition: 1s all ease;
      border: 1px solid $c-gap;
    }
    & .monitor {
      height: 100%;
      transform: perspective(800px) rotateY(0deg);
    }
    & .editor {
      transform: perspective(800px) rotateY(180deg);
    }
    &--rotate {
      & .editor {
        transform: perspective(800px) rotateY(0deg);
      }
      & .monitor {
        transform: perspective(800px) rotateY(-180deg);
        & #monitor-iframe {
          opacity: 0;
        }
      }
    }
    & .flipButton {
      display: block;
      position: fixed;
      top: 50%;
      left: 0;
      border-radius: 0 50% 50% 0;
      width: 35px;
      height: 30px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      background: $c-flipbtn-bg;
      opacity: 0.4;
      transition: opacity 0.2s ease-out;
      & svg {
        width: 20px;
        height: 20px;
        margin-right: 5px;
        fill: $c-flipbtn-color;
      }
      &:active {
        opacity: 1;
      }
    }
  }
}
</style>
