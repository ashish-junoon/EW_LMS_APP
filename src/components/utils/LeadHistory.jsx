import { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from "./Button";
import Modal from "./Modal";
import SelectInput from '../../components/fields/SelectInput';
import TextInput from '../../components/fields/TextInput';
import { addRemarkOptions } from '../../components/content/Data';
import { useAuth } from '../../context/AuthContext';
import { addRemark } from "../../api/ApiFunction";
import { useOpenLeadContext } from "../../context/OpenLeadContext";
import { toast } from "react-toastify";

function ErrorMsg({ error }) {
    return <p className="text-red-500 text-xs mt-1">{error}</p>;
}

function LeadHistory({ data, btnEnable = false }) {
    const [open, setOpen] = useState(false);
    const [localTableData, setLocalTableData] = useState(data?.leadHistories || []);

    const { adminUser } = useAuth();
    const { leadInfo, setLeadInfo } = useOpenLeadContext();

    const formik = useFormik({
        initialValues: {
            reason: '',
            remarks: ''
        },
        validationSchema: Yup.object({
            reason: Yup.string().required('Select reason.'),
            remarks: Yup.string().when('reason', {
                is: (reason) => reason !== "Interested",
                then: () =>
                    Yup.string()
                        .required('Remarks are required.')
                        .min(10, 'Remarks must be at least 10 characters.'),
                otherwise: () => Yup.string().notRequired()
            })
        }),

        onSubmit: async (values) => {
            const req = {
                lead_id: data?.lead_id,
                reason: values.reason,
                remarks: values.remarks,
                process_by: adminUser.emp_code
            };

            try {
                const response = await addRemark(req);
                if (response.status) {
                    // Update both the local table data and the context data
                    const updatedRemark = {
                        lead_status: "Remarks Added",
                        is_approve: "Added",
                        ...req,
                        process_on: new Date().toISOString()
                    };

                    setLocalTableData(prev => [...prev, updatedRemark]);

                    setLeadInfo((prev) => ({
                        ...prev,
                        updatedRemark,
                        tableData: [...(prev.tableData || []), updatedRemark]
                    }));

                    toast.success("Remark added successfully!");
                    formik.resetForm();
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.error("Error adding remark:", error);
                toast.error("An error occurred while adding remark.");
            } finally {
                setOpen(false);
            }
        }
    });

    const handleProcesssForm = () => {
        setOpen(false);
    }

    // Use the localTableData for rendering
    const tableData = localTableData;

    // Dynamically extract keys from the first object in the array
    const headers = tableData.length > 0 ? Object.keys(tableData[0]) : [];

    return (
        <div className="">
            <div className="flex justify-end items-center mr-10">
                <div>
                    {btnEnable && (
                        <Button
                            btnName="ADD REMARKS"
                            btnIcon="IoCheckmarkCircleSharp"
                            onClick={() => setOpen(true)}
                            type="button"
                            style="min-w-[100px] md:w-auto text-xs font-semibold mt-4 py-1 px-4 border border-primary text-primary border hover:border-primary hover:bg-primary hover:text-white hover:font-bold italic"
                        />
                    )}
                </div>
            </div>
            {headers.length > 0 && tableData.length > 0 ? (
                <div className="relative overflow-x-auto sm:rounded-lg mt-4">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-100">
                        <thead className="text-xs text-black uppercase bg-gray-200">
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} scope="col" className="px-6 py-2">
                                        {header.replace(/_/g, ' ').toUpperCase()}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((item, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className={`bg-white border-b border-gray-200 ${rowIndex % 2 === 0 ? 'bg-gray-50' : ''}`}
                                >
                                    {headers.map((key, colIndex) => (
                                        <td key={colIndex} className="px-6 py-2 text-gray-600">
                                            {item[key] !== null && item[key] !== undefined
                                                ? String(item[key])
                                                : 'N/A'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex justify-center items-center h-64">
                    <p>No data available</p>
                </div>
            )}

            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                heading={"Add Remark"}
            >
                <div className='px-5'>
                    <form onSubmit={formik.handleSubmit} className='my-4'>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <SelectInput
                                    label="Select Reason"
                                    placeholder="Select"
                                    icon="RiDraftLine"
                                    name="reason"
                                    id="reason"
                                    options={addRemarkOptions}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.reason}
                                />
                                {formik.touched.reason && formik.errors.reason && (
                                    <ErrorMsg error={formik.errors.reason} />
                                )}
                            </div>
                            {formik.values.reason !== "Interested" && (
                                <div className="col-span-2">
                                    <TextInput
                                        label="Remarks"
                                        icon="IoPersonOutline"
                                        placeholder="Write Remarks"
                                        name="remarks"
                                        maxLength={200}
                                        id="remarks"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.remarks}
                                    />
                                    {formik.touched.remarks && formik.errors.remarks && (
                                        <ErrorMsg error={formik.errors.remarks} />
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-4 mt-2">
                            {formik.values.reason === "Interested" && (
                                <Button
                                    btnName="OKEY"
                                    btnIcon="IoCheckmarkCircleSharp"
                                    type="submit"
                                    style="min-w-[100px] md:w-auto text-xs font-semibold mt-4 py-1 px-4 border border-primary text-primary border hover:border-success hover:bg-success hover:text-white hover:font-bold italic"
                                />
                            )}

                            {formik.values.reason !== "Interested" && (
                                <Button
                                    btnName="ADD REMARKS"
                                    btnIcon="IoCheckmarkCircleSharp"
                                    type="submit"
                                    style="min-w-[100px] md:w-auto text-xs font-semibold mt-4 py-1 px-4 border border-primary text-primary border hover:border-success hover:bg-success hover:text-white hover:font-bold italic"
                                />
                            )}

                            <Button
                                btnName={"CLOSE"}
                                btnIcon={"IoCloseCircleOutline"}
                                type={"button"}
                                onClick={handleProcesssForm}
                                style="min-w-[100px] md:w-auto text-xs font-semibold mt-4 py-1 px-4 border border-primary text-primary border hover:border-danger hover:bg-danger hover:text-black hover:font-bold italic"
                            />
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

export default LeadHistory;