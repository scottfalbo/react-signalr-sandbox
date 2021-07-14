import React, { Component } from 'react';
import * as signalR from '@microsoft/signalr';


class Tester extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            input: '',
            log: [],
            hubConnection: null
        };
    }

    componentDidMount = () => {

        // if (this.state.user === '')
        //     this.setState({ user : window.prompt('Your name:', ' ') });

        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("/testhub")
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.setState({ hubConnection }, () => {
            this.state.hubConnection
                .start()
                .then(() => console.log('it lives'))
                .catch((e) => console.log("opps: "+ e));

            this.state.hubConnection.on("HeyYou", (data) => {
                this.setState({ log : data });
            })
        });
    }

    sendSignal = () => {
        // this.state.log.push(this.state.input);
        const testObject = new TestObject(this.state.user, this.state.input, this.state.log);
        this.state.hubConnection
            .invoke('SendSignal', testObject)
            .catch((e) => console.log(e));

        this.setState({ input : '' });

    }

    render() {
        return (
            <div>
                <input type='text' value={this.state.input}
                    onChange={e => this.setState({ input : e.target.value })} />
                <button onClick={this.sendSignal}>Send</button>

                <div>
                    {this.state.log.map((msg, index) => (
                        <span style={{display: 'block'}} key={index}> {msg} </span>
                    ))}
                </div>
            </div>
        );
    }
}

export default Tester;

class TestObject {
        constructor(user, input, log) {
            this.User = user;
            this.Input = input;
            this.Log = log;
        }
}