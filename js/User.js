console.log('Users je ucitan!');

class User {
    user_id = '';
    username = '';
    email = '';
    password = '';
    api_url = 'https://65d4c2303f1ab8c63435efed.mockapi.io';

    createUser() 
    {
        let data = 
        {
            username: this.username,
            email: this.email,
            password: this.password
        }

        data = JSON.stringify(data);

        fetch(this.api_url + '/users', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            let session = new Session();
            session.user_id = data.id;
            session.startSession();

            window.location.href = 'hexa.html';
        })
    }

    async get(user_id)
    {
        let resposne = await fetch(this.api_url + '/users/' + user_id);
        let data = await resposne.json();
        
        return data
    }

    edit()
    {
        let data = 
        {
            username: this.username,
            email: this.email
        };

        data = JSON.stringify(data);

        let session = new Session();
        session_id = session.getSession();

        fetch(this.api_url + '/users/' + session_id, 
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
        .then(response => response.json())
        .then(data => 
            {
                window.location.href = 'hexa.html';
            });
    }

    loginUser() 
    {
        fetch(this.api_url + '/users')
        .then(resposne => resposne.json())
        .then(data => 
            {
                let login_successful = 0;
                data.forEach(db_user => 
                    {
                        if(db_user.email === this.email && db_user.password === this.password)
                        {
                            let session = new Session();
                            session.user_id = db_user.id;
                            session.startSession();
                            login_successful = 1;
                            window.location.href = 'hexa.html';
                        }
                    });

                if(login_successful === 0)
                {
                    // console.log('Pogresan email ili lozinka!');
                    alert('Pogresan email ili lozinka!');
                }
            });
    }

    delete()
    {
        let session = new Session();
        session_id = session.getSession();

        fetch(this.api_url + '/users/' + session_id, 
        {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => 
            {
                let session = new Session();
                session.destroySession();

                window.location.href = "/";
            })
    }
}