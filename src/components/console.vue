<template>
  <div class="console">
    <div class="console-header">
      <h3 
        @dblclick="isConsoleFolded = !isConsoleFolded" 
        class="console-title">console <span class="console-new"></span>
      </h3>
      <p class="console-ctrl">
        <svg @click="run" t="1561513991991" class="icon console-runBtn" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2187" xmlns:xlink="http://www.w3.org/1999/xlink">
          <path d="M512 64C264.64 64 64 264.576 64 512c0 247.36 200.64 448 448 448 247.488 0 448-200.64 448-448C960 264.576 759.488 64 512 64zM384 704 384 320l320 192L384 704z" p-id="2188">
          </path>
        </svg>
        <input type="checkbox" :checked="autoRun" @change="toogleAutoRun">autoRun
      </p>
    </div>
    <div class="console-content" :class="{'console-content--fold': isConsoleFolded}">
    </div>
  </div>
</template>

<script>
  import progress from 'nprogress'
  import { mapActions, mapState } from 'vuex';
  import bus from '@/js/eventbus.js';
  export default {
    name: 'console',
    data(){
      return {
        isConsoleFolded: true,
      }
    },
    computed: {
      ...mapState([
        'autoRun'
      ]),
    },
    methods: {
      ...mapActions(['toogleAutoRun']),
      run() {
        bus.$emit('run');
      }
    }
  };
</script>

<style lang="scss">
@import '@/css/index.scss';
.console {
  margin-top: 10px;
  border-top: 1px solid rgba($c-highlight, 0.2);
  font-family: $font-family;
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &-title {
    font-weight: 300;
    font-size: 16px;
    line-height: 2em;
    color: $c-highlight;
    margin: 0;
    user-select: none;
  }
  &-new {
    display: inline-block;
    background: red;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-left: 5px;
    box-shadow: 0 0 10px red;
  }
  &-ctrl {
    font-size: 14px;
    display: flex;
    align-items: center;
    & input {
      margin-right: 5px;
    }
  }
  &-runBtn {
    width: 16px;
    height: 16px;
    fill: $c-highlight;
    display: inline-block;
    margin-right: 10px;
    padding: 2px;
    cursor: pointer;
    transition: 0.5 all ease-out;
    &:hover{
      filter: brightness(1.1);
    }
    &:active{
      filter: brightness(0.8);
    }
  }
  &-content {
    height: 200px;
    width: 100%;
    transition: 0.3s all ease-out;
    background: $c-console-bg;
    margin-bottom: 20px;
    &--fold {
      height: 0;
      margin: 0;
    }
  }
}
</style>