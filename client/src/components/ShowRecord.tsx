import React, { useState } from 'react';

interface TestNum {
    addNum: number;
}

function ShowRecord(props: TestNum) {
    const [countNum, setCountNum] = useState<number>(props.addNum);

    const addNum = ()=> {
        setCountNum(countNum + 1);
    }
    const decreaseNum = ()=> {
        setCountNum(countNum - 1);
    }
    return (
        <div>
            <h1>This is show record component.</h1>
            <h2>{countNum}</h2>
            <button onClick={addNum}>Click me to add 1</button>
            <button onClick={decreaseNum}>Click me to decrease 1</button>
        </div>
    )
}

export default ShowRecord;
