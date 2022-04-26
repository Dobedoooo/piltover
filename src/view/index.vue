<template>
    <div class="index-container">
        <div class="pdl-20 bar bold fs-18">
            <span>{{ state.activeItem }}</span>
            <div class="fr cur pdr-20" @click="refresh">☁️</div>
        </div>
        <div class="content">
            <div class="top">
                <div class="top-dir pd-10">
                    <div :class="['item', 'cur', 
                        state.activeTop === itemIndex ? 'active' : '',
                        state.activeItem === itemIndex ? 'panel-active' : '',
                    ]" @click="openDir(itemIndex as string)" v-for="(item, itemIndex) in state.directory" :key="itemIndex">
                        <span class="no-sel"><span class="icon">{{ state.activeTop === itemIndex ? '📂' : '📁' }}</span>{{ itemIndex }}</span>
                    </div>
                </div>
                <div class="sub">
                    <div class="sub-dir pd-10">
                        <div :class="['item', 'cur', 
                            state.activeSub === subIndex ? 'active' : '',
                            state.activeItem === subIndex ? 'panel-active' : ''
                        ]" v-for="(subItem, subIndex) in state.sub" :key="subIndex" @click="openDir(subIndex as string, true)">
                            <span class="no-sel"><span class="icon">{{ state.activeSub === subIndex ? '📂' : '📁' }}</span>{{ subIndex }}</span>
                        </div>
                    </div>
                    <div class="file pd-10">
                        <div :class="['item', 'cur',
                            state.activeFile === fileIndex ? 'active' : '',
                            state.activeItem === fileIndex ? 'panel-active' : ''
                        ]" v-for="(fileItem, fileIndex) in state.file" :key="fileIndex">
                            <span class="cur no-sel" @click="getFile(fileIndex as string)"><span class="icon">{{ String(fileIndex).split('.')[1] === 'json' ? '📄' : '🖼️' }}</span>{{ fileIndex }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="preview"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
    getFileList,
    Universal,
    refresh as fileRefresh
} from '../api'

export default defineComponent({
    name: 'index',
    setup() {

        const state = reactive({
            token: '',
            directory: {} as Universal,
            activeTop: '',
            sub: {} as Universal,
            activeSub: '',
            file: {} as Universal,
            activeFile: '',
            activeItem: '',
        })
        const route = useRoute()
        const router = useRouter()

        const init = async(): Promise<void> => {
            
            if(!route.params.hasOwnProperty('token')) {
                router.push({ name: 'login' })
                return
            }

            const res = await getFileList(route.params?.token as string)
            if(res.ok) {
                state.directory = res.data
            } else {
                console.error('error')
            }
            
        }
        onMounted(init)

        const doPath = async(path: string) => {
            state.activeTop = path
            state.activeItem = path
            state.activeSub = ''
            state.activeFile = ''
            state.sub = state.directory[path]
            state.file = {}        
        }
        const doSub = async(sub: string) => {
            state.activeSub = sub
            state.activeItem = sub
            state.activeFile = ''
            state.file = state.directory[state.activeTop][sub]
        }
        const openDir = (path: string, subPath = false) => {
            subPath ? doSub(path) : doPath(path)
        }
        const getFile = (file: string) => {
            state.activeFile = file
            state.activeItem = file
        }
        
        const refresh = async() => {
            const res = await fileRefresh(route.params?.token as string)
            console.log(res);
            
        }

        return {
            state,
            openDir,
            getFile,
            refresh,
        }

    }
})
</script>

<style lang="scss" scoped>
.index-container {
    width: 83%;
    height: 83%;
    // border: 1px solid cadetblue;
    border-radius: 12px;
    box-shadow: 2px 4px 12px rgb(0 0 0 / 8%);
    background-color: #fff;
    .icon {
        display: inline-block;
        width: 22px;
        margin-right: 1px;
    }
    .pointer {
        transform: rotate(90deg);
    }
    .bar {
        height: 50px;
        line-height: 50px;
        background-color: #fbfbfb;
        border-bottom: 1px solid #eeeaef;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }
    .content {
        height: calc(100% - 50px);
        display: flex;
        justify-content: flex-start;
    }
    .active {
        background-color: #dbdbdb;
    }
    .panel-active {
        background-color: #2960da !important;
        color: #fff !important;
    }
    .item {
        border-radius: 4px;
        padding: 4px 0 5px 5px;
    }
    .top {
        overflow: auto;
        width: 600px;
        display: flex;
        justify-content: flex-start;
        .top-dir {
            width: 200px;
            height: 100%;
        }
        .sub {
            overflow: auto;
            width: 400px;
            height: 100%;
            display: flex;
            justify-content: flex-start;
            border-left: 2px solid #eeeeee;
            .sub-dir {
                width: 200px;
                height: 100%;
            }
            .file {
                overflow: auto;
                width: 200px;
                height: 100%;
                border-left: 2px solid #eeeeee;
                border-right: 2px solid #eeeeee;
            }
        }
    }
    .preview {
        width: calc(100% - 600px);
    }
}
</style>