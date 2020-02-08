<template>
  <section class="sandbox">
    <div ref="monaco" class="sandbox-monaco" :style="monacoStyle"></div>
  </section>
</template>

<script>
import * as monaco from 'monaco-editor';
// 主题
import loadTheme from './sandboxTheme.js';
import { mapState } from 'vuex';
export default {
  props: {
    language: {
      require: true,
      type: String
    },
    value: {
      type: String,
      default: ''
    },
    isFolded: {
      type: Boolean,
      default: false
    },
    editorHook: {
      type: Function,
      default: null
    },
    inputHook: {
      type: Function,
      default: null
    }
  },
  watch: {
    value(val) {
      if (val) this.monacoEditor.setValue(val);
    }
  },
  computed: {
    ...mapState(['config']),
    monacoStyle() {
      if (this.config.editorViewMode === 'waterfall') {
        return {
          height: this.isFolded ? 0 : `${this.editorLineCount * 18}px`
        };
      }
      return {};
    }
  },
  data() {
    return {
      showPartial: true,
      monacoEditor: null,
      editorLineCount: 1
    };
  },
  mounted() {
    this.initMonaco();
  },
  destroyed() {
    if (this.monacoEditor) {
      this.monacoEditor.getModel().dispose();
      this.monacoEditor.dispose();
    }
  },
  methods: {
    initMonaco() {
      let model;
      if (this.editorHook) {
        model = this.editorHook(monaco, this.value, this.language);
      }

      // 加载全部主题
      loadTheme(monaco);

      this.monacoEditor = monaco.editor.create(
        this.$refs.monaco,
        Object.assign(
          {
            language: this.language,
            automaticLayout: true,
            theme: this.config.boxTheme,
            minimap: {
              enabled: false
            },
            smoothScrolling: true,
            scrollBeyondLastLine: false
          },
          this.config.editorOptions
        )
      );
      this.monacoEditor.onDidChangeModelContent(() => {
        this.editorLineCount = this.monacoEditor.getModel().getLineCount();
      });

      if (model) {
        this.monacoEditor.setModel(model);
      } else {
        this.monacoEditor.setValue(this.value);
      }

      this.bindContentChangeListener();
    },
    bindContentChangeListener() {
      if (!this.monacoEditor) throw new Error('editor is not mounted');
      this.monacoEditor.onDidChangeModelContent(() => {
        const value = this.monacoEditor.getValue();
        if (this.inputHook) {
          const res = this.inputHook(this.monacoEditor, value);
          if (res !== false) this.$emit('input', value);
        } else {
          this.$emit('input', value);
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import '@/css/index.scss';
.sandbox {
  &-monaco {
    height: 100%;
    overflow: hidden;
    transition: 300ms all ease-out;
  }
}
</style>
