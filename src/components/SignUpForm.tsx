import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signUp } from "../supabase/service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  username: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
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
    onSubmit: async (values) => {
      const response = await signUp(
        values.email,
        values.password,
        values.username
      );
      if (response.session) {
        // Handle successful signup, e.g., redirect or show message
        setSession(response.session);
        navigate("/dashboard");
        console.log("User successfully signed up!");
      } else {
        console.error(response);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        type="email"
        name="email"
        onChange={formik.handleChange}
        value={formik.values.email}
        placeholder="Email"
      />
      {formik.errors.email && formik.touched.email ? (
        <div>{formik.errors.email}</div>
      ) : null}

      <input
        type="text"
        name="username"
        onChange={formik.handleChange}
        value={formik.values.username}
        placeholder="Username"
      />
      {formik.errors.username && formik.touched.username ? (
        <div>{formik.errors.username}</div>
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

      <button type="submit">Sign Up</button>
    </form>
  );
};
