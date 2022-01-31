import React, { useState, useEffect, createElement } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Menu, Avatar, Button } from "antd";
import { PlayCircleOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import StudentRoute from "../../../components/routes/StudentRoute";
import ReactPlayer from "react-player";
import ReactMarkdown from "react-markdown";

function SingleCourse() {
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({});
  const [completedLesson, setCompletedLesson] = useState([])

  const [clicked, setClicked] = useState(-1);
  const [collapsed, setCollapsed] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) loadCourse();
  }, [slug]);

  useEffect(() => {
    if(course) loadCompetedLesson()
  }, [course])

  const loadCompletedLesson = async () => {
    const {data} = await axios.post(`/api/list-completed`, {courseId: course._id})
    setCompletedLesson(data)
  }

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/user/course/${slug}`);
    // console.log(data);
    setCourse(data);
  };

  const markCompleted = async () => {
    const { data } = await axios.post(`/api/mark-completed`, {
        courseId: course._id, lessonId: course.lessons[clicked]._id
    })
  }
  return (
    <StudentRoute>
      <div className="row">
        <div style={{ width: 320 }}>
            <Button className="text-parimary mt-1  btn-block mb-2" onClick={() => setCollapsed(!collapsed)}>
                {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
                {!collapsed && "Lessons"}
            </Button>
          <Menu
            mode="inline"
            defaultSelectedKeys={[clicked]}
            inlineCollapsed={collapsed}
            style={{ height: "80vh" }}
          >
            {course &&
              course.lessons &&
              course.lessons.map((item, index) => (
                <Menu.Item
                  key={index}
                  onClick={() => setClicked(index)}
                  icon={<Avatar>{index + 1}</Avatar>}
                >
                  {item.title.substring(0, 30)}
                </Menu.Item>
              ))}
          </Menu>
        </div>

        <div className="col">
          {clicked !== -1 ? (
            <>
              {course.lessons[clicked].video &&
                course.lessons[clicked].video.Location && (
                  <>
                  <div className="col alert alert-primary square">
                    <b>{course.lessons[clicked].title.substring(0, 30)}</b>
                    <span className="float-right pointer" onClick={markCompleted}>Mark as completed</span>
                  </div>
                    <div className="wrapper">
                      <ReactPlayer
                        className="player"
                        playing
                        url={course.lessons[clicked].video.Location}
                        width="100%"
                        height="100%"
                        controls
                      />
                    </div>
                    
                  </>
                )}

<ReactMarkdown source={course.lessons[clicked].content} className="single-post" />
            </>
          ) : (
            <div className="d-flex justify-content-center p-5">
                <div className="text-center p-5">
                    <PlayCircleOutlined className="text-primary display-1 p-5" />
                    <p className="lead">Select a lesson to start learning</p>
                </div>
            </div>
          )}
        </div>
      </div>
    </StudentRoute>
  );
}

export default SingleCourse;
