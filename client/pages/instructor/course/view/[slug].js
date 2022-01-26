import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from "axios";
import { Avatar, Tooltip, Button, Modal, List, Item } from "antd";
import { EditOutlined, CheckOutlined, UploadOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import AddLessionForm from "../../../../components/forms/AddLessionForm";
import { toast } from "react-toastify";

const CourseView = () => {
  const [course, setCourse] = useState({});
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("Upload video");
  const [values, setValues] = useState({
    title: "",
    content: "",
    video: {},
  });

  const { slug } = router.query;
  // console.log(slug)
  useEffect(() => {
    loadCourse();
  }, [slug]);
  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
  };

  //function for adding lession
  const handleAddLesson = async (e) => {
    e.preventDefault()

    try {
        const {data} = await axios.post(`/api/course/lesson/${slug}/${course.instructor._id}`, values)

        setValues({...values, title: '', content: '', video: ''})
        setVisible(false)
        setUploadButtonText('Upload video')
        setCourse(data)
        toast('Lesson added')
    } catch (error) {
        console.log(error)
        toast('Lesson add failed')
    }  
  };

  const handleVideo = async (e) => {
    try {
        const file = e.target.files[0];
        setUploadButtonText(file.name);
        setUploading(true)

        const videoData = new FormData();
        videoData.append('video', file)
        //save progress bar and send vidoe a s form data to backend
        const { data } = await axios.post(`/api/course/video-upload/${course.instructor._id}`, videoData, {
            onUploadProgress: (e) => {
                setProgress(Math.round((100 * e.loaded) / e.total))
            }
        }
        )
        //once response got
        setValues({...values, video: data})
        setUploading(false)
      } catch (error) {
        setUploading(false)
        console.log(error);
        toast("Video upload failed");
      }
  }
  const handleVideoRemove = async () => {
      try {
          setUploading(true)
          const {data} = await axios.post(`/api/course/video-remove/${course.instructor._id}`, values.video)
          setValues({...values, video: {}})
          setUploading(false)
          setUploadButtonText('Upload another video')
      } catch (error) {
        setUploading(false)
        console.log(error);
        toast("Video remove failed");
      }
  }
  return (
    <InstructorRoute>
      <div className="container-fluid pt-3">
        {course && (
          <div className="container-fluid pt-1">
            <Avatar
              size={80}
              src={course.image ? course.image.Location : "/course.png"}
            />
            <div className="media-body pl-2">
              <div className="row">
                <div className="col">
                  <h5 className="mt-2 text-primary">{course.name}</h5>
                  <p style={{ marginTop: "-10px" }}>
                    {course.lessons && course.lessons.length} Lessons
                  </p>
                  <p style={{ marginTop: "-15px", fontSize: "10px" }}>
                    {course.category}
                  </p>
                </div>
              </div>

              <div className="d-flex">
                <Tooltip title="Edit">
                  <EditOutlined onClick={() => router.push(`/instructor/course/edit/${slug}`)} className="h5 text-warning mr-4 pointer" />
                </Tooltip>
                <Tooltip title="Publish">
                  <CheckOutlined className="h5 pointer text-danger" />
                </Tooltip>
              </div>

              <div className="row">
                <div className="col">
                  <ReactMarkdown>{course.description}</ReactMarkdown>
                </div>
              </div>
              <div className="row">
                <Button
                  onClick={() => setVisible(true)}
                  className="col-md-6 offset-md-3 text-center"
                  type="primary"
                  shape="round"
                  icon={<UploadOutlined />}
                  size="large"
                >
                  Add Lesson
                </Button>
              </div>
              <br />
              <Modal
                title="+ Add Lesson"
                created
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
              >
                <AddLessionForm
                  uploading={uploading}
                  values={values}
                  setValues={setValues}
                  handleAddLesson={handleAddLesson}
                  uploadButtonText ={ uploadButtonText }
                  handleVideo = {handleVideo}
                  progress = {progress}
                  handleVideoRemove = {handleVideoRemove}
                />
              </Modal>

              <div className="row pb-5">
                  <div className="col lesson-list">
                      <h4>{course && course.lessons && course.lessons.length} Lessons</h4>
                      <List itemLayout="horizontal" dataSource={course && course.lessons} renderItem={(item, index) => (
                          <List.Item>
                             <List.Item.Meta avatar={<Avatar>{index + 1}</Avatar>} title={item.title}></List.Item.Meta> 
                          </List.Item>
                      )}>

                      </List>
                      </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorRoute>
  );
};

export default CourseView;
