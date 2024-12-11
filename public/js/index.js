document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';

    } else {
        
        const res = await fetch('api/private', {
            method: 'GET',
            headers: {
                "authorization": `Bearer ${token}`
            }
        })
        console.log(res)
        if (!res.ok) {
            window.location.href = '/login.html';
        } else {
            const data = await res.json();
            console.log(data);
       
        }
     
    }


    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    })
});