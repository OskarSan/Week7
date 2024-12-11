
const initReg =() => {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        fetchData(e);
    })

}


const fetchData = async (e) => {
    e.preventDefault();

    
    const formData = {
        email: e.target.email.value,
        password: e.target.password.value
    }
    console.log(formData, "chheckki");

    try {
        const res = await fetch('api/user/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })

        if (!res.ok){
            console.log(res, "vituiks")
            throw new Error('Failed to register');
        } else {
           
            window.location.href = 'login.html';
           

        }
    }catch(err){
        console.error(err);
    }


}



initReg();