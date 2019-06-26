<template>
  <div class="monitor">
    <div id="monitor-iframe">
      <div class="monitor-iframe-holder" ref="iframe"></div>
    </div>
    <console class="monitor-console"></console>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex';
  import progress from 'nprogress';
  import bus from '@/js/eventbus.js';
  import createIframe from '@/js/iframe.js';
  import * as transform from '@/js/transform.js';
  import getScripts from '@/js/get_script.js';
  import proxyConsole from '!raw-loader!babel-loader!@/js/proxy-console';
  import Console from './console.vue';

  const sandboxAttributes = [
    'allow-modals',
    'allow-forms',
    'allow-pointer-lock',
    'allow-popups',
    'allow-same-origin',
    'allow-scripts'
  ];

  const replaceQuote = str => str.replace(/__QUOTE_LEFT__/g, '<')
  const createElement = tag => (content = '', attrs = {}) => {
    attrs = Object.keys(attrs)
      .map(key => {
        return `${key}="${attrs[key]}"`
      })
      .join(' ')
    return replaceQuote(
      `__QUOTE_LEFT__${tag} ${attrs}>${content}__QUOTE_LEFT__/${tag}>`
    )
  }


  export default {
    data() {
      return {
        iframe: null,
        runTimer: null,
      }
    },
    components: {Console},
    computed: {
      ...mapState([
        'boxes',
        'autoRun',
        'dependencies',
      ])
    },
    mounted() {
      this.iframe = createIframe({
        el: this.$refs.iframe,
        sandboxAttrs: sandboxAttributes,
      });
      window.addEventListener('message', this.listenIframe);
      bus.$on('run', this.run);
      window.monitor = this;
    },
    beforeDestroy() {
      window.removeEventListener('message', this.listenIframe);
    },
    methods: {
      ...mapActions([
        'setIframeStatus',
        'transform',
        'clearLogs',
        'addLog',
      ]),
      run() {
        progress.start();
        clearTimeout(this.runTimer);
        this.runTimer = setTimeout(async () => {
          this.clearLogs();
          this.setIframeStatus('loading');
          await this.transform(true);
          const headStyle = await this.transformCSS();
          const html = await this.transformHTML();
          const jsScript = await this.transformJS();
          const runtimeScript = await this.runtimeScript();
          const runtimeStyle = await this.runtimeStyle();
          this.iframe.setContent({
            head: headStyle + runtimeStyle,
            body: html + runtimeScript + jsScript,
          })
          progress.done();
        }, 1000);
      },
      async runtimeScript() {
        const console = createElement('script')(proxyConsole);
        const dependencies = this.dependencies.js
          .map(dependence => `<script src="${dependence}"><\/script>`)
          .join('\n');
        return console + '\n' + dependencies;
      },
      async runtimeStyle() {
        const dependencies = this.dependencies.css
          .map(dependence => `<link src="${dependence}"><\/link>`)
          .join('\n');
        return dependencies;
      },
      async transformCSS() {
        let code = '';
        if(this.boxes.css) {
          code = await transform.css(this.boxes.css).then(code => {
            return code;
          });
        }
        return createElement('style')(code);
      },
      async transformHTML() {
        let code = '';
        if(this.boxes.html) {
          code = await transform.html(this.boxes.html);
        }
        return code;
      },
      async transformJS() {
        let code = '';
        if(this.boxes.javascript) {
          code = await transform.javascript(this.boxes.javascript);
        }
        return createElement('script')(code);
      },
      listenIframe({ data = {} }) {
        if(data.type === 'demoground-console') {
          if(data.method === 'clear') {
            this.clearLogs();
          } else {
            this.addLog({type: data.method, message: data.args.join('\\n')});
          }
        }
      }
    }
  };
</script>

<style lang="scss">

@import '@/css/index.scss';
.monitor {
  max-height: 100vh;
  padding: 20px 20px 0 20px;
  display: flex;
  flex-direction: column;
  & #monitor-iframe {
    width: 100%;
    height: 100px;
    flex-grow: 1;
    background: white;
  }
}
</style>