
const baseUrl = 'http://47.97.11.78:8080'
const URL = {
    login: baseUrl + '/login',
    getFileList: baseUrl + '/filelist',
    refresh: baseUrl + '/refresh'
}

interface Response {
    data: any
    msg: string
    ok: boolean
}

const login = (identity: string): Promise<Response> => {
    return new Promise(resolve => {
        fetch(`${URL.login}?admin=${identity}`).then(res => res.json()).then((data: Response) => {
            resolve(data)
        })
    })
}

export interface Universal {
    [key: string]: any
}

const getFileList = (token: string, path = ''): Promise<Response> => {
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

const getFile = (path: string) => {

}

const refresh = (token: string) => {
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

export {
    getFileList,
    login,
    refresh
}