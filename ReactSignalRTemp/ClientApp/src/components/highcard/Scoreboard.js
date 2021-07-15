import React from 'react';
import Register from './Register';

const ScoreBoard = (props) => (

    <section className="scoreboard">
        <div>
            {props.playerOne.Name !== '' ?
            (<div>
                <p>{props.playerOne.Score}</p>
                <h2>{props.playerOne.Name}</h2>
            </div>) :
            (<Register />)
            }
        </div>
        <div>
        {props.playerTwo.Name !== '' ?
            (<div>
                <p>{props.playerTwo.Score}</p>
                <h2>{props.playerTwo.Name}</h2>
            </div>) :
            (<Register />)
            }
        </div>
    </section>
);

export default ScoreBoard;