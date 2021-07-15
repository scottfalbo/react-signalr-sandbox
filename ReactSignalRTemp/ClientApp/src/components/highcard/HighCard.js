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
        console.log('game on');
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
        const game = {...this.state.game};

        return (
            <div>
                {/* <button onClick={this.sendSignal}>Draw</button> */}
                <ScoreBoard
                    playerOne={this.state.game.PlayerOne}
                    playerTwo={this.state.game.PlayerTwo}
                    registerPlayer={this.registerPlayer}
                />
                {game.PlayerOne.Name !== '' && game.PlayerTwo.Name !== '' ?
                (<button onClick={this.startGame.bind(this)}>Start Game</button>) :
                (<section className="waiting-button">
                    <p>waiting on players</p>
                </section>)


                }
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
