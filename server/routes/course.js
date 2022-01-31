const express = require("express");
const {
  uploadImage,
  removeImage,
  create,
  read,
  uploadVideo,
  uploadRemove,
  addLesson,
  update,
  removeLesson,
  updateLesson,
  publishCourse,
  unpublishCourse,
  courses,
  checkEnrollment,
  freeEnrollment,
  paidEnrollment,
  stripeSuccess,
  userCourses,
  markCompleted
} = require("../controllers/course");
const { requireSignin, isInstructor, isUserEnrolled } = require("../middlewares");
const formidable = require("express-formidable");

const router = express.Router();

router.get('/courses', courses)

//publish and unpublish
router.put("/course/publish/:courseId", requireSignin, publishCourse);
router.put("/course/unpublish/:courseId", requireSignin, unpublishCourse);

router.post("/course/upload-image", uploadImage);
router.post("/course/remove-image", removeImage);

//coruse
router.post("/course", requireSignin, isInstructor, create);
router.put("/course/:slug/:instructorId", requireSignin, update);
router.get("/course/:slug", read);
router.post(
  "/course/video-upload/:instructorId",
  requireSignin,
  formidable(),
  uploadVideo
);
router.post("/course/video-remove/:instructorId", requireSignin, uploadRemove);
router.post("/course/lesson/:slug/:instructorId", requireSignin, addLesson);
router.put("/course/lesson/:slug/:instructorId", requireSignin, updateLesson);
router.put("/course/:slug/:lessonId", requireSignin, removeLesson);

router.get('/check-enrollment/:courseId', requireSignin, checkEnrollment)

//enrollment
router.post('/free-enrollment/:courseId', requireSignin, freeEnrollment)
router.post('/paid-enrollment/:courseId', requireSignin, paidEnrollment)
router.get('/stripe-success/:courseId', requireSignin, stripeSuccess)

router.get('/user-courses', requireSignin, userCourses)

router.get('/user/course/:slug', requireSignin, isUserEnrolled, read)

//marking
router.post('/mark-completed', requireSignin, markCompleted)

module.exports = router;
