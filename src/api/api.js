async function fetch_all_pages(url){
    let vaiindo = true
    let result = []
    let page = 1
    while(vaiindo){
        const response = await fetch(`${url}?page=${page}`)
        const tmpitems = await response.json()
        if(tmpitems.length > 0){
            result = result.concat(tmpitems)
            page++
        } else {
            vaiindo = false
        }
    }
    return result
}

export const api = {
    async search_users(searchstring){
        const url = `https://api.github.com/search/users?q=${searchstring}`
        const response = await fetch(url)
        return await response.json()
    },
    async lista_repos(username){
        const url = `https://api.github.com/users/${username}/repos`
        const data = await fetch_all_pages(url)
        return data
    },
    async listaContents(owner, nameRepo) {
        const url = `https://api.github.com/repos/${owner}/${nameRepo}/contents/`
        const response = await fetch(url)
        return await response.json()
    },
    async listaArchive(owner, nameRepo, path) {
        debugger
        const url = `https://api.github.com/repos/${owner}/${nameRepo}/contents/${path}`
        const response = await fetch(url)
        return await response.json()
    },
    async listaFolder(owner, nameRepo, path, default_branch) {
        debugger
        const url = `https://raw.githubusercontent.com/${owner}/${nameRepo}/${default_branch}/${path}`
        const response = await fetch(url)
        return await response.json()
    },
}
