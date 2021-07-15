import React, {Component } from 'react';

export class GameBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <section className='game-board'>
                {this.props.game.PlayerOne.Name}
                {this.props.game.PlayerTwo.Name}
                {this.props.game.NewDeck[0].Value}
            </section>
        );
    }
}

export default GameBoard;