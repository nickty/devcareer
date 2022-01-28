import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron";
import PreviewModal from "../../components/modal/PreviewModal";
import SingleCourseLesson from "../../components/cards/SingleCourseLesson";
import {context} from '../../context'


const SingleCourse = ({ course }) => {
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState("");
  const router = useRouter();
  const { slug } = router.query;

  const [enrolled, setEnrolled] = useState({})

  const {state: {user}} = useContext(context)
  console.log(user)

  useEffect(() => {
    if(user && course) checkEnrollment()
  }, [user, course])

  const checkEnrollment = async (req, res) => {
    const { data } = await axios.get(`/api/check-enrollment/${course._id}`)
    setEnrolled(data)
    // console.log(data)
  }

  const [loading, setLoading] = useState(false)

  const handlePaidEnrollment = () => {

  }
  const handleFreeEnrollment = () => {

  }

  return (
    <>
      <SingleCourseJumbotron
        course={course}
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
        setPreview={setPreview}
        user={user}
        loading={loading}
        handleFreeEnrollment={handleFreeEnrollment}
        handlePaidEnrollment={handlePaidEnrollment}
        enrolled={enrolled}
        setEnrolled={setEnrolled}
      />
      <PreviewModal
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
      />

      {course.lessons && (
        <SingleCourseLesson
          lessons={course.lessons}
          setPreview={setPreview}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export async function getServerSideProps({ query }) {
  const { data } = await axios(`${process.env.API}/course/${query.slug}`);
  return {
    props: {
      course: data,
    },
  };
}

export default SingleCourse;
