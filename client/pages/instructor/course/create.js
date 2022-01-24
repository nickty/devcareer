import React, { useState } from "react";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import { Button, Select } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import CourseCreateForm from "../../../components/forms/CourseCreateForm";

const { Option } = Select;

const create = () => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "500.00",
    uploading: false,
    paid: true,
    loading: false,
    imagePreview: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = () => {};

  const handleSubmit = () => {
    e.preventDefault();
  };

  return (
    <InstructorRoute>
      <h2 className="jumbotron">Create Course</h2>
      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
        />
      </div>
    </InstructorRoute>
  );
};

export default create;
