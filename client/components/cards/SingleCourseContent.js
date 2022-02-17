/** @format */

import React from 'react';

const SingleCourseContent = ({ course }) => {
  return (
    <div className='container'>
      <p className='lead'>{course.description && course.description}</p>
    </div>
  );
};

export default SingleCourseContent;
