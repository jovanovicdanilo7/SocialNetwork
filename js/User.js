class User {
    user_id = '';
    username = '';
    email = '';
    password = '';
    api_url = 'https://jsonplaceholder.typicode.com/';

    async createUser() {
        let userExists = await this.checkExistingUsers();
        if (userExists === 0) {
            let data = {
                username: this.username,
                email: this.email,
                password: this.password
            };
    
            data = JSON.stringify(data);
    
            fetch(this.api_url + '/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: data
                })
                .then(response => response.json())
                .then(data => {
                    let session = new Session();
                    session.user_id = data.id;
                    session.startSession();
    
                    window.location.href = 'hexa.html';
                })
                .catch(error => console.error('Error creating user:', error));
        } else if(userExists === 3){
            alert('Email already exists, please try another.');
        } else if(userExists === 2){
            alert('Username already exists, please try another.');
        } else{
            alert('Email and username already exists, please try another.');
        }
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
                    alert('Wrong email or password, please try again.');
                }
            });
    }

    async checkExistingUsers() {
        let response = await fetch(this.api_url + '/users');
        let data = await response.json();
    
        let is_there_any = 0;
        data.forEach(db_user => {
            if (db_user.email === this.email && db_user.username === this.username) {
                is_there_any = 1;
            } else if (db_user.username === this.username){
                is_there_any = 2;
            } else if(db_user.email === this.email){
                is_there_any = 3;
            }
        });
    
        return is_there_any;
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
