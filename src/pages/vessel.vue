<template>
  <div class="vessel">
    <editor class="editor"></editor>
    <monitor class="monitor"></monitor>
  </div>
</template>

<script>
import Editor from '@/components/editor.vue';
import Monitor from '@/components/monitor.vue';
export default {
  name: 'vessel',
  components: {
    Editor,
    Monitor
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
  & .monitor {
    background: $c-bg;
  }
}
</style>
