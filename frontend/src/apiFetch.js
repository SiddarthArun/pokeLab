export async function apiFetch(url,options={}){
    const token = localStorage.getItem('token')
    const headers = options.headers || {};
    if (token){
        headers['Authorization'] = `Bearer ${token}`
    }

    try{
        const response = await fetch(url,{...options, headers})

        if (response.status === 401){
            alert('Session expired. Please log in again')
            localStorage.removeItem('token')
            window.location.reload()
            return
        }
        return response
    } catch(err){
        console.error('Fetch error', err)
        throw err
    }
}