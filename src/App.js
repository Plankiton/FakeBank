import {useState} from 'react';
import axios from 'axios';
import './style.css';

var api_url = 'http://localhost/api';
var down = 'https://img.icons8.com/metro/26/000000/down--v1.png';

var h = {
    headers: {
        'Control-Allow-Headers': 'Authorization',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }
}

function App() {
    const [user, setUser] = useState(null);

    return user == null ? (
        <div id="login">
            <form onSubmit={(e) => {
                e.preventDefault();

                var user = e.target[0].value;
                var pass = e.target[1].value;
                axios.get(`${api_url}/Client/${pass}/${user}`, h)
                    .then((r) => {
                        console.log(r);

                        setUser({
                            name: r.data.name,
                            password: pass,
                            balance: r.data.balance
                        });
                    }).catch((e) => {
                        console.log(e);

                        axios.post(`${api_url}/Client`, {
                            name: user,
                            password: pass
                        }, h).then((r) => {
                            console.log(r);

                            setUser({
                                name: r.data.name,
                                password: pass,
                                balance: r.data.balance
                            });
                        }).catch((e) => {
                            console.log(e);
                        });

                    });

            }}>
                <h1>Login</h1>
                <label htmlFor="user">Usuário</label>
                <input type="text" name="user" id="user"/>

                <label htmlFor="password">password</label>
                <input type="password" name="password" id="password"/>

                <p className='sign-up'>Se não tiver conta será criada</p>
                <input type="submit" name="send" id="send" value="Enviar"/>
            </form>
        </div>
    ) : (
        <div id="conta">
            <h1 className="user">{user.name}</h1>
            <p className="balance">Saldo: <span className="money">{user.balance}</span></p>
            <div>
                <h3 className="title">Extrato da conta <span><img alt="down" src={down}/></span></h3>
                <div className="operation_list">
                    <div className="operation">
                        <p className="type">Transferência de <span className="money">30.35</span> Para Maria</p>
                        <p className="date">23:30 03-05-2020</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
