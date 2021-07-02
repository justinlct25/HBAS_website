import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'reactstrap';
import { getAlertDataListThunk } from '../redux/alertDataPage/thunk';
import { IRootState } from '../redux/store';

function AlertDataPage() {
    const alertDataList = useSelector((state:IRootState)=> state.alertDataPage.alertDataList);
    const dispatch = useDispatch();
    // page, useState
    
    useEffect(() => {
        dispatch(getAlertDataListThunk(true));
    }, [dispatch]);
    return (
        <div>
                <Table striped>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>date</th>
                            <th>time</th>
                            <th>latitude</th>
                            <th>longitude</th>
                            <th>battery</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alertDataList.length > 0 && alertDataList.map((data, idx)=>(
                            <tr>
                                <th scope="row">{idx}</th>
                                <td>{data.date}</td>
                                <td>{data.time}</td>
                                <td>{data.latitude}</td>
                                <td>{data.longitude}</td>
                                <td>{data.battery}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
        </div>
    )
}

export default AlertDataPage;
