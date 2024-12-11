
const initLogin =() => {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        fetchData(e);
    })

}


const fetchData = async (e) => {
    e.preventDefault();

    const formData = {
        email: e.target.email.value,
        password: e.target.password.value,
    }

    try {

        const res = await fetch('api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })

        if (!res.ok){
            console.log(res)
            throw new Error('Failed to login');
        } else {
            const data = await res.json();
            console.log(data);
            
            if (data.token){
                console.log('Login successful');
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            }else{
                console.log('Invalid username or password');
            }

        }



    }catch(err){
        console.error(err);
    }


}

initLogin();