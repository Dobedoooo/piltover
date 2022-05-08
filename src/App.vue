<template>
	<div class="loading">
		<loading v-model:flag="loadingFlag"></loading>
	</div>
	<router-view></router-view>
</template>

<script setup lang="ts">
import { defineComponent, provide, ref } from 'vue';
import loading from './components/Loading.vue'

defineComponent({ loading })

const loadingFlag = ref(false)

provide('loading', () => loadingFlag.value = true )
provide('idle', () => loadingFlag.value = false )

</script>

<style lang="scss">
@import 'reset-css';
@import './assets/style/index.scss';
#app {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f7;
}
.loading {
	position: absolute;
	top: 10px;
	right: 10px;
}
</style>
