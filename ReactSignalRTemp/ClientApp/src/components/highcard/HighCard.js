import React, { Component } from 'react';
import * as signalR from '@microsoft/signalr';
import ScoreBoard from './Scoreboard';
import GameBoard from './GameBoard';

export class HighCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: {
                PlayerOne: { Name: '', Score: 0, Card: null },
                PlayerTwo: { Name: '', Score: 0, Card: null },
                NewDeck: []
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

            this.state.hubConnection.on("HighCard", (data, waiting) => {
                let game = { ...this.state.game };
                game = data;
                this.setState({ game, waiting : waiting });
            })
        });
    }

    // Calls the methods to instantiate the deck and populate the game object in state.
    startGame = () => {
        this.setState({ waiting: false });
        this.createDeck();
        this.shuffleDeck();     
        this.sendSignal();
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

    // Create a shuffled deck object in state by swapping random cards 1000 times
    shuffleDeck = () => {
        let game = { ...this.state.game };
        for (let i = 0; i < 1000; i++) {
            let x = this.randomNumber();
            let y = this.randomNumber();
            let holder = game.NewDeck[x];
            game.NewDeck[x] = game.NewDeck[y];
            game.NewDeck[y] = holder;
        }
        this.setState({ game });
    }
    // Helper random number generator.
    randomNumber = () => (
        Math.floor((Math.random() * (52 - 1)))
    );

    // Callback to register players from ScoreBoard
    registerPlayer = (name, p) => {
        let game = { ...this.state.game };
        if (p === 1)
            game.PlayerOne.Name = name;
        if (p === 2)
            game.PlayerTwo.Name = name;
        this.setState({ game });
        this.sendSignal();

    }

    // Callback to send data to the SignalR server
    sendSignal = () => {
        let gameObject = this.state.game;
        this.state.hubConnection
            .invoke('HighCardSignal', gameObject, this.state.waiting)
            .catch((e) => console.log(e));
    }

    render() {
        const game = { ...this.state.game };
        const waiting = this.state.waiting;

        return (
            <div>
                {/* <button onClick={this.sendSignal}>Draw</button> */}
                <ScoreBoard
                    playerOne={this.state.game.PlayerOne}
                    playerTwo={this.state.game.PlayerTwo}
                    registerPlayer={this.registerPlayer}
                />
                {game.PlayerOne.Name !== '' && game.PlayerTwo.Name !== '' && this.state.waiting ?
                    (<button onClick={this.startGame.bind(this)}>Start Game</button>) :
                    this.state.waiting ?
                        (<section className="waiting-button">
                            <p>waiting on players</p>
                        </section>) :
                        null
                }
                {!waiting ?
                    (<GameBoard
                        game={this.state.game}
                    />) :
                    (<div></div>)}
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
