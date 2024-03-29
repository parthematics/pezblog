"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("invalid email").required("email is required"),
  username: Yup.string().required("username is required"),
  password: Yup.string().required("password is required"),
});

export default function SignupForm() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validationSchema: SignupSchema,
    onSubmit: async (values, { setFieldError }) => {
      const response = await fetch("/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const responseData = await response.json();
      if (responseData.error) {
        setFieldError(responseData.onField, responseData.error);
      } else {
        router.push("/dashboard");
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
}
