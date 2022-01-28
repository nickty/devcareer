import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron";
import PreviewModal from '../../components/modal/PreviewModal'

const SingleCourse = ({ course }) => {
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState("");
  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <SingleCourseJumbotron
        course={course}
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
        setPreview={setPreview}
      />
      <PreviewModal showModal={showModal} setShowModal={setShowModal} preview={preview} />
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
