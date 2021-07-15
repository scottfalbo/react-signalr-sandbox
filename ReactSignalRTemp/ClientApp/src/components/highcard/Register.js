import React, { Component } from 'react';

export class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formInput : ''
        };
    }



    render() {
        return(
            <div>
                register player
            </div>
        );
    }
}

export default Register;