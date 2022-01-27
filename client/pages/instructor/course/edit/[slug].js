import React, { useState, useEffect } from "react";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import { Select, List, Avatar } from "antd";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import { DeleteOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import UpdateLessonForm from "../../../../components/forms/UpdateLessonForm";

const { Option } = Select;

const CoureEdit = () => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "0.00",
    uploading: false,
    paid: true,
    loading: false,
    imagePreview: "",
    category: "",
    lessons: [],
  });
  const [image, setImage] = useState({});
  const [preview, setPeview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");

  //for lessons update
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState({});
  const [uploadVideoButtonText, setUploadVideoButtonText] = useState('Upload video')
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const router = useRouter();

  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    if (data) setValues(data);
    if (data && data.image) setImage(data.image);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    setPeview(window.URL.createObjectURL(e.target.files[0]));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });

    //resizer
    Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
      try {
        let { data } = await axios.post("/api/course/upload-image", {
          image: uri,
        });
        //set image in the state
        setImage(data);
        setValues({ ...values, loading: false });
      } catch (error) {
        console.log(error);
        setValues({ ...values, loading: false });
        toast("Image upload failed");
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      });
      toast("Course updated");
      router.push("/instructor");
    } catch (error) {
      toast(err.response.data);
    }
  };

  const handleImageRemove = async () => {
    try {
      setValues({ ...values, loading: true });
      const res = axios.post("/api/course/remove-image", { image });
      setImage({});
      setPeview("");
      setUploadButtonText("Upload Image");
      setValues({ ...values, loading: false });
    } catch (error) {
      console.log(error);
      setValues({ ...values, loading: false });
      toast("Image upload failed");
    }
  };

  const handleDrag = (e, index) => {
    e.dataTransfer.setData("itemIndex", index);
  };

  const handleDrop = async (e, index) => {
    const movingItemIndex = e.dataTransfer.getData("itemIndex");
    const targetItemIndex = index;

    let allLessons = values.lessons;

    let movingItem = allLessons[movingItemIndex]; //clicked item to drag
    allLessons.splice(movingItemIndex, 1); //remove 1 item from given index
    allLessons.splice(targetItemIndex, 0, movingItem); // push item after target item index
    setValues({ ...values, lessons: [...allLessons] });

    //save in db
    const { data } = await axios.put(`/api/course/${slug}`, {
      ...values,
      image,
    });

    toast("Lessons updated successfully");
  };

  const handleDelete = async (index) => {
    const answer = window.confirm("Are you sure?");
    if (!answer) return;
    let allLessons = values.lessons;
    const removed = allLessons.splice(index, 1);
    setValues({ ...values, lessons: allLessons });
    //send requirest to server
    const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`);
  };

  const handleVideo = async (e) => {
    //remove previous
    if(current.video && current.video.Location){
      const res = await axios.post(`/api/course/video-remove/${values.instructor._id}`, current.video)
    }
    //uploading uploading new one
    const file = e.target.files[0]
    setUploadVideoButtonText(file.name)
    setUploading(true)
    //send video as form data
    const videoData = new FormData()
    videoData.append('video', file)
    videoData.append('courseId', values._id)

    const { data } = await axios.post(`/api/course/video-upload/${values.instructor._id}`, videoData, {
      onUploadProgress: (e) => setProgress(Math.round((100* e.loaded)/e.total))
      
    })
    setCurrent({...current, video: data})
    setUploading(false)
  };
 
  const handleUpdateLesson = async (e) => {
    e.preventDefault()
    const {data} = await axios.put(`/api/course/lesson/${slug}/${current._id}`, current)
    setVisible(false)
    setUploadVideoButtonText('Upload video')
  
    //update ui
    if(data.ok){
      let arr = values.lessons
      const index = arr.findIndex(el => el._id === current._id)
      arr[index] = current
      setValues({...values, lessons:arr})
      toast('Lesson updated')
    }
  };

  return (
    <InstructorRoute>
      <h2 className="jumbotron">Update Course</h2>
      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
          handleImageRemove={handleImageRemove}
          editPage={true}
        />
      </div>
      <hr />
      <div className="row pb-5">
        <div className="col lesson-list">
          <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
          <List
            itemLayout="horizontal"
            onDragOver={(e) => e.preventDefault()}
            dataSource={values && values.lessons}
            renderItem={(item, index) => (
              <List.Item
                draggable
                onDragStart={(e) => handleDrag(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                <List.Item.Meta
                  onClick={() => {
                    setVisible(true);
                    setCurrent(item);
                  }}
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item.title}
                ></List.Item.Meta>
                <DeleteOutlined
                  className="text-danter"
                  onClick={() => handleDelete(index)}
                />
              </List.Item>
            )}
          ></List>
        </div>
      </div>
      <Modal
        footer={null}
        title="Update lesson"
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <UpdateLessonForm
          handleVideo={handleVideo}
          handleUpdateLesson={handleUpdateLesson}
          current={current}
          setCurrent={setCurrent}
          uploadVideoButtonText={uploadVideoButtonText}
          progress={progress}
          uploading={uploading}
        />
      </Modal>
    </InstructorRoute>
  );
};

export default CoureEdit;
