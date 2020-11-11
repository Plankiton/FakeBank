import {useState, useEffect} from 'react';
import axios from 'axios';
import './style.css';

var api_url = 'http://localhost:5000/api';
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


function getUser(pass, id) {
    return axios.get(`${api_url}/Client/${pass}/${id}`, conf);
}

function getUserByName(pass, name) {
    return axios.get(`${api_url}/Client/byname/${pass}/${name}`, conf);
}

async function getNameFromId(id) {
    var r = await axios.get(`${api_url}/Client/${id}`, conf);
    return r.data.name;
}

function getHistory(pass, id) {
    return axios.get(`${api_url}/Operation/${pass}/${id}`, conf);
}

function postUser(data){
    return axios.post(`${api_url}/Client`, data, conf);
}

function takeIn(data){
    return axios.post(`${api_url}/TakeIn`, data, conf);
}

function takeOut(data){
    return axios.post(`${api_url}/TakeOut`, data, conf);
}

function trade(data){
    return axios.post(`${api_url}/Trade`, data, conf);
}

function App() {
    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (user)
            getHistory(user.password, user.id).then((r) => {
                if (history !== r.data){
                    setHistory(r.data);
                }
            });

    });

    return user == null ? (
        <div id="login">
            <form className="login" onSubmit={(e) => {
                e.preventDefault();

                var name = e.target[0].value;
                var pass = e.target[1].value;
                getUserByName(pass, name)
                    .then((r) => {

                        setUser({
                            id: r.data.id,
                            name: r.data.name,
                            password: pass,
                            balance: r.data.balance,
                        });

                    }).catch((e) => {
                        postUser({
                            name: name,
                            password: pass
                        }).then((r) => {

                            setUser({
                                id: r.data.id,
                                name: r.data.name,
                                password: pass,
                                balance: r.data.balance,
                            });

                        });

                    })


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
            <h1 className="user">{user.name} <span className="id">id:{user.id}</span></h1>
            <p className="balance">Saldo: <span className="money">{user.balance.toFixed(2)} reais</span> 
            <button className="reload" onClick={() => {
                getUser(user.password, user.id).then((r) => {

                    if (r.data.balance !== user.balance){
                        setUser({
                            id: r.data.id,
                            name: r.data.name,
                            password: user.password,
                            balance: r.data.balance,
                        });

                        getHistory(user.password, user.id).then((r) => {
                            setHistory(r.data);
                        });

                    }

                });
            }}><img alt="reload" src="https://img.icons8.com/ios-filled/50/000000/update-left-rotation.png"/></button></p>

            <form className="function" onSubmit={(e) => {
                e.preventDefault();

                takeIn({
                    clientid: user.id,
                    value: parseFloat(e.target[0].value),
                    password: user.password,
                }).then((r) => {

                    getUser(user.password, user.id).then((r) => {

                        if (r.data.balance !== user.balance){
                            setUser({
                                id: r.data.id,
                                name: r.data.name,
                                password: user.password,
                                balance: r.data.balance,
                            });

                            getHistory(user.password, user.id).then((r) => {
                                setHistory(r.data);
                            });

                        }

                    });

                });
            }}>
                <label htmlFor="takein">Depositar dinheiro:</label>
                <input type="text" name="takein" id="takein" placeholder="Valor do deposito"/>
                <input type="submit" value="Depositar"/>
            </form>
            <form className="function" onSubmit={(e) => {
                e.preventDefault();

                takeOut({
                    clientid: user.id,
                    password: user.password,
                    value: parseFloat(e.target[0].value)
                }).then((r) => {

                    getUser(user.password, user.id).then((r) => {

                        if (r.data.balance !== user.balance){
                            setUser({
                                id: r.data.id,
                                name: r.data.name,
                                password: user.password,
                                balance: r.data.balance,
                            });

                            getHistory(user.password, user.id).then((r) => {
                                setHistory(r.data);
                            });

                        }

                    });

                });

            }}>
                <label htmlFor="takeout">Sacar dinheiro:</label>
                <input type="text" name="takeout" id="takeout" placeholder="Valor do saque"/>
                <input type="submit" value="Sacar"/>
            </form>

            <form className="function" onSubmit={(e) => {
                e.preventDefault();

                trade({
                    senderid: user.id,
                    password: user.password,
                    receiverid: parseInt(e.target[1].value),
                    value: parseFloat(e.target[0].value)
                }).then((r) => {

                    getUser(user.password, user.id).then((r) => {

                        if (r.data.balance !== user.balance){
                            setUser({
                                id: r.data.id,
                                name: r.data.name,
                                password: user.password,
                                balance: r.data.balance,
                            });

                            getHistory(user.password, user.id).then((r) => {
                                setHistory(r.data);
                            });

                        }

                    });

                });

            }}>
                <label htmlFor="trade">Transferir dinheiro:</label>
                <input type="text" name="trade" id="trade" placeholder="Valor da transferencia"/>
                <label htmlFor="receiver">Destinário:</label>
                <input type="text" name="receiver" id="receiver" placeholder="ID do receiver"/>
                <input type="submit" value="Transferencia"/>
            </form>

            <div>
                <h3 className="title">Extrato da conta</h3>

                <div className="operation-list">{
                    history.map((o) => {

                        var d = new Date(o.date);
                        o.date = d.toString().substring(0, 21);
                        var receiver = o.receiver;
                        var sender = o.sender;

                        return o.type !== "GetClient" ? (<div className="operation">
                            <p className="type">
                                {getType(o.type)}
                                { o.value ? (<span> de <span className="money">{parseFloat(o.value).toFixed(2)} reais</span></span>): "" }
                                { o.receiver && o.receiver !== user.id.toString()  ?
                                        (<span> para <span key="recv" className="id">Id:{receiver}</span></span>) : "" }
                                { o.sender && o.sender !== user.id.toString() ?
                                        (<span> de <span className="id">Id:{sender}</span></span>) : "" }
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
