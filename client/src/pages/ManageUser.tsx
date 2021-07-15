import { push } from "connected-react-router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AddIcon,
  CaretIcon,
  CloseIcon,
  SearchIcon,
} from "../components/IconsOnly";
import "../css/TablePage.css";
import { getCompaniesDataListThunk } from "../redux/companies/thunk";
import { IRootState } from "../redux/store";
import { manageUserTableHeaders } from "../table/tableHeader";

const tableHeaders = manageUserTableHeaders;
const TABLE_WIDTH = "75%";

function ManageUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [popUpIsActive, setPopUpIsActive] = useState(false);
  const [placeHolderText, setPlaceHolderText] = useState("Select");
  const [searchInput, setSearchInput] = useState("");

  const companiesDataList = useSelector(
    (state: IRootState) => state.companiesDataList
  );

  const companiesList = companiesDataList.companiesDataList;
  const activePage = companiesDataList.activePage;
  const totalPage = companiesDataList.totalPage;
  //const limit = companiesDataList.limit;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCompaniesDataListThunk(activePage, false, placeHolderText, searchInput));
  }, [dispatch]);

  const [totalVehicle, setTotalVehicle] = useState<
    Array<{
      carPlate: string;
      vehicleType: string;
      vehicleModel: string;
    }>
  >([]);
  const [vehicleInput, setVehicleInput] = useState({
    carPlate: "",
    vehicleType: "",
    vehicleModel: "",
  });

  //const [idCheck, setIdCheck] = useState<number>(1);

  const handleDeleteVehicle = () => {};
  const handleAddVehicle = () => {
    setTotalVehicle([...totalVehicle, vehicleInput]);
  };

  return (
    <>
      <div className="flex-center pageContainer">
        <div className="flex-center topRowContainer">
          <div
            className="flex-center"
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              setPopUpIsActive(true);
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
            <div style={{ padding: "8px" }}>Search by:</div>
            <div
              style={{
                color: placeHolderText === "Select" ? "#ccc" : "#555",
                minWidth: "64px",
                transition: "all 1s ease",
              }}
            >
              {placeHolderText}
            </div>
            <div
              className="caretIconContainer"
              style={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
              onClick={() => setIsOpen(!isOpen)}
            >
              <CaretIcon />
            </div>
            <div className="flex-center" style={{ padding: "8px" }}>
              <input
                className="searchInput"
                placeholder={"Search"}
                value={searchInput}
                style={{
                  width: placeHolderText !== "Select" ? "240px" : "0px",
                }}
                onChange={(e)=>{
                  setSearchInput(e.target.value);
                }}
              />
              <div 
                style={{ cursor: "pointer", padding: "8px" }}
                onClick={
                  placeHolderText !== "Select"
                  ? () => {
                      // dispatch() something use value: searchInput & tableHeaders[0]
                      dispatch(getCompaniesDataListThunk(1, true, placeHolderText, searchInput));
                    }
                  : () => {}
                }
              >
                <SearchIcon />
              </div>
            </div>
          </div>
          <div />
          {/* <div style={{ position: "relative" }}> */}
          <div
            className="dropDownListContainer"
            style={{
              zIndex: 1,
              maxHeight: isOpen ? `${(tableHeaders.length + 1) * 64}px` : 0,
            }}
          >
            {isOpen &&
              tableHeaders.map((item, idx) => {
                return (
                  <div
                    key={item + idx}
                    className="flex-center dropDownItem"
                    style={{ height: isOpen ? "48px" : "0px" }}
                    onClick={() => {
                      setPlaceHolderText(item);
                      setIsOpen(false);
                    }}
                  >
                    {item}
                  </div>
                );
              })}
          </div>
          {/* </div> */}
        </div>
        <div className="table" style={{ width: TABLE_WIDTH }}>
          <div
            className="flex-center tableHeader"
            style={{ width: TABLE_WIDTH }}
          >
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
                    key={item.id}
                    className="flex-center tableRow"
                    onClick={() => dispatch(push("/profile"))}
                  >
                    <div key={idx} className="flex-center tdItem">
                      {item.company_name}
                    </div>
                    <div key={idx} className="tdItem">
                      {item.contact_person}
                    </div>
                    <div key={idx} className="tdItem">
                      {item.tel}
                    </div>
                    <div key={idx} className="tdItem">
                      {item.count}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div
          className={
            popUpIsActive
              ? "flex-center popUpContainer popUp"
              : "flex-center popUpContainer"
          }
        >
          <div className="popUpContent flex-center">
            <div
              className="closeIconContainer"
              onClick={() => setPopUpIsActive(false)}
            >
              <CloseIcon />
            </div>
            <div
              className="flex-center"
              style={{ height: "100%", width: "100%", flexDirection: "column" }}
            >
              <div className="flex-center form">
                <div className="flex-center companySection">
                  <div className="titleText">Company Details</div>
                  <div className="flex-center formRow">
                    <div className="formLeftColumn">Company Name :</div>
                    <div className="formRightColumn">
                      <input className="formInput" />
                    </div>
                  </div>
                  <div className="flex-center formRow">
                    <div className="formLeftColumn">Contact Person :</div>
                    <div className="formRightColumn">
                      <input className="formInput" />
                    </div>
                  </div>
                  <div className="flex-center formRow">
                    <div className="formLeftColumn">Phone Number :</div>
                    <div className="formRightColumn">
                      <input className="formInput" />
                    </div>
                  </div>
                </div>
                <div className="flex-center vehicleSection">
                  <div style={{ position: "relative", width: "100%" }}>
                    <div className="titleText">Vehicles</div>
                    {/* <div
                    className="flex-center formAddIconContainer"
                    onClick={() =>
                      setTotalVehicle([...totalVehicle, vehicleInput])
                    }
                  >
                    <AddIcon />
                    <div>Add New Vehicle</div>
                  </div> */}
                  </div>
                  {/* {totalVehicle.map((item, idx) => { */}
                  {/* return ( */}
                  {/* <div style={{ width: "100%" }}> */}
                  <div className="flex-center formRow">
                    <div className="formLeftColumn">Car Plate :</div>
                    <div className="formRightColumn">
                      <input
                        className="formInput"
                        value={vehicleInput.carPlate}
                        onChange={(e) =>
                          setVehicleInput({
                            ...vehicleInput,
                            carPlate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex-center formRow">
                    <div className="formLeftColumn">Vehicle Type :</div>
                    <div className="formRightColumn">
                      <input
                        className="formInput"
                        value={vehicleInput.vehicleType}
                        onChange={(e) =>
                          setVehicleInput({
                            ...vehicleInput,
                            vehicleType: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex-center formRow">
                    <div className="formLeftColumn">Vehicle Model :</div>
                    <div className="formRightColumn">
                      <input
                        className="formInput"
                        value={vehicleInput.vehicleModel}
                        onChange={(e) =>
                          setVehicleInput({
                            ...vehicleInput,
                            vehicleModel: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
              <div className="flex-center formButtonContainer">
                <div className="button" onClick={() => setPopUpIsActive(false)}>
                  Cancel
                </div>
                <div className="button">Confirm</div>
              </div>
            </div>
          </div>
        </div>
          <div className="flex-center" style={{ width: "100%" }}>
          <div
            style={{
              margin: "16px",
              fontSize: "30px",
              color: activePage === 1 ? "#CCC" : "#555",
            }}
            onClick={
              activePage === 1
                ? () => {}
                : () => {
                    dispatch(getCompaniesDataListThunk(activePage - 1, false, placeHolderText, searchInput));
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
              color: activePage !== totalPage ? "#555" : "#CCC",
            }}
            onClick={
              activePage !== totalPage
                ? () => {
                    if (activePage >= totalPage) {
                      return;
                    }
                    dispatch(getCompaniesDataListThunk(activePage + 1, false, placeHolderText, searchInput));
                  }
                : () => {}
            }
          >
            {">"}
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageUser;
