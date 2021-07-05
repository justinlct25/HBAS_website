import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Table } from 'reactstrap';
import AlertDataTable from '../components/AlertDataTable';
import { getAlertDataListThunk } from '../redux/alertDataPage/thunk';
import { IRootState } from '../redux/store';

function AlertDataPage() {
    const alertDataList = useSelector((state:IRootState)=> state.alertDataPage.alertDataList);
    const activePage = useSelector((state:IRootState)=> state.alertDataPage.activePage);
    const dispatch = useDispatch();
    // page, useState 
    
    useEffect(() => {
        dispatch(getAlertDataListThunk(1, true));
        console.log('reload');
    }, [dispatch]);

    console.log(alertDataList);
    const refreshButton = () =>{
        dispatch(getAlertDataListThunk((activePage+1) ,false));
    }

    return (
        <Container>
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
                        {alertDataList && alertDataList.length > 0 && (
                            alertDataList.map((data, idx)=> (
                            <AlertDataTable 
                                key={idx + 1}
                                id={idx + 1}
                                date={data.date}
                                time={data.time}
                                latitude={data.latitude}
                                longitude={data.longitude}
                                battery={data.battery}
                            />   
                        )))}
                    </tbody>
                </Table>
                
                        
                { <Button className="refreshButton" onClick={refreshButton}>Refresh</Button>}        
                

        </Container>
    )
}

export default AlertDataPage;
