import React, { Component } from 'react';
import * as signalR from '@microsoft/signalr';

export class HighCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game : {
              PlayerOne : { Name : ''},
              PlayerTwo : { Name : ''}
            },
            hubConnection: null
        };
    }

    componentDidMount = () => {
        this.makeGame();
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

    makeGame = () => {

      var game = {...this.state.game};
      game.PlayerOne.Name = 'Lucipurr';
      game.PlayerTwo.Name = 'Ethel';

      this.setState({ game });
      console.log(this.state.game);
    }

    sendSignal = () => {
        let gameObject;
        this.state.hubConnection
            .invoke('HighCardSignal', gameObject)
            .catch((e) => console.log(e));

    }


    render() {
        return (
            <div>
                {/* <button onClick={this.sendSignal}>Draw</button> */}
                <h2>Player One: {this.state.game.PlayerOne.Name}</h2>
                <h2>Player One: {this.state.game.PlayerTwo.Name}</h2>
            </div>
        );
    }
}

export default HighCard;
