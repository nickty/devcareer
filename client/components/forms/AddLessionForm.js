import React from "react";
import { Button, Progress, Tooltip } from "antd";
import { CloseCircleOutlined } from '@ant-design/icons'

const AddLessionForm = ({handleVideoRemove, values, progress, setValues, handleAddLesson, uploading, uploadButtonText, handleVideo }) => {
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
        
        <div className="d-flex justify-content-center">
        <label className="btn btn-dark btn-block text-left mt-3">
          {uploadButtonText}
          <input type='file' onChange={handleVideo} accept="video/*" hidden />
        </label>
        {!uploading && values.video.Location && (
          <Tooltip title="Remove">
            <span onClick={handleVideoRemove}>
              <CloseCircleOutlined className="text-danger d-flex justify-content-center pt-4 pointer" />
            </span>
          </Tooltip>
        )}
        </div>
        {progress > 0 && <Progress className="d-flex justify-content-center pt-2" 
        percent={progress}
        steps={10}
        />}
        <Button
          onClick={handleAddLesson}
          className="col mt-3"
          size="large"
          type="primary"
          loading={uploading}
          shape="round"
        >Save</Button>
      </form>
    </div>
  );
};

export default AddLessionForm;
