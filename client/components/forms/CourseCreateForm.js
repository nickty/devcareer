import React from 'react';

import { Button, Select } from "antd";
const { Option } = Select;

const CourseCreateForm = ({handleSubmit, handleImage, handleChange, values, setValues}) => {
  return  <form onSubmit={handleSubmit}>
  <div className="form-group">
    <input
      type="text"
      name="name"
      className="form-control"
      value={values.name}
      placeHolder="Course Name"
      onChange={handleChange}
    />
  </div>
  <div className="form-group">
    <textarea
      name="description"
      onChange={handleChange}
      className="form-control"
      value={values.description}
      cols=""
      rows=""
    />
  </div>
  <div className="form-row">
    <div className="col">
      <div className="form-group">
        <Select
          onChange={(v) => setValues({ ...values, paid: !values.paid })}
          value={values.paid}
          size="large"
          style={{ width: "100%" }}
        >
          <Option value={true}>Paid</Option>
          <Option value={false}>Free</Option>
        </Select>
      </div>
    </div>
  </div>
  <div className="form-row">
    <div className="col">
      <div className="form-group">
        <label className="btn btn-outline-secondary btn-block text-left">
          {values.loading ? "Uploading" : "Image Upload"}
          <input
            type="file"
            name="image"
            onChange={handleImage}
            accept="image/*"
            hidden
          />
        </label>
      </div>
    </div>
  </div>
  <div className="row">
    <div className="col">
      <Button
        type="primary"
        size="large"
        shape="round"
        loading={values.loading}
        onClick={handleSubmit}
        disabled={values.loading || values.uploading}
        className="btn btn-primary"
      >
        {values.loading ? "Saving..." : "Save & Continue"}
      </Button>
    </div>
  </div>
</form>;
};

export default CourseCreateForm;
