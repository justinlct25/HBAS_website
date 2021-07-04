import React from 'react';
import ShowRecord from '../components/ShowRecord';

function LandingPage() {
    return (
        <div>
            <h1>Welcome to your handbrake-system</h1>
            <h3>Press top-right-side</h3>
            <h3>button to control pages</h3>
            <ShowRecord addNum={0}/>
        </div>
    )
}

export default LandingPage;
