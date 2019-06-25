<template>
  <div class="editor">
    <sandbox
      class="editor-sandbox"
      v-for="(content, type) in boxes"
      :key="type"
      :name="type"
      :value="content.code"
      :language="content.transformer"
      :isFolded="isSandboxFolded(type)"
      @toogleFold="toggleBoxFold(type)"
      @input="codeUpdate(type, arguments)"
    >
    </sandbox>
  </div>
</template>

<script>
import Sandbox from './sandbox.vue';
import { mapState, mapActions } from 'vuex';
export default {
  mounted() {
  },
  computed: {
    ...mapState([
      'foldBoxes',
      'boxes',
    ]),
  },
  components: { Sandbox },
  methods: {
    ...mapActions([
      'toggleBoxFold',
      'updateCode',
    ]),
    isSandboxFolded(type) {
      return this.foldBoxes.indexOf(type) > -1;
    },
    codeUpdate(type, [code]) {
      this.updateCode({type, code});
    },
  },
};
</script>

<style lang="scss"></style>
