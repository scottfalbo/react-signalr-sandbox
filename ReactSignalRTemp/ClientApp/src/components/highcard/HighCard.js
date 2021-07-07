import React, { Component } from 'react';
import * as signalR from '@microsoft/signalr';

class HighCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game : null,
            hubConnection: null
        };
    }

    componentDidMount = () => {

        this.setState({ user : window.prompt('Your name:', ' ') });

        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("/testhub")
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.setState({ hubConnection }, () => {
            this.state.hubConnection
                .start()
                .then(() => console.log('it lives'))
                .catch((e) => console.log("opps: "+ e));

            this.state.hubConnection.on("HighCard", (data) => {
                this.setState({ game : data });
            })
        });
    }

    sendSignal = () => {
        let testObject;
        this.state.hubConnection
            .invoke('HighCardSignal', testObject)
            .catch((e) => console.log(e));

    }

    render() {
        return (
            <div>
                <button onClick={this.sendSignal}>Draw</button>

                <div>
                    {this.state.log.map((msg, index) => (
                        <span style={{display: 'block'}} key={index}> {msg} </span>
                    ))}
                </div>
            </div>
        );
    }
}

export default HighCard;