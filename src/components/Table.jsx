import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import Icon from "./utils/Icon";
import Button from "./utils/Button";
import Tooltip from "./utils/Tooltip";

const Table = ({ columns, data, title, handleFilter, pagination = true, selectableRows = false, onRowClicked, exportable = false, csvData, filename }) => {
    const [filterText, setFilterText] = useState("");

    // Custom styles for the table
    const customStyles = {
        headCells: {
            style: {
                backgroundColor: "#003397",
                color: "white",
                fontWeight: "bold",
            },
        },
        rows: {
            style: {
                minHeight: "45px",
            },
        },
    };

    const sortIcon = <Icon name="RiArrowUpSLine" size={20} />;

    const filteredData = data.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(filterText.toLowerCase())
        )
    );

    // alert(JSON.stringify(filteredData));

    return (
        <div className="shadow">
            <div className="py-2 shadow-md px-2 md:px-5">
                <div className="grid grid-cols-5 max-md:grid-cols-3 gap-4 mb-3">
                    <div className="col-span-2">
                        <span className="font-bold text-xl text-primary">{title}</span>
                    </div>
                    <div className="col-span-3">
                        <div className="flex justify-end gap-6">
                            <div className="flex md:w-5/12">
                                <input
                                    type="text"
                                    placeholder="Type to search..."
                                    value={filterText}
                                    onChange={(e) => setFilterText(e.target.value)}
                                    className="px-2 py-0.5 border border-primary rounded w-full"
                                />
                                <div className="flex items-center bg-primary border rounded-r border-primary px-3 ml-[-20px]">
                                    <Icon name="IoSearchSharp" size={20} color="#fff" />
                                </div>
                            </div>
                            <div className="">
                                <Tooltip
                                    message={"Advance Filter"}
                                    position="top"
                                    delay={200}
                                    offset={8}
                                >
                                    <button className="bg-primary rounded-full p-1.5 shadow-md"
                                        onClick={handleFilter}
                                    >
                                        <Icon name="RiFilter2Line" size={18} color="#fff" />
                                    </button>
                                </Tooltip>
                            </div>

                            <div>
                                {exportable === true && (
                                    <CSVLink
                                        data={csvData ? csvData : filteredData}
                                        filename={filename ? filename : "export.csv"}
                                        className="px-3 py-0.5 bg-primary text-white text-semibold rounded flex items-center gap-2 shadow"
                                    >
                                        <Icon name="RiFileExcel2Line" size={16} color="white" />
                                        Export
                                    </CSVLink>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={filteredData}
                customStyles={customStyles}
                pagination={pagination}
                paginationPerPage={20}
                selectableRows={selectableRows}
                onRowClicked={onRowClicked}
                highlightOnHover
                pointerOnHover
                sortIcon={sortIcon}
                dense
                responsive
            />
        </div>
    );
};

export default Table;
