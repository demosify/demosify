<template>
  <section class="sandbox">
    <header
      class="sandbox-name"
      :class="{
        'sandbox-name--folded': isFolded,
      }"
    >
      <span class="sandbox-type" @dblclick="toogleFold">{{ name.toUpperCase() }}</span>
      <span class="sandbox-transformer">{{ language }}</span>
      
      <!-- <i
        class="sandbox-nameBtn"
        :class="{
          'sandbox-nameBtn--partial': showPartial,
        }"
        @click="showPartial = !showPartial"
        @dblclick.stop
      ></i> -->
    </header>
    <div
      ref="monaco"
      class="sandbox-monaco"
      :style="{height: editorHeight}"
      :class="{
        'sandbox-monaco--folded': isFolded,
      }"
    ></div>
  </section>
</template>

<script>
import * as monaco from 'monaco-editor';
// 主题
import loadTheme from './sandboxTheme.js';
import {mapState} from 'vuex';
export default {
  props: {
    name: {
      require: true,
      type: String,
    },
    isFolded: {
      type: Boolean,
      default: true,
    },
    language: {
      require: true,
      type: String,
    },
    value: {
      type: String,
      default: '',
    },
  },
  watch: {
    value(val) {
      if(val) this.monacoEditor.setValue(val);
    }
  },
  computed: {
    ...mapState([
      'config',
    ]),
    editorHeight() {
      return this.isFolded ? 0 : `${this.editorLineCount * 18}px`
    }
  },
  data() {
    return {
      showPartial: true,
      monacoEditor: null,
      editorLineCount: 1,
    };
  },
  mounted() {
    this.initMonaco();
  },
  methods: {
    initMonaco() {
      // 加载全部主题
      loadTheme(monaco);
      this.monacoEditor = monaco.editor.create(this.$refs.monaco, {
        language: this.language,
        automaticLayout: true,
        theme: this.config.boxTheme,
        minimap: {
          enabled: false,
        },
        smoothScrolling: true,
        scrollBeyondLastLine: false
      });
      this.monacoEditor.onDidChangeModelContent(() => {
        this.editorLineCount = this.monacoEditor.getModel().getLineCount();
      });
      
      this.monacoEditor.setValue(this.value);
      
      this.bindContentChangeListener();
    },
    toogleFold() {
      this.$emit('toogleFold', this.type);
    },
    tooglePartial() {
      this.$emit('toogleFold', this.type);
    },
    bindContentChangeListener() {
      if (!this.monacoEditor) throw new Error('editor is not mounted');
      this.monacoEditor.onDidChangeModelContent(() => {
        const value = this.monacoEditor.getValue();
        this.$emit('input', value);
      });
    },
  },
};
</script>

<style lang="scss">
@import '@/css/index.scss';
.sandbox {
  font-family: $link-font-family;
  margin: 0 20px 20px 20px;
  &-name {
    line-height: 60px;
    border-bottom: 1px solid rgba($c-highlight, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
    &Btn {
      width: 15px;
      height: 15px;
      background: $c-highlight;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      &::after {
        content: '';
        width: 100%;
        height: 100%;
        background: $c-bg;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 50%;
        transform: translate(-25%, -25%);
        transition: 0.5s all ease-out;
      }
      &--partial {
        &::after {
          transform: translate(-100%, -100%);
        }
      }
    }
    &--folded {
      & h2 {
        color: $c-font;
      }
      border-bottom-color: rgba($c-font, 0.2);
      opacity: 0.4;
    }
  }
  &-transformer {
    user-select: none;
    color: rgba($c-font, 0.4);
  }
  &-type {
    font-size: 18px;
    margin: 0;
    padding: 0;
    user-select: none;
    color: $c-highlight;
  }
  &-monaco {
    height: 100%;
    min-height: 200px;
    transition: 300ms all ease-out;
    &--folded {
      min-height: 0;
      height: 0px;
      opacity: 0;
    }
  }
}
</style>
