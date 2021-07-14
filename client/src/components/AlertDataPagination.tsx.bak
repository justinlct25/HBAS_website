import React from 'react';
import { useDispatch } from 'react-redux';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { getAlertDataListThunk } from '../redux/alertDataPage/thunk';

interface pageProps{
    activePage: number;
    totalPage: number;
}
function AlertDataPagination(props:pageProps) {
    const dispatch = useDispatch();
    const prevButton = () =>{
        if(props.activePage <= 1){ return; }
        dispatch(getAlertDataListThunk((props.activePage - 1) ,false));
    }
    const nextButton = () =>{
        if(props.activePage >= props.totalPage){ return; }
        dispatch(getAlertDataListThunk((props.activePage + 1) ,false));
    }
    const firstButton = () =>{
        if(props.activePage <= 1){ return; }
        dispatch(getAlertDataListThunk(1 ,false));
    }
    const lastButton = () =>{
        if(props.activePage >= props.totalPage){ return; }
        dispatch(getAlertDataListThunk(props.totalPage , false));
    }
    const refreshButton = () =>{
        dispatch(getAlertDataListThunk(props.activePage ,true));
    }

    return (
        <Pagination size="lg" aria-label="handbrake_data" className="pageChange">
            <PaginationItem>
              <PaginationLink first onClick={()=> firstButton()} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink previous onClick={()=> prevButton()} />
            </PaginationItem>
            <PaginationItem active>
              <PaginationLink>
                {props.activePage}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink next onClick={()=> nextButton()} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink last onClick={()=> lastButton()} />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink onClick={()=> refreshButton()}>
                    &#x27F3;
                </PaginationLink>
            </PaginationItem>
        </Pagination>
    )
}

export default AlertDataPagination;
