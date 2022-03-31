const mainUrl = 'https://sensors-xxolsllgga-as.a.run.app',
mainHeader = {'Content-Type': 'application/json'}

function handleResponse(response) {    
    if (!response.ok) {        
        response.json().then(data => {            
            console.log(data.detail)      
        })
        throw Error(response.statusText)
    }    
}

async function request(method, url, params=undefined, body=undefined, resType="json", headers=mainHeader) {    
    const token = window.localStorage.getItem('token')
    let newUrl = new URL(`${mainUrl}${url}`)
    if (params !== undefined) {
        newUrl.search = new URLSearchParams(params).toString()
    }
    const res = await fetch(newUrl,
        {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                ...headers
            },
            body: JSON.stringify(body)
        },
    )
    handleResponse(res)
    if (resType === "json") return res.json()
    if (resType === "blob") return res.blob()
    if (resType === "none") return res
}

export { request }