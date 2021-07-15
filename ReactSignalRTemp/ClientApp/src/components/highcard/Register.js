import React, { Component } from 'react';

export class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formInput: ''
        };
    }

    // Update input as user interacts with form.
    handleInput(e) {
        this.setState({
            formInput: e.target.value
        });
    }


    registerPlayer() {
        this.props.registerPlayer(this.state.formInput, this.props.player);
        this.setState({ formInput: '' });
    }

    render() {
        return (
            <section className="register-player">
                <input type="text" value={this.state.query} onChange={this.handleInput.bind(this)} placeholder="enter name" required />
                <button onClick={this.registerPlayer.bind(this)}>Join</button>
            </section>
        );
    }
}

export default Register;