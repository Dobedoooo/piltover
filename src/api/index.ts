
const baseUrl = 'http://47.97.11.78:8080'
const URL = {
    login: baseUrl + '/login',
    getFileList: baseUrl + '/filelist',
    refresh: baseUrl + '/refresh',
    file: baseUrl + '/static'
}

interface Response {
    data: any
    msg: string
    ok: boolean
}

export const login = (identity: string): Promise<Response> => {
    return new Promise(resolve => {
        fetch(`${URL.login}?admin=${identity}`).then(res => res.json()).then((data: Response) => {
            resolve(data)
        })
    })
}

export interface Universal {
    [key: string]: any
}

export const getFileList = (token: string, path = ''): Promise<Response> => {
    return new Promise((resolve) => {
        fetch(`${URL.getFileList}?sub=${path}`, {
            headers: {
                Authorization: token
            }
        }).then(res => res.json()).then((data: Response) => {
            resolve(data)
        }).catch(error => {
            resolve(error)
        })
    })
}

export interface Preview {
    type: string
    data: object | string
}
export const getFile = (type: string, ver: string, name: string): Promise<Preview> => {
    const path = `${type}/${ver}/${name}`
    return new Promise(resolve => {
        if(type === 'json') {
            fetch(`${URL.file}/${path}`).then(res => res.json()).then(data => resolve({ type: 'json', data }))
            .catch(error => resolve({type: 'error', data: error}))
        } else if(type === 'image') {
            fetch(`${URL.file}/${path}`).then(res => res.blob()).then(buffer => {
                const blob = new Blob([buffer])
                const data = window.URL.createObjectURL(blob)
                resolve({type: 'image', data})
            }).catch(error => resolve({type: 'error', data: error}))
        }
    })
}

export const refresh = (token: string) => {
    return new Promise(resolve => {
        fetch(URL.refresh, {
            headers: {
                Authorization: token
            }
        }).then(res => res.json()).then((data: Response) => {
            resolve(data)
        }).catch(error => {
            resolve(error)
        })
    })
}