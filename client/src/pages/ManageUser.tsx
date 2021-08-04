import { push } from "connected-react-router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AddIcon,
  CaretIcon,
  CloseIcon,
  MinusIcon,
  SearchIcon,
} from "../components/IconsOnly";
import "../css/TablePage.css";
import { setSelectedItemAction } from "../redux/assignDeviceModal/action";
import {
  getCompaniesDataListThunk,
  postCompaniesDataThunk,
} from "../redux/companies/thunk";
import { IRootState } from "../redux/store";
import { manageUserTableHeaders } from "../table/tableHeader";

const tableHeaders = manageUserTableHeaders;
const itemPerPage = 10;
const TABLE_WIDTH = "80%";

function ManageUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [popUpIsActive, setPopUpIsActive] = useState(false);
  const [placeHolderText, setPlaceHolderText] = useState("Select");
  const [searchInput, setSearchInput] = useState("");
  const [totalVehicle, setTotalVehicle] = useState<
    Array<{
      carPlate: string;
      vehicleType: string;
      vehicleModel: string;
    }>
  >([]);

  const [companyDetail, setCompanyDetail] = useState<
    Array<{
      companyName: string;

      contactPerson: string;
      tel: string;
    }>
  >([{ companyName: "", contactPerson: "", tel: "" }]);

  const companiesDataList = useSelector(
    (state: IRootState) => state.companiesDataList
  );

  const companiesList = companiesDataList.companiesDataList;
  const activePage = companiesDataList.activePage;
  const totalPage = companiesDataList.totalPage;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCompaniesDataListThunk(activePage));
  }, [dispatch, popUpIsActive]);

  const handleDeleteVehicle = (idx: number) => {
    const newArr = totalVehicle.slice();
    newArr.splice(idx, 1);
    setTotalVehicle(newArr);
  };
  const handleAddVehicle = () => {
    setTotalVehicle([
      { carPlate: "", vehicleType: "", vehicleModel: "" },
      ...totalVehicle,
    ]);
  };

  const handleReset = () => {
    setTotalVehicle([]);
    setCompanyDetail([{ companyName: "", contactPerson: "", tel: "" }]);
    setPopUpIsActive(false);
  };

  return (
    <>
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
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    dispatch(getCompaniesDataListThunk(1));
                  }
                }}
              />
              <div
                style={{ cursor: "pointer", padding: "8px" }}
                onClick={
                  placeHolderText !== "Select"
                    ? () => {
                        dispatch(getCompaniesDataListThunk(1));
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
                if (item !== "Number of Vehicles") {
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
                }
              })}
          </div>
          {/* </div> */}
        </div>
        <div
          className="table"
          style={{
            width: TABLE_WIDTH,
            marginBottom: "unset",
            height: `${itemPerPage * 60}px`,
          }}
        >
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
                    onClick={() => {
                      //dispatch something ...
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
        <div
          className={
            popUpIsActive
              ? "flex-center popUpContainer popUp"
              : "flex-center popUpContainer"
          }
        >
          <div className="popUpContent flex-center">
            <div className="closeIconContainer" onClick={handleReset}>
              <CloseIcon color={"#555"} />
            </div>
            <div className="formScreen">
              <div className="flex-center form">
                <div className="flex-center companySection">
                  <div className="titleText">Company Details</div>
                  <div className="flex-center formRow">
                    <div className="formLeftColumn">Company Name :</div>
                    <div className="formRightColumn">
                      <input
                        className="formInput"
                        value={companyDetail[0].companyName}
                        onChange={(e) => {
                          const newArr = companyDetail.slice();
                          newArr[0] = {
                            ...companyDetail[0],
                            companyName: e.target.value,
                          };
                          setCompanyDetail(newArr);
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-center formRow">
                    <div className="formLeftColumn">Contact Person :</div>
                    <div className="formRightColumn">
                      <input
                        className="formInput"
                        value={companyDetail[0].contactPerson}
                        onChange={(e) => {
                          const newArr = companyDetail.slice();
                          newArr[0] = {
                            ...companyDetail[0],
                            contactPerson: e.target.value,
                          };
                          setCompanyDetail(newArr);
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-center formRow">
                    <div className="formLeftColumn">Phone Number :</div>
                    <div className="formRightColumn">
                      <input
                        className="formInput"
                        value={companyDetail[0].tel}
                        onChange={(e) => {
                          const newArr = companyDetail.slice();
                          newArr[0] = {
                            ...companyDetail[0],
                            tel: e.target.value,
                          };
                          setCompanyDetail(newArr);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-center vehicleSection">
                  <div style={{ position: "relative", width: "100%" }}>
                    <div className="titleText">Vehicles</div>
                    <div
                      className="flex-center formAddIconContainer"
                      onClick={() => handleAddVehicle()}
                    >
                      <AddIcon />
                      <div style={{ marginLeft: "8px" }}>Add New Vehicle</div>
                    </div>
                  </div>
                  {totalVehicle.map((item, idx) => {
                    return (
                      <div
                        style={{
                          width: "100%",
                          marginBottom: "24px",
                          position: "relative",
                        }}
                      >
                        <h1>{totalVehicle.length - idx}</h1>
                        <div className="flex-center formRow">
                          <div className="formLeftColumn">Car Plate :</div>
                          <div className="formRightColumn">
                            <input
                              className="formInput"
                              value={totalVehicle[idx].carPlate}
                              onChange={(e) => {
                                const newArr = totalVehicle.slice();
                                newArr[idx] = {
                                  ...totalVehicle[idx],
                                  carPlate: e.target.value,
                                };
                                setTotalVehicle(newArr);
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex-center formRow">
                          <div className="formLeftColumn">Vehicle Type :</div>
                          <div className="formRightColumn">
                            <input
                              className="formInput"
                              value={totalVehicle[idx].vehicleType}
                              onChange={(e) => {
                                const newArr = totalVehicle.slice();
                                newArr[idx] = {
                                  ...totalVehicle[idx],
                                  vehicleType: e.target.value,
                                };
                                setTotalVehicle(newArr);
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex-center formRow">
                          <div className="formLeftColumn">Vehicle Model :</div>
                          <div className="formRightColumn">
                            <input
                              className="formInput"
                              value={totalVehicle[idx].vehicleModel}
                              onChange={(e) => {
                                const newArr = totalVehicle.slice();
                                newArr[idx] = {
                                  ...totalVehicle[idx],
                                  vehicleModel: e.target.value,
                                };
                                setTotalVehicle(newArr);
                              }}
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            right: 0,
                            top: "50%",
                            width: "10%",
                          }}
                          className="flex-center formAddIconContainer"
                          onClick={() => handleDeleteVehicle(idx)}
                        >
                          <MinusIcon />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex-center formButtonContainer">
                <div className="button" onClick={handleReset}>
                  Cancel
                </div>
                <div
                  className="button"
                  onClick={() => {
                    dispatch(
                      postCompaniesDataThunk(totalVehicle, companyDetail)
                    );
                    handleReset();
                  }}
                >
                  Confirm
                </div>
              </div>
            </div>
          </div>
        </div>
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
    </>
  );
}

export default ManageUser;
