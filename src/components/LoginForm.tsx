import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { login } from "../supabase/service";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const LoginSchema = Yup.object().shape({
  emailOrUsername: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
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
    <form onSubmit={formik.handleSubmit}>
      <input
        type="text"
        name="emailOrUsername"
        onChange={formik.handleChange}
        value={formik.values.emailOrUsername}
        placeholder="Email or Username"
      />
      {formik.errors.emailOrUsername && formik.touched.emailOrUsername ? (
        <div>{formik.errors.emailOrUsername}</div>
      ) : null}

      <input
        type="password"
        name="password"
        onChange={formik.handleChange}
        value={formik.values.password}
        placeholder="Password"
      />
      {formik.errors.password && formik.touched.password ? (
        <div>{formik.errors.password}</div>
      ) : null}

      <button type="submit">Login</button>
    </form>
  );
};
