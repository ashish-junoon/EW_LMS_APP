import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import TextInput from "../../components/fields/TextInput";
import { useFormik } from "formik";
import * as Yup from 'yup';
import SelectInput from "../../components/fields/SelectInput";
import ErrorMsg from '../../components/utils/ErrorMsg';
import { isMobile, isTablet, isDesktop, osName, browserName } from "react-device-detect";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { ManualVerifyOTP } from "../../api/ApiFunction";
import { toast } from "react-toastify";
import Button from "../../components/utils/Button";

const VerifyOtp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState(null);
    const { adminUser } = useAuth();
    

    const formik = useFormik({
        initialValues: {
            UserId: '',
            leadId: '',
            servicetype: '',
            device_ip : ''
        },
        validationSchema: Yup.object({
            UserId: Yup.string().required('UserId is required'),
            leadId: Yup.string().required('LeadId is required'),
            servicetype: Yup.string().required('Service Type is required'),
        }),
        onSubmit: async (values, {resetForm}) => {
            setIsLoading(true)
            const device = isMobile && "Mobile" || isDesktop && "Desktop" || isTablet && "Tablet";
            const req = {
              lead_id: values?.leadId,
              user_id: values?.UserId,
              type: values?.servicetype,
              verified_by: adminUser?.emp_code,
              device_info: device + browserName,
              device_ip: values?.device_ip,
              operating_system: osName
            }
            try {
                const response = await ManualVerifyOTP(req)
                if(response.status){
                  toast.success(response.message || "OTP verified successfully")
                  setOtp(response?.otp)
                  resetForm()
                }else{
                  toast.warning(response.message || "Unable to Verify OTP")
                }
            } catch (error) {
                console.error("Error in OTP Verify:", error);
            } finally{
                setIsLoading(false)
            }
        },
    });

    // Fetching Ip for Payload 
    const fetchIP = async () => {
      const res  = await axios.get('https://api.ipify.org')
      formik.setFieldValue("device_ip", res.data)
    }

    useEffect(()=> {
      fetchIP()
    }, [])

  return (
    <>
      <Helmet>
        <title>Modify Lead </title>
        <meta name="New Leads" content="New Leads" />
      </Helmet>
      <div className="bg-white p-4 shadow rounded mb-10">
        <h1 className="text-xl font-bold">Verify OTP</h1>

        <div className="mt-5 lg:px-8 mb-5">
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-5">
                <div className="">
                    <SelectInput
                        label="Service Type"
                        icon="TbPasswordMobilePhone"
                        name="servicetype"
                        placeholder="Select"
                        options={[{value: "sanction", label: "Sanction"}].map((type) => ({
                            value: type.value,
                            label: type.label
                        }))}
                        {...formik.getFieldProps('servicetype')}
                    />
                    {formik.touched.servicetype && formik.errors.servicetype && (
                        <ErrorMsg error={formik.errors.servicetype} />
                    )}
                </div>
              <div>
                <TextInput
                  label="User ID"
                  icon="IoPersonOutline"
                  placeholder="Enter UserId"
                  name="UserId"
                  type="text"
                  maxLength={8}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.UserId}
                />
                {formik.touched.UserId && formik.errors.UserId && (
                  <ErrorMsg error={formik.errors.UserId} />
                )}
              </div>
              <div>
                <TextInput
                  label="Lead ID"
                  icon="IoPersonOutline"
                  placeholder="Enter LeadId"
                  name="leadId"
                  type="text"
                  maxLength={8}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.leadId}
                />
                {formik.touched.leadId && formik.errors.leadId && (
                  <ErrorMsg error={formik.errors.leadId} />
                )}
              </div>
              
              <div className="max-md:col-span-2">
                <Button
                    btnName={isLoading ? "Verifying..." : "Verify"}
                    btnIcon="GrValidate"
                    type="submit"
                    disabled={isLoading}
                    style="bg-primary text-white py-1.5 px-4 rounded mt-6 w-full cursor-pointer hover:bg-blue-600"
                />
              </div>
              <div className="max-md:col-span-2">
                <Button
                    btnName="Reset"
                    btnIcon="RiResetLeftFill"
                    type="reset"
                    onClick={()=> {formik.resetForm(), setOtp(null)}}
                    style="bg-primary text-white py-1.5 px-4 rounded mt-6 w-full cursor-pointer hover:bg-blue-600"
                />
              </div>
            </div>
          </form>
          {otp && <div className="border-l-4 border-l-primary bg-primary/10 px-2 py-1 mt-2">
            <p>OTP Verified Successfully : {otp}</p>
          </div>}
        </div>
      </div>
    </>
  );
};

export default VerifyOtp;
