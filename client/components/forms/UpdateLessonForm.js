import React from "react";
import { Button, Progress, Switch } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import ReactPlayer from 'react-player'

const UpdateLessonForm = ({
  handleVideo,
  handleUpdateLesson,
  current,
  setCurrent,
  uploading,
  uploadVideoButtonText,
  progress,
}) => {
  return (
    <div className="container pt-3">
      <form>
        <input
          type="text"
          className="form-control"
          onChange={(e) => setCurrent({ ...current, title: e.target.value })}
          autoFocus
          required
           value={current.title}
        />
        <textarea
          name=""
          cols="7"
          rows="7"
          className="form-control mt-3"
          onChange={(e) => setCurrent({ ...current, content: e.target.value })}
          value={current.content}
          ></textarea>

        <div>
         
          {!uploading && current.video && current.video.Location && (
            <div className="pt-2 d-flex justify-content-center">
                <ReactPlayer
                url={current.video.Location}
                width='410px' 
                height='240'
                controls
              />
            </div>
          )}
           <label className="btn btn-dark btn-block text-left mt-3">
            {uploadVideoButtonText}
            <input type="file" onChange={handleVideo} accept="video/*" hidden />
          </label>
        </div>
        {progress > 0 && (
          <Progress
            className="d-flex justify-content-center pt-2"
            percent={progress}
            steps={10}
          />
        )}
        <div className="d-flex justify-content-center pt-2">
            <span className="pt-3">Preview</span>
            <Switch className="float-right mt-2" disabled={uploading} checked={current.free_preview} name="free_preview"
            onChange={v => setCurrent({...current, free_preview: v})}
            />
        </div>
        <Button
          onClick={handleUpdateLesson}
          className="col mt-3"
          size="large"
          type="primary"
          loading={uploading}
          shape="round"
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default UpdateLessonForm;
