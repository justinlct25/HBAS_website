import React from 'react';

interface IAlertDataProps{
    id: number;
    date: string;
    time: string;
    latitude: string;
    longitude: string;
    battery: string;
}

function alertDataTable({id, date, time, latitude, longitude, battery}:IAlertDataProps) {
    return (
        <tr>
            <th scope="row">{id}</th>
            <td>{date}</td>
            <td>{time}</td>
            <td>{latitude}</td>
            <td>{longitude}</td>
            <td>{battery}</td>
        </tr>
    )
}

export default alertDataTable;
