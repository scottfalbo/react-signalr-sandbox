import React from 'react';
import Register from './Register';

const ScoreBoard = (props) => {

    const registerPlayer = (name, p) => {
        props.registerPlayer(name, p);
    }

    return (
        <section className="scoreboard">
            <div>
                {props.playerOne.Name !== '' ?
                (<div>
                    <p>{props.playerOne.Score}</p>
                    <h2>{props.playerOne.Name}</h2>
                </div>) :
                (<Register  
                    registerPlayer={registerPlayer}
                    player={1}
                />)
                }
            </div>
            <div>
            {props.playerTwo.Name !== '' ?
                (<div>
                    <p>{props.playerTwo.Score}</p>
                    <h2>{props.playerTwo.Name}</h2>
                </div>) :
                (<Register  
                    registerPlayer={registerPlayer}
                    player={2}
                />)
                }
            </div>
        </section>
    );
}

export default ScoreBoard;