import {useState} from 'react';
import axios from 'axios';
import './style.css';

var api_url = 'http://localhost:5000/api';
var down = 'https://img.icons8.com/metro/26/000000/down--v1.png';
var conf = {
    headers: {
        'Control-Allow-Headers': 'Authorization',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }
}

function getType(t) {
    switch (t) {
        case 'Trade':
            return 'Transferência';
        case 'TakeIn':
            return 'Depósito';
        case 'TakeOut':
            return 'Saque';
        default:
            return 'Saldo';
    }
}

function App() {
    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);
    const [loadHistory, setLoadHistory] = useState(false);

    return user == null ? (
        <div id="login">
            <form onSubmit={(e) => {
                e.preventDefault();

                var name = e.target[0].value;
                var pass = e.target[1].value;
                axios.get(`${api_url}/Client/byname/${pass}/${name}`, conf)
                    .then((r) => {
                        console.log(r);
                        setUser({
                            id: r.data.id,
                            name: r.data.name,
                            password: pass,
                            balance: r.data.balance,
                        });
                    }).catch((e) => {
                        axios.post(`${api_url}/Client`, {
                            name: name,
                            password: pass
                        }, conf).then((r) => {
                            console.log(r);

                            setUser({
                                id: r.data.id,
                                name: r.data.name,
                                password: pass,
                                balance: r.data.balance,
                            });
                        }).catch((e) => {
                            console.log(e);
                        }).finally(() => {
                            console.log(pass, name);
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
            <p className="balance">Saldo: <span className="money">{user.balance.toFixed(2)} reais</span></p>
            <div>
                <button className="title" onClick={() => {
                    if (loadHistory)
                        setLoadHistory(false);
                    else setLoadHistory(true);
                    console.log(loadHistory);

                    var h = [];
                    if (loadHistory)
                        axios.get(`${api_url}/Operation/${user.password}/${user.id}`, conf).then((r) => {
                            h = r.data;
                            console.log(h);

                            setHistory(h);
                        });

                    else {
                        console.log('NULLing');
                        setHistory(h);
                    }

                    console.log(user);
                }}><h3 className="title">Extrato da conta <span><img alt="down" src={down}/></span></h3></button>

                <div className="operation-list">{
                    history.map((o) => {

                        var d = new Date(o.date);
                        o.date = d.toString().substring(0, 21);
                        return o.type !== "GetClient" ? (<div className="operation">
                            <p className="type">
                                {getType(o.type)}
                                { o.value ? (<span> de <span className="money">{parseFloat(o.value).toFixed(2)} reais</span></span>): "" }
                                { o.receiver ? ` para ${o.receiver}` : "" }
                                { o.sender && o.sender !== user.id.ToString() ? `de ${o.sender}` : "" }
                            </p>
                            <p className="date">{ o.date }</p>
                        </div>) : '';

                    })

                    }</div>

            </div>
        </div>
    );
}

export default App;
