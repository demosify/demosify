<template>
  <div class="console">
    <div class="console-header">
      <h3 @dblclick="isConsoleFolded = !isConsoleFolded" class="console-title">
        console
        <transition name="fade">
          <span class="console-new" v-show="hasLog"></span>
        </transition>
      </h3>
      <p class="console-ctrl">
        <svg
          @click="run"
          t="1561513991991"
          class="icon console-runBtn"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2187"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <path
            d="M512 64C264.64 64 64 264.576 64 512c0 247.36 200.64 448 448 448 247.488 0 448-200.64 448-448C960 264.576 759.488 64 512 64zM384 704 384 320l320 192L384 704z"
            p-id="2188"
          ></path>
        </svg>
        <input
          type="checkbox"
          :checked="autoRun"
          @change="toogleAutoRun"
        />autoRun
      </p>
    </div>
    <transition name="slide">
      <div v-show="!isConsoleFolded" class="console-content">
        <p
          class="console-message"
          :class="{
            'console-message--error': log.type
          }"
          v-for="(log, index) in logs"
          :key="index"
        >
          <span
            class="console-messageType"
            :class="`console-messageType--${getFlag(log.type)}`"
          >
            {{ getFlag(log.type) }}
          </span>
          {{ log.message }}
        </p>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import bus from '@/js/eventbus.js';
export default {
  name: 'console',
  data() {
    return {
      isConsoleFolded: true
    };
  },
  computed: {
    ...mapState(['autoRun', 'logs']),
    hasLog() {
      return this.logs.length;
    }
  },
  methods: {
    ...mapActions(['toogleAutoRun']),
    run() {
      bus.$emit('run');
    },
    getFlag(method) {
      switch (method) {
        case 'log':
        case 'info':
        case 'debug':
          return 'info';
        case 'error':
          return 'error';
        case 'warn':
          return 'warn';
        default:
          return 'nothing';
      }
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
    &:hover {
      filter: brightness(1.1);
    }
    &:active {
      filter: brightness(0.8);
    }
  }
  &-content {
    height: 200px;
    width: 100%;
    transition: 0.3s all ease-out;
    background: $c-console-bg;
    margin-bottom: 20px;
    transition: all 0.5s;
    overflow-y: auto;
  }
  &-message {
    font-size: 14px;
    margin: 0;
    line-height: 1.5;
    &--error {
      background: rgba($c-console-error, 0.2);
    }
    &:nth-of-type(2n + 1) {
      background: $c-console-bg-odd;
    }
    &Type {
      font-size: 10px;
      color: white;
      vertical-align: middle;
      display: inline-block;
      width: 3em;
      line-height: 14px;
      text-align: center;
      margin: 0 4px;
      border-radius: 2px;
      &--info {
        background: $c-console-info;
      }
      &--error {
        background: $c-console-error;
      }
      &--warn {
        background: $c-console-warn;
      }
    }
  }
}

.slide-enter-active,
.slide-leave-active,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.slide-enter,
.slide-leave-to {
  height: 0;
  margin-bottom: 0;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
