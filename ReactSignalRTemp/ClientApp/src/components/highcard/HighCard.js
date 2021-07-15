import React, { Component } from 'react';
import * as signalR from '@microsoft/signalr';
import ScoreBoard from './Scoreboard';

export class HighCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: {
                PlayerOne: { Name: '', Score: 0, Card: null },
                PlayerTwo: { Name: '', Score: 0, Card: null },
                NewDeck: [],
                ShuffledDeck: []
            },
            hubConnection: null
        };
    }

    // Mount the signalR client.
    // Call methods to create game populate game object in state.
    componentDidMount = () => {
        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("/testhub")
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.setState({ hubConnection }, () => {
            this.state.hubConnection
                .start()
                .then(() => console.log('it lives'))
                .catch((e) => console.log("opps: " + e));

            this.state.hubConnection.on("HighCard", (data) => {
                this.setState({ game: data });
            })
        });
        this.makeGame();
        this.createDeck();
        this.state.game.NewDeck.forEach(x => {
            console.log(x.Value + x.Suit);
        })
    }

    // Populate the game object with players
    makeGame = () => {
        var game = { ...this.state.game };
        game.PlayerOne.Name = 'Lucipurr';
        game.PlayerTwo.Name = 'Ethel';
        this.setState({ game });
    }

    // Instantiates the deck of cards in the state game object
    createDeck = () => {
        for (let i = 1; i < 14; i++) {
            if (i === 1) this.makeCard('A');
            else if (i === 11) this.makeCard('J');
            else if (i === 12) this.makeCard('Q');
            else if (i === 13) this.makeCard('K');
            else this.makeCard(i.toString());
        }
    }

    makeCard = (value) => {
        let game = {...this.state.game};
        game.NewDeck.push(new Card(value, 'clubs'));
        game.NewDeck.push(new Card(value, 'spades'));
        game.NewDeck.push(new Card(value, 'hearts'));
        game.NewDeck.push(new Card(value, 'diamonds'));
        this.setState({ game });
    }

    // Callback to send data to the SignalR server
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
                <ScoreBoard
                    playerOne={this.state.game.PlayerOne}
                    playerTwo={this.state.game.PlayerTwo}
                />
            </div>
        );
    }
}

export default HighCard;

class Card {
    constructor(value, suit) {
        this.Value = value;
        this.Suit = suit;
    }
}
