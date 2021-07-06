import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Container, Table } from 'reactstrap';
import AlertDataPagination from '../components/AlertDataPagination';
import AlertDataTable from '../components/AlertDataTable';
import { getAlertDataListThunk } from '../redux/alertDataPage/thunk';
import { IRootState } from '../redux/store';

function AlertDataPage() {
    const alertDataList = useSelector((state:IRootState)=> state.alertDataPage.alertDataList);
    const activePage:number = useSelector((state:IRootState)=> state.alertDataPage.activePage);
    const totalPage:number|null = useSelector((state:IRootState)=> state.alertDataPage.totalPage);
    const limit:number = useSelector((state:IRootState)=> state.alertDataPage.limit);
    const dispatch = useDispatch(); 
    const [idCheck, setIdCheck] = useState<number>(1);
    
    useEffect(() => {
        dispatch(getAlertDataListThunk(1, true));
    }, [dispatch]);

    useEffect(()=>{
        let sum:number = limit * (activePage - 1);
        setIdCheck(sum);
    }, [activePage, limit]);

    return (
        <Container>
            <Table striped>
                <thead>
                    <tr>
                        <th>###</th>
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
                            id={idx + idCheck + 1}
                            date={data.date}
                            time={data.time}
                            latitude={data.latitude}
                            longitude={data.longitude}
                            battery={data.battery}
                        />   
                    )))}
                </tbody>
            </Table>
            
            {alertDataList && alertDataList.length > 0 && 
                <AlertDataPagination activePage={activePage} totalPage={totalPage} />
            }
            {alertDataList && alertDataList.length === 0 &&
                <Alert className="handbrake_data" color="success">
                    <b>Congratulations! Your have the best parking habits!</b>
                </Alert>
            }
        </Container>
    )
}

export default AlertDataPage;
