import React from 'react';

const ScoreBoard = (props) => (
  <section className="scoreboard">
    <div>
      <p>{props.playerOne.Score}</p>
      <h2>{props.playerOne.Name}</h2>
    </div>
    <div>
      <h2>{props.playerTwo.Name}</h2>
      <p>{props.playerTwo.Score}</p>
    </div>
  </section>
);

export default ScoreBoard;