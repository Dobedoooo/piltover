<template>
    <div v-show="flag">🕓</div>
</template>

<script lang="ts">
import { computed } from "@vue/reactivity";
import { defineComponent, ref } from "vue";


export default defineComponent({
    name: 'loading',
    props: { flag: { type: Boolean } },
    setup(props) {

        const flag = computed(() => props.flag)

        return { flag }

    }
})
</script>

<style lang="scss" scoped>

</style>