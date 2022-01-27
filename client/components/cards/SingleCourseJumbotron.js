import React from 'react';
import { currencyFormatter } from "../../utils/helpers";
import { Badge, Modal } from "antd";
import ReactPlayer from "react-player";

const SingleCourseJumbotron = ({course, setShowModal, showModal, preview, setPreview}) => {

    const {
        title,
        description,
        instructor,
        updatedAt,
        lessons,
        image,
        price,
        paid,
        category,
      } = course;
  return <>
  <div className="jumbotron bd-primay">
        <div className="row">
          <div className="col-md-8">
            <h2 className="text-light font-weight-bold">{title}</h2>
            <p className="lead">
              {description && description.substring(0, 160)}...
            </p>
            <Badge
              count={category}
              style={{ backgroundColor: "#03a9f4" }}
              className="pb-4 mr-2"
            />
            <p>Created by {instructor.name}</p>
            <p>Last updated {new Date(updatedAt).toLocaleDateString()}</p>
            <h4 className="text-light">
              {paid
                ? currencyFormatter({
                    amount: price,
                    currency: "usd",
                  })
                : "Free"}
            </h4>
          </div>
          <div className="col-md-4">
            {lessons[1].video && lessons[1].video.Location ? (
              <div
                onClick={() => {
                  setPreview(lessons[0].video.Location);
                  setShowModal(true)
                }}
              >
                <ReactPlayer
                  className="react-player"
                  url={lessons[0].video.Location}
                  width="100%"
                  height="205px"
                  light={image.Location}
                />
              </div>
            ) : (
              <>
                <img
                  src={image.Location}
                  alt={title}
                  className="img img-fluid"
                />
              </>
            )}
          </div>
        </div>
      </div>
  </>;
};

export default SingleCourseJumbotron;
