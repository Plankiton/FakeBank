import {useState} from 'react';
import axios from 'axios';
import './style.css';

var api_url = 'http://localhost:5000/api';
var down = 'https://img.icons8.com/metro/26/000000/down--v1.png';

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
    const [history, setHistory] = useState(null);
    const [loadHistory, setLoadHistory] = useState(false);

    return user == null ? (
        <div id="login">
            <form onSubmit={(e) => {
                e.preventDefault();

                var name = e.target[0].value;
                var pass = e.target[1].value;
                axios.get(`${api_url}/Client/byname/${pass}/${name}`)
                    .then((r) => {
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
                        }).then((r) => {
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
            <p className="balance">Saldo: <span className="money">{user.balance}</span></p>
            <div>
                <button className="title" onClick={() => {
                    if (loadHistory)
                        setLoadHistory(false);
                    else setLoadHistory(true);
                    console.log(loadHistory);

                    var h = user;
                    if (loadHistory && user)
                        axios.get(`${api_url}/Operation/${user.password}/${user.id}`).then((r) => {
                            h = r.data;
                            console.log(h);

                            setHistory(h);
                        });

                    else {
                        console.log('NULLing');
                        h = null
                        setHistory(h);
                    }

                    console.log(user);
                }}><h3 className="title">Extrato da conta <span><img alt="down" src={down}/></span></h3></button>

                { loadHistory && history ? history.map((o) => {
                    console.log("JOAO!!!!!");
                    console.log(o);
                    return (<div className="operation-list">
                        {o.type !== "GetClient" ?(<div className="operation">
                            <p className="type">
                                {getType(o.type)}
                                { o.value ? `de <span className="money">${o.value}</span>` : "" }
                                { o.receiver ? `Para ${o.receiver}` : "" }
                                { o.sender && o.sender !== user.id.ToString() ? `De ${o.sender}` : "" }
                            </p>
                            <p className="date">{ o.date }</p>
                        </div>):''}
                    </div>);

                }) : <p></p> }

            </div>
        </div>
    );
}

export default App;
