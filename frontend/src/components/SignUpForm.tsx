import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signUp, emailExists, usernameExists } from "../supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("invalid email").required("email is required"),
  username: Yup.string().required("username is required"),
  password: Yup.string().required("password is required"),
});

export const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validationSchema: SignupSchema,
    onSubmit: async (values, { setFieldError }) => {
      const emailInUse = await emailExists(values.email);
      const usernameInUse = await usernameExists(values.username);

      if (emailInUse) {
        setFieldError("email", "email is already in use");
      }

      if (usernameInUse) {
        setFieldError("username", "username is already in use");
      }

      if (!emailInUse && !usernameInUse) {
        const response = await signUp(
          values.email,
          values.password,
          values.username
        );
        if (response.error) {
          console.log(response.error);
        } else if (response.session) {
          setSession(response.session);
          navigate("/dashboard");
        }
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-col items-center">
        <input
          type="email"
          name="email"
          onChange={formik.handleChange}
          value={formik.values.email}
          placeholder="email"
          className="px-4 py-2 border rounded mb-2 mt-48"
        />
        {formik.errors.email && formik.touched.email ? (
          <div className="text-red-600 mb-2 text-sm">{formik.errors.email}</div>
        ) : null}

        <input
          type="text"
          name="username"
          onChange={formik.handleChange}
          value={formik.values.username}
          placeholder="username"
          className="px-4 py-2 border rounded mb-2"
        />
        {formik.errors.username && formik.touched.username ? (
          <div className="text-red-600 mb-2 text-sm">
            {formik.errors.username}
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
          sign up
        </button>
      </div>
    </form>
  );
};
