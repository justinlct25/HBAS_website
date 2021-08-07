import { push } from "connected-react-router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddNewForm from "../components/AddNewForm";
import { AddIcon, SearchIcon } from "../components/IconsOnly";
import "../css/TablePage.css";
import { setAddNewFormOpenAction } from "../redux/addNewForm/action";
import { setSelectedItemAction } from "../redux/assignDeviceModal/action";
import { getCompaniesDataListThunk } from "../redux/companies/thunk";
import { IRootState } from "../redux/store";
import { manageUserTableHeaders } from "../table/tableHeader";

const tableHeaders = manageUserTableHeaders;
const itemPerPage = 10;
const TABLE_WIDTH = "80%";

function ManageUser() {
  const [searchInput, setSearchInput] = useState("");

  const companiesDataList = useSelector(
    (state: IRootState) => state.companiesDataList
  );
  const isOpen = useSelector(
    (state: IRootState) => state.addNewForm.addNewForm.isOpen
  );

  const companiesList = companiesDataList.companiesDataList;
  const activePage = companiesDataList.activePage;
  const totalPage = companiesDataList.totalPage;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCompaniesDataListThunk(activePage));
  }, [dispatch, isOpen]);

  return (
    <div className="flex-center pageContainer">
      <div className="flex-center topRowContainer">
        <div
          className="flex-center"
          style={{
            position: "absolute",
            cursor: "pointer",
            left: 32,
          }}
          onClick={() => {
            dispatch(setAddNewFormOpenAction(true, "addNew"));
          }}
        >
          <AddIcon />
          <div
            style={{
              paddingLeft: "8px",
            }}
          >
            Add new user
          </div>
        </div>
        <div className="flex-center">
          <div className="flex-center" style={{ padding: "8px" }}>
            <input
              className="searchInput"
              placeholder={"Search"}
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  //Need Search function
                  dispatch(getCompaniesDataListThunk(1));
                }
              }}
            />
            <div
              style={{ cursor: "pointer", padding: "8px" }}
              onClick={() =>
                //Need Search function
                dispatch(getCompaniesDataListThunk(1))
              }
            >
              <SearchIcon />
            </div>
          </div>
        </div>
        <div />
      </div>
      <div
        className="table"
        style={{
          width: TABLE_WIDTH,
          marginBottom: "unset",
          height: `${itemPerPage * 60}px`,
        }}
      >
        <div className="flex-center tableHeader" style={{ width: TABLE_WIDTH }}>
          {tableHeaders.map((item, idx) => {
            return (
              <div key={item + idx} className="flex-center thItem">
                {item}
              </div>
            );
          })}
        </div>
        <div className="tableBody" style={{ width: TABLE_WIDTH }}>
          {companiesList &&
            companiesList.length > 0 &&
            companiesList.map((item, idx) => {
              return (
                <div
                  key={item.companyName}
                  className="flex-center tableRow"
                  onClick={() => {
                    dispatch(
                      setSelectedItemAction({
                        companyName: item.companyName,
                        companyId: item.id,
                        tel: item.tel,
                        contactPerson: item.contactPerson,
                      })
                    );
                    dispatch(push(`/profile/${item.id}`, { id: item.id }));
                  }}
                >
                  <div key={idx} className="flex-center tdItem">
                    {item.companyName}
                  </div>
                  <div key={idx} className="tdItem">
                    {item.contactPerson}
                  </div>
                  <div key={idx} className="tdItem">
                    {item.tel}
                  </div>
                  <div key={idx} className="tdItem">
                    {item.vehiclesCount}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <AddNewForm />
      <div className="flex-center" style={{ width: "100%" }}>
        <div
          style={{
            margin: "16px",
            fontSize: "30px",
            cursor: "pointer",
            color: activePage === 1 ? "#CCC" : "#555",
          }}
          onClick={
            activePage === 1
              ? () => {}
              : () => {
                  dispatch(getCompaniesDataListThunk(activePage - 1));
                }
          }
        >
          {"<"}
        </div>
        <div
          className="flex-center"
          style={{
            margin: "16px",
            fontSize: "20px",
          }}
        >
          {"Page " + activePage}
        </div>
        <div
          style={{
            margin: "16px",
            fontSize: "30px",
            cursor: "pointer",
            color: activePage !== totalPage ? "#555" : "#CCC",
          }}
          onClick={
            activePage !== totalPage
              ? () => {
                  if (activePage >= totalPage) {
                    return;
                  }
                  dispatch(getCompaniesDataListThunk(activePage + 1));
                }
              : () => {}
          }
        >
          {">"}
        </div>
      </div>
    </div>
  );
}

export default ManageUser;
