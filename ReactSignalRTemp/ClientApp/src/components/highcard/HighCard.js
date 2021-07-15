import React, { Component } from 'react';
import * as signalR from '@microsoft/signalr';
import ScoreBoard from './Scoreboard';
import Waiting from './Waiting';

export class HighCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: {
                PlayerOne: { Name: '', Score: 0, Card: null },
                PlayerTwo: { Name: 'a', Score: 0, Card: null },
                NewDeck: [],
                ShuffledDeck: []
            },
            hubConnection: null,
            waiting: true
        };
    }

    // Mount the signalR client.
    // Mount an interval to check for active players.
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
        this.intervalId = setInterval(() => this.checkPlayers(), 100);
    }

    // Unmount the interval from the browser on page close.
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    // Checks to see if there are two players in the game object.
    checkPlayers = () => {
        if (this.state.game.PlayerOne.Name !== '' && this.state.game.PlayerTwo.Name !== '')
            this.startGame();
    }

    // Calls the methods to instantiate the deck and populate the game object in state.
    startGame = () => {
        this.setState({ waiting: false })
        this.createDeck();
    }

    // Instantiates the deck of cards in the state game object.
    createDeck = () => {
        for (let i = 1; i < 14; i++) {
            if (i === 1) this.makeCard('A');
            else if (i === 11) this.makeCard('J');
            else if (i === 12) this.makeCard('Q');
            else if (i === 13) this.makeCard('K');
            else this.makeCard(i.toString());
        }
    }

    // Helper method for the deck instantiation.
    makeCard = (value) => {
        let game = { ...this.state.game };
        game.NewDeck.push(new Card(value, 'clubs'));
        game.NewDeck.push(new Card(value, 'spades'));
        game.NewDeck.push(new Card(value, 'hearts'));
        game.NewDeck.push(new Card(value, 'diamonds'));
        this.setState({ game });
    }

    // Callback to register players from ScoreBoard
    registerPlayer = (name, p) => {
        let game = {...this.state.game};
        if (p === 1)
            game.PlayerOne.Name = name;
        if (p === 2)
            game.PlayerTwo.Name = name;
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
                    registerPlayer={this.registerPlayer}
                />
                <Waiting waiting={this.state.waiting} />
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
