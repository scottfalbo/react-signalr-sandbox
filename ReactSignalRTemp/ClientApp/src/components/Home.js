import React, { Component } from 'react';
import Tester from './Tester';

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div>
        <h1>SignalR Chat</h1>
        <Tester />
      </div>
    );
  }
}
