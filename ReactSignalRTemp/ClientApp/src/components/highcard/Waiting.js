import React from 'react';

const Waiting = (props) => {
    if (props.waiting) {
        return (
            <section className="waiting">
                <p>waiting on players</p>
            </section>
        )
    }
    return null;
}

export default Waiting;