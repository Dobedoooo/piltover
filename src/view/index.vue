<template>
    <div class="index-container">
        <div class="pdl-20 bar fs-18 no-sel">
            <span class="bold">{{ state.activeItem }}</span>
            <div class="fr cur mgr-20 mgl-10 refresh" @click="refresh">☁️</div>
            <div class="fr fs-16" v-if="Object.keys(state.file).length">
                <span v-if="state.activeFile && Object.keys(state.file[state.activeFile]).length">
                    create time:{{ state.file[state.activeFile].birthtime.split('T')[0] }}
                </span>
            </div>
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
                        ]" v-for="(fileItem, fileIndex) in state.file" :key="fileIndex" @click="getPreview(fileIndex as string)">
                            <span class="cur no-sel"><span class="icon">{{ String(fileIndex).split('.')[1] === 'json' ? '📄' : '🖼️' }}</span>{{ fileIndex }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="preview">
                <div v-if="previewState.previewType === 'json'" class="h-100p">
                    <VAceEditor 
                        v-model:value="(previewState.previewFile as string)"
                        style="height: 100%;"
                        lang="json"
                        theme="eclipse"
                        :readonly="true"
                        :wrap="true"
                        @change="editorInit"
                    ></VAceEditor>
                </div>
                <div v-else class="img">
                    <img :src="(previewState.previewFile as string)">
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
    getFileList,
    Universal,
    refresh as fileRefresh,
    getFile,
    Preview
} from '../api'

import { VAceEditor } from 'vue3-ace-editor'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-eclipse'

export default defineComponent({
    name: 'index',
    components: { VAceEditor },
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
        
        const loading: any = inject('loading')
        const idle: any = inject('idle')

        const init = async(): Promise<void> => {
            
            if(!route.params.hasOwnProperty('token')) {
                router.push({ name: 'login' })
                return
            }

            loading()
            const res = await getFileList(route.params?.token as string)
            idle()
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
            previewState.previewFile = ''
            previewState.previewType = ''
            state.sub = state.directory[path]
            state.file = {}        
        }
        const doSub = async(sub: string) => {
            state.activeSub = sub
            state.activeItem = sub
            state.activeFile = ''
            previewState.previewFile = ''
            previewState.previewType = ''
            state.file = state.directory[state.activeTop][sub]
        }
        const openDir = (path: string, subPath = false) => {
            subPath ? doSub(path) : doPath(path)
        }

        const previewState = reactive({
            previewType: '',
            previewFile: '' as object | string,
        })
        const getPreview = async(file: string) => {
            if(state.activeFile === file) return
            state.activeFile = file
            state.activeItem = file
            loading()
            const preview: Preview = await getFile(state.activeTop, state.activeSub, state.activeFile)
            idle()
            previewState.previewType = preview.type
            previewState.previewFile = preview.type === 'json' ? JSON.stringify(preview.data, null, 4) : preview.data
        }
        const editorInit = (stat: any, editor: any) => {
            stat.action === 'insert' &&  editor.scrollToRow(0)
        }
        
        const refresh = async() => {
            loading()
            const res = await fileRefresh(route.params?.token as string)
            idle()
            console.log(res);   
            
        }

        return {
            state,
            openDir,
            getPreview,
            refresh,
            previewState,
            editorInit
        }

    }
})
</script>

<style lang="scss" scoped>
.index-container {
    width: 83%;
    height: 83%;
    border-radius: 12px;
    overflow: hidden;
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
        .refresh {
            transition: text-shadow .15s;
            &:hover {
                text-shadow: 0 0 5px rgba($color: #333, $alpha: .5);
            }
        }
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
            border-left: 1px solid #eeeeee;
            .sub-dir {
                width: 200px;
                height: 100%;
            }
            .file {
                overflow: auto;
                width: 200px;
                height: 100%;
                border-left: 1px solid #eeeeee;
                border-right: 1px solid #eeeeee;
            }
        }
    }
    .preview {
        width: calc(100% - 600px);
        .img {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
        }
        .json-preview {
            width: 100%;
            height: 100%;
            overflow: auto;
            &:focus {
                outline: none;
            }
        }
        
        :deep(.ace_gutter) {
            background-color: #fbfbfb !important;
            .ace_gutter-active-line {
                background-color: #dbdbdb !important;
            }
        }
    }
}

</style>