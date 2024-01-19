import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { login } from "../supabase";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const LoginSchema = Yup.object().shape({
  emailOrUsername: Yup.string().required("email or username is required"),
  password: Yup.string().required("password is required"),
});

export const LoginForm: React.FC = () => {
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      emailOrUsername: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      const response = await login(
        values.emailOrUsername.includes("@")
          ? values.emailOrUsername
          : undefined,
        !values.emailOrUsername.includes("@")
          ? values.emailOrUsername
          : undefined,
        values.password
      );
      if (response.session) {
        // Handle successful login, e.g., redirect or show message
        navigate("/dashboard");
        setSession(response.session);
      } else {
        console.error(response.error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <input
          type="text"
          name="emailOrUsername"
          onChange={formik.handleChange}
          value={formik.values.emailOrUsername}
          placeholder="username or email"
          className="px-4 py-2 border rounded mt-48 mb-2"
        />
        {formik.errors.emailOrUsername && formik.touched.emailOrUsername ? (
          <div className="text-red-600 mb-2 text-sm">
            {formik.errors.emailOrUsername}
          </div>
        ) : null}

        <input
          type="password"
          name="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          placeholder="password"
          className="px-4 py-2 border rounded mb-2"
        />
        {formik.errors.password && formik.touched.password ? (
          <div className="text-red-600 mb-4 text-sm">
            {formik.errors.password}
          </div>
        ) : null}

        <button
          type="submit"
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-800 mt-2"
        >
          login
        </button>
      </div>
    </form>
  );
};
