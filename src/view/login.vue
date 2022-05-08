<template>
    <div class="login-container">
        <span class="no-sel fs-18">Welcome to Piltover!</span>
        <input autofocus type="text" v-model="admin" @keyup.enter="adminLogin">
        <img class="role" src="../assets/img/51011.png">
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

import {
    login
} from '../api'

export default defineComponent({
    name: 'login',
    setup() {

        const admin = ref('')

        const router = useRouter()

        const adminLogin = async() => {
            const res = await login(admin.value)
            if(res.ok) {
                router.push({ name: 'index', params: { token: res.data } })
            } else {
                console.warn(res.msg);
                
            }
        }

        return {
            admin,
            adminLogin,

        }
    }
})
</script>

<style lang="scss" scoped>
.login-container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    input {
        box-sizing: content-box;
        margin-top: 20px;
        margin-bottom: 100px;
        text-align: center;
    }
    .role {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-133%, -82%);
    }
}
</style>