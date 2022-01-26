import React, { useState, useEffect } from "react";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import { Select } from "antd";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import Resizer from 'react-image-file-resizer'
import {toast} from 'react-toastify'
import axios from "axios";
import { useRouter } from 'next/router'

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
    category: ''
  });
  const [image, setImage] = useState({})
  const [preview, setPeview] = useState('')
  const [uploadButtonText, setUploadButtonText] = useState('Upload Image')

  const router = useRouter()

  const {slug} = router.query

  useEffect(() => {
    loadCourse()
  }, [slug])

  const loadCourse = async () => {
      const { data } = await axios.get(`/api/course/${slug}`)
      setValues(data)
      if(data && data.image)  setImage(data.image)
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0]
    setPeview(window.URL.createObjectURL(e.target.files[0]))
    setUploadButtonText(file.name)
    setValues({...values, loading: true})

    //resizer
    Resizer.imageFileResizer(file, 720, 500, 'JPEG', 100, 0, async (uri) => {
      try {
        let {data} = await axios.post('/api/course/upload-image', {
          image: uri
        })
        //set image in the state 
        setImage(data)
        setValues({...values, loading: false})
        
      } catch (error) {
        console.log(error)
        setValues({...values, loading: false})
        toast('Image upload failed')
      }
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.put(`/api/course/${slug}`, {
        ...values,
        image
      })
      toast('Course updated')
      router.push('/instructor')
    } catch (error) {
      toast(err.response.data)
    }
    
  };

  const handleImageRemove =async () => {
    try {
      setValues({...values, loading: true})
      const res = axios.post('/api/course/remove-image', {image})
    setImage({})
    setPeview('')
    setUploadButtonText('Upload Image')
    setValues({...values, loading: false})
    } catch (error) {
      console.log(error)
      setValues({...values, loading: false})
      toast('Image upload failed')
    }

  }

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
          preview = {preview}
          uploadButtonText = {uploadButtonText}
          handleImageRemove = {handleImageRemove}
          editPage={true}
        />
      </div>
    </InstructorRoute>
  );
};

export default CoureEdit;

