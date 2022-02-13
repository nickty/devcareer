/** @format */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import axios from 'axios';
import { Avatar, Tooltip, Button, Modal, List, Item } from 'antd';
import {
  UserSwitchOutlined,
  EditOutlined,
  CheckOutlined,
  UploadOutlined,
  QuestionCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import AddLessionForm from '../../../../components/forms/AddLessionForm';
import { toast } from 'react-toastify';

const CourseView = () => {
  const [course, setCourse] = useState({});
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState('Upload video');
  const [values, setValues] = useState({
    title: '',
    content: '',
    video: {},
  });

  //student count
  const [student, setStudent] = useState(0);

  useEffect(() => {
    course && studentCount();
  }, [course]);

  const studentCount = async () => {
    const { data } = await axios.post(`/api/instructor/student-count`, {
      courseId: course._id,
    });
    setStudent(data.length);
  };

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
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `/api/course/lesson/${slug}/${course.instructor._id}`,
        values
      );

      setValues({ ...values, title: '', content: '', video: '' });
      setProgress(0);
      setUploadButtonText('Upload video');
      setVisible(false);
      setCourse(data);
      toast('Lesson added');
    } catch (error) {
      console.log(error);
      toast('Lesson add failed');
    }
  };

  const handleVideo = async (e) => {
    try {
      const file = e.target.files[0];
      setUploadButtonText(file.name);
      setUploading(true);

      const videoData = new FormData();
      videoData.append('video', file);
      //save progress bar and send vidoe a s form data to backend
      const { data } = await axios.post(
        `/api/course/video-upload/${course.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) => {
            setProgress(Math.round((100 * e.loaded) / e.total));
          },
        }
      );
      //once response got
      setValues({ ...values, video: data });
      setUploading(false);
    } catch (error) {
      setUploading(false);
      console.log(error);
      toast('Video upload failed');
    }
  };
  const handleVideoRemove = async () => {
    try {
      setUploading(true);
      const { data } = await axios.post(
        `/api/course/video-remove/${course.instructor._id}`,
        values.video
      );
      setValues({ ...values, video: {} });
      setUploading(false);
      setUploadButtonText('Upload another video');
    } catch (error) {
      setUploading(false);
      console.log(error);
      toast('Video remove failed');
    }
  };

  const handlePublish = async (e, courseId) => {
    // console.log(courseId)
    try {
      let answer = window.confirm(
        'Once you pulished, it will be available for user to buy!'
      );
      if (!answer) return;

      const { data } = await axios.put(`/api/course/publish/${courseId}`);
      setCourse(data);
      toast('Congrats! Your course is live now');
    } catch (error) {
      toast('Your course is not live yet!, Try again');
    }
  };
  const handleUnpublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        'Once you unpublish, it will not be available for user to buy!'
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
      setCourse(data);
      toast('Your course is unpublished');
    } catch (error) {
      toast('Your course unpublished failed');
    }
  };

  return (
    <InstructorRoute>
      <div className='container-fluid pt-3'>
        {course && (
          <div className='container-fluid pt-1'>
            <Avatar
              size={80}
              src={course.image ? course.image.Location : 'imgs/course.jpg'}
            />
            <div className='media-body pl-2'>
              <div className='row'>
                <div className='col'>
                  <h5 className='mt-2 text-primary'>{course.name}</h5>
                  <p style={{ marginTop: '-10px' }}>
                    {course.lessons && course.lessons.length} Lessons
                  </p>
                  <p style={{ marginTop: '-15px', fontSize: '10px' }}>
                    {course.category}
                  </p>
                </div>
              </div>
              {console.log('course info', course._id)}
              <div className='d-flex'>
                <Tooltip title={`${student} Enrolled`}>
                  <UserSwitchOutlined
                    onClick={() =>
                      router.push(`/instructor/course/edit/${slug}`)
                    }
                    className='h5 text-info mr-4 pointer'
                  />
                </Tooltip>
                <Tooltip title='Edit'>
                  <EditOutlined
                    onClick={() =>
                      router.push(`/instructor/course/edit/${slug}`)
                    }
                    className='h5 text-warning mr-4 pointer'
                  />
                </Tooltip>
                {course.lessons && course.lessons.length < 5 ? (
                  <Tooltip title='Five lessons required to publish'>
                    <QuestionCircleOutlined className='h5 text-danger pointer' />
                  </Tooltip>
                ) : course.published ? (
                  <Tooltip title='Unpublished'>
                    <CloseOutlined
                      onClick={(e) => handleUnpublish(e, course._id)}
                      className='h5 text-danger pointer'
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title='Publish'>
                    <CheckOutlined
                      onClick={(e) => handlePublish(e, course._id)}
                      className='h5 text-success pointer'
                    />
                  </Tooltip>
                )}
              </div>

              <div className='row'>
                <div className='col'>
                  <ReactMarkdown>{course.description}</ReactMarkdown>
                </div>
              </div>
              <div className='row'>
                <Button
                  onClick={() => setVisible(true)}
                  className='col-md-6 offset-md-3 text-center'
                  type='primary'
                  shape='round'
                  icon={<UploadOutlined />}
                  size='large'>
                  Add Lesson
                </Button>
              </div>
              <br />
              <Modal
                title='+ Add Lesson'
                created
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}>
                <AddLessionForm
                  uploading={uploading}
                  values={values}
                  setValues={setValues}
                  handleAddLesson={handleAddLesson}
                  uploadButtonText={uploadButtonText}
                  handleVideo={handleVideo}
                  progress={progress}
                  handleVideoRemove={handleVideoRemove}
                />
              </Modal>

              <div className='row pb-5'>
                <div className='col lesson-list'>
                  <h4>
                    {course && course.lessons && course.lessons.length} Lessons
                  </h4>
                  <List
                    itemLayout='horizontal'
                    dataSource={course && course.lessons}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar>{index + 1}</Avatar>}
                          title={item.title}></List.Item.Meta>
                      </List.Item>
                    )}></List>
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
