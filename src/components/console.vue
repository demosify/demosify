<template>
  <div class="console">
    <div class="console-header">
      <h3 
        @dblclick="isConsoleFolded = !isConsoleFolded" 
        class="console-title">console <span class="console-new"></span>
      </h3>
      <p class="console-autoRun">
        <input type="checkbox" name="" id="">autoRun
      </p>
    </div>
    <div class="console-content" :class="{'console-content--fold': isConsoleFolded}">
    </div>
  </div>
</template>

<script>
  import progress from 'nprogress'
  import { mapActions } from 'vuex';
  export default {
    name: 'console',
    data(){
      return {
        isConsoleFolded: true,
      }
    },
    methods: {
      ...mapActions(['toogleAutoRun'])
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
  &-autoRun {
    font-size: 14px;
    & input {
      margin-right: 5px;
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