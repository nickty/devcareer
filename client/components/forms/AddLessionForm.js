import React from "react";
import { Button } from "antd";

const AddLessionForm = ({ values, setValues, handleAddLesson, loading }) => {
  return (
    <div className="container pt-3">
      <form onSubmit={handleAddLesson}>
        <input
          type="text"
          className="form-control"
          onChage={(e) => setValues({ ...values, title: e.target.value })}
          autoFocus
          required
          placeholder="Title"
          value={values.title}
        />
        <textarea
          name=""
          cols="7"
          rows="7"
          className="form-control mt-3"
          onChange={(e) => setValues({ ...values, content: e.target.values })}
          value={values.content}
          placeholder="Content"
        ></textarea>
        <Button
          onClick={handleAddLesson}
          className="col mt-3"
          size="large"
          type="primary"
          loading={loading}
          shape="round"
        >Save</Button>
      </form>
    </div>
  );
};

export default AddLessionForm;
