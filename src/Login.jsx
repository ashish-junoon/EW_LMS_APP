import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import Button from "./components/utils/Button";
import TextInput from "./components/fields/TextInput";
import Images from "./components/content/Images";
import ErrorMsg from "./components/utils/ErrorMsg";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserLogin } from "./api/ApiFunction";
import { useAuth } from "./context/AuthContext";
import { Helmet } from "react-helmet";
import {
  osName,
  osVersion,
  browserName,
  browserVersion,
} from "react-device-detect";

const Login = () => {
  const [ipAddress, setIPAddress] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(import.meta.env.VITE_GET_IP_URL)
      .then((response) => response.json())
      .then((data) => setIPAddress(data.ip))
      .catch((error) => console.log(error));
  }, []);

  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },
    validationSchema: Yup.object({
      userName: Yup.string().required("Username Required"),
      password: Yup.string().required("Password Required"),
    }),
    onSubmit: async ({ userName, password }) => {
        
      try {
        const request = {
          // user_name: userName,
          official_email: userName,
          password: password,
          system_ip: ipAddress,
          device_info: browserName + " " + browserVersion,
          operating_system: osName + " " + osVersion,
          company_id: import.meta.env.VITE_COMPANY_ID,
          product_name: import.meta.env.VITE_PRODUCT_NAME,
        };

        const response = await UserLogin(request);
        if (response.status) {
          login(response);
          navigate("/");
          // toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  const renderError = (field) =>
    formik.touched[field] && formik.errors[field] ? (
      <ErrorMsg error={formik.errors[field]} />
    ) : null;

  return (
    <>
      <Helmet>
        <title>Login</title>
        <meta name="New Leads" content="Login" />
      </Helmet>
      <div className="h-screen bg-slate-50 py-20 p-4 md:p-20 lg:p-32">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 70,
            damping: 10,
          }}
          className="max-w-sm bg-white rounded-lg overflow-hidden shadow-lg mx-auto"
        >
          <div className="flex justify-center mt-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-md p-3">
              <img
                src={Images.logo}
                alt="logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          <div className="px-8 py-5">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome to Earlywages
            </h2>
            <p className="text-gray-700 mb-6">Please login to your account.</p>
            <form onSubmit={formik.handleSubmit}>
              <div className="mt-3">
                <TextInput
                  label="Username"
                  icon="RiUser6Line"
                  placeholder="Enter Username"
                  name="userName"
                  type="text"
                  {...formik.getFieldProps("userName")}
                />
                {renderError("userName")}
              </div>

              <div className="mt-3">
                <TextInput
                  label="Password"
                  icon="IoKeyOutline"
                  placeholder="Enter Password"
                  name="password"
                  type="password"
                  {...formik.getFieldProps("password")}
                />
                {renderError("password")}
              </div>

              <div className="flex justify-center">
                <Button
                  btnName="Login"
                  btnIcon="RiLoginCircleLine"
                  type="submit"
                  style="my-8 bg-primary text-white min-w-full"
                />
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
