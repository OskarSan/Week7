document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
    } else {
        fetch('/api/secret', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                document.body.innerHTML = `<div>${data.message}</div>`;
            } else {
                window.location.href = '/index.html';
            }
        })
     
    }
});