import { useFormik } from "formik";
import * as Yup from "yup";
import TextInput from "../fields/TextInput";
import DateInput from "../fields/DateInput";
import SelectInput from "../fields/SelectInput";
import ErrorMsg from "../utils/ErrorMsg";
import UploadInput from "../fields/UploadInput";
import { useAuth } from "../../context/AuthContext";
import { BulkCollectionUpdate, GetEMISchedule } from "../../api/ApiFunction";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export default function EditCollectionForm({ data }) {
  const { adminUser } = useAuth();
  const leadId = data?.lead_id;
  const userId = data?.user_id;
  const loanId = data?.selectedproduct[0]?.loan_id;
  const [Schedule, setSchedule] = useState({});
  const [TableData, setTableData] = useState([]);

  //util
const normalizeDate = (dateStr) => {
  if (!dateStr) return "";

  // Case 1: Already correct format (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  // Case 2: DD-MMM-YYYY (09-Jan-2026)
  const [day, mon, year] = dateStr.split("-");

  const months = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  return `${year}-${months[mon]}-${day.padStart(2, "0")}`;
};

const rawDate1 = Schedule?.activeLoanDetails?.disbursement_date;
const rawDate2 = Schedule?.closedLoanDetails?.disbursement_date;

// pick whichever exists
const minDate = normalizeDate(rawDate1 || rawDate2);

  // 🔥 Convert File → Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const fetchData = async () => {
    try {
      const response = await GetEMISchedule({
        loan_id: loanId,
        lead_id: leadId,
      });
      if (response.status) {
        console.log(response.emi_Schedules);

        setSchedule(response);
        setTableData(response.emi_Schedules || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (!loanId || !leadId) return;
    fetchData();
  }, [loanId, leadId]);

  console.log(TableData);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const date = new Date(dateStr);
    if (isNaN(date)) return "";

    // return date.toISOString().split("T")[0]; // yyyy-mm-dd
    return date.toLocaleDateString("en-CA"); // yyyy-mm-dd
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      collection_status: "",
      transactions:
        TableData.length > 0
          ? TableData.map((item) => ({
              collection_amount: item.total_paid_amount || "",
              transction_id: item.transaction_id || "",
              file: "",
              collection_date: formatDate(item.paid_on),
              waive_off_amount: item.waive_off_amount || "0",
              payment_mode: item.payment_mode || "UPI",
              receiver_bank_name: "RAZORPAY",
            }))
          : [
              {
                collection_amount: "",
                transction_id: "",
                file: "",
                collection_date: "",
                waive_off_amount: "0",
                payment_mode: "UPI",
                receiver_bank_name: "RAZORPAY",
              },
            ],
    },

    validationSchema: Yup.object({
      collection_status: Yup.string().required("Collection status required"),

      transactions: Yup.array().of(
        Yup.object({
          collection_amount: Yup.number()
            .typeError("Amount must be number")
            .positive("Must be > 0")
            .required("Amount is required"),

          transction_id: Yup.string()
            .trim()
            .min(2, "Min 2 chars")
            .required("Transaction ID required"),

          file: Yup.mixed().required("File is required"),

          collection_date: Yup.string().required("Date required"),
        }),
      ),
    }),

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {
        const formattedCollections = await Promise.all(
          values.transactions.map(async (item) => {
            const base64 = item.file ? await toBase64(item.file) : "";

            return {
              collection_amount: Number(item.collection_amount),
              payment_mode: item.payment_mode || "UPI",
              transction_id: item.transction_id,
              collection_date: item.collection_date,
              //   collection_date: new Date(item.collection_date).toISOString(),
              payment_recipt_name: item.file?.name || "",
              payment_recipt_exention: item.file?.name.split(".").pop() || "",
              payment_recipt_data: base64,
              receiver_bank_name: item.receiver_bank_name || "RAZORPAY",
              waive_off_amount: 0,
              // waive_off_amount: Number(item.waive_off_amount || 0),
            };
          }),
        );

        const payload = {
          lead_id: leadId,
          user_id: userId,
          loan_id: loanId,
          collection_status: values.collection_status,
          updated_by: adminUser?.emp_code,
          company_id: import.meta.env.VITE_COMPANY_ID,
          product_name: import.meta.env.VITE_PRODUCT_NAME,
          collections: formattedCollections,
        };

        const response = await BulkCollectionUpdate(payload);
        if (response.status) {
          toast.success(response.message || "Collection Updated Successfully.");
          // resetForm();
        } else {
          toast.error(response.message || "Collection Updation failed!");
        }
        console.log("Success:", response);
      } catch (error) {
        console.error("Error in BulkCollectionUpdate:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // 🔥 Total Amount
  const Total_Amount = formik.values.transactions.reduce(
    (acc, item) => acc + Number(item.collection_amount || 0),
    0,
  );

  const isRowValid = (row) =>
    row.collection_amount &&
    row.transction_id &&
    row.file &&
    row.collection_date;

  const addRow = (index) => {
    const errors = formik.errors.transactions?.[index];

    if (!isRowValid(formik.values.transactions[index]) || errors) {
      formik.setTouched({
        transactions: formik.values.transactions.map(() => ({
          collection_amount: true,
          transction_id: true,
          file: true,
          collection_date: true,
        })),
      });
      return;
    }

    formik.setFieldValue("transactions", [
      ...formik.values.transactions,
      {
        collection_amount: "",
        transction_id: "",
        file: "",
        collection_date: "",
        waive_off_amount: "0",
        payment_mode: "UPI",
        receiver_bank_name: "RAZORPAY",
      },
    ]);
  };

  const removeRow = (index) => {
    const updated = formik.values.transactions.filter((_, i) => i !== index);
    formik.setFieldValue("transactions", updated);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="">
      <div className="bg-white border border-gray-300/80 rounded-md shadow overflow-x-auto">
        {/* 🔥 Header */}
        <div className="mb-0 text-sm font-semibold text-white border-b px-4 py-1.5 bg-gray-600">
          <p>Update Collection</p>
          {/* <p>Amount</p>
          <p>transction_id</p>
          <p>File</p>
          <p>Date</p>
          <p>Action</p> */}
        </div>

        <div className="grid grid-cols-5 px-4 font-semibold text-gray-800 mt-2 text-sm -mb-2">
          <p>Amount</p>
          <p>Transaction Id</p>
          <p>File</p>
          <p>Date</p>
          <p>Action</p>
        </div>

        {/* 🔥 Rows */}
        {formik.values.transactions.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-1 mb-1 items-start p-1 md:py-2 md:px-3"
          >
            <div>
              <TextInput
                //   label={index === 0 && "Amount"}
                icon="MdOutlineCurrencyRupee"
                name={`transactions.${index}.collection_amount`}
                value={item.collection_amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.transactions?.[index]?.collection_amount &&
                  formik.errors.transactions?.[index]?.collection_amount
                }
              />
              <ErrorMsg
                error={formik.errors.transactions?.[index]?.collection_amount}
              />
            </div>
            <div>
              <TextInput
                //   label={index === 0 && "UTR"}
                icon="MdNumbers"
                name={`transactions.${index}.transction_id`}
                value={item.transction_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.transactions?.[index]?.transction_id &&
                  formik.errors.transactions?.[index]?.transction_id
                }
              />
              <ErrorMsg
                error={formik.errors.transactions?.[index]?.transction_id}
              />
            </div>

            <div className="max-md:col-span-2 md:col-span-1">
              <UploadInput
                //   label={index === 0 && "File"}
                name="file"
                icon="MdUploadFile"
                acceptedFormats="application/pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;

                  formik.setFieldValue(`transactions.${index}.file`, file);
                }}
                onBlur={formik.handleBlur}
              />
              <ErrorMsg error={formik.errors.transactions?.[index]?.file} />
            </div>

            <div>
              <DateInput
                //   label={index === 0 && "Collection Date"}
                icon="IoCalendarOutline"
                name={`transactions.${index}.collection_date`}
                value={item.collection_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min={minDate}
                // min={disbursement_date}
                // max={new Date().toLocaleDateString("en-CA")}
                error={
                  formik.touched.transactions?.[index]?.collection_date &&
                  formik.errors.transactions?.[index]?.collection_date
                }
              />
              <ErrorMsg
                error={formik.errors.transactions?.[index]?.collection_date}
              />
            </div>

            {/* Actions */}
            <div className="flex items-start h-full gap-2 mt-1">
              <button
                type="button"
                onClick={() => addRow(index)}
                disabled={!isRowValid(item)}
                className={`w-9 h-9 rounded-lg text-white ${
                  isRowValid(item)
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                +
              </button>

              {formik.values.transactions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="w-9 h-9 rounded-lg bg-red-500 text-white"
                >
                  −
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Submit */}
        <div className="border-t border-t-gray-300 px-5 py-3">
          <div className="mb-2 flex gap-5">
            {/* <p className="font-semibold text-gray-800">
              Total Outstanding : ₹{Schedule?.activeLoanDetails?.due_amount_on_current_day}
            </p>
            - */}
            <p className="font-semibold text-gray-800">
              Total Amount : ₹{Total_Amount}
            </p>
          </div>

          <div className="flex items-start gap-5">
            <div className="flex flex-col justify-start">
              <SelectInput
                //   label="Type"
                icon="RiMapPinUserLine"
                name="collection_status"
                placeholder="Collection Status"
                options={[
                  { label: "Settle", value: 12 },
                  { label: "Close", value: 10 },
                ]}
                {...formik.getFieldProps("collection_status")}
              />
              <ErrorMsg error={formik.errors.collection_status} />
            </div>

            <div className="flex items-center">
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className={`${formik.isSubmitting ? "bg-gray-500" : "bg-primary"} hover:bg-primary/70 text-white px-5 py-1.5 rounded-md font-semibold`}
              >
                {formik.isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
