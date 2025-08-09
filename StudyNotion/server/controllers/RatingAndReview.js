const RatingAndReview = require("../models/RatingAndRaview");
const Course = require("../models/Course");

// create rating
exports.createRating = async (req, res) => {
  try {
    // get user id
    const userId = req.user.id;

    // fetch data from req body
    const { rating, review, courseId } = req.body;
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elementMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in the course",
      });
    }

    // check if user already reviewed the course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is already reviewed by the user",
      });
    }

    // create rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    // update course with this rating/review
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      },
      { new: true }
    );

    console.log(updatedCourseDetails);

    // return response

    return res.status(200).json({
      success: true,
      message: "Rating and Review created Successfully",
      ratingReview,
    });
  } catch (error) {
    console.log(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get average rating handler function
exports.getAverageRating = async (req, res) => {
  try {
    // get course ID
    const courseId = req.body.courseId;
    // calculate avg. rating -> mujhe ek yasi entry find out ker k do jiski courseId iss courseId se match ker rahi ho, that mean we are collectimg all those rating and reviews of that one course, and we will do this with every course, and after that only we will be able to calculate the average.
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    // return rating
    if(result.length > 0) {
        return res.status(200).json({
            success:true,
            avaerageRating: result[0].averageRating,
        })
    }

    // if no rating review exist
    return res.status(200).json({
        success: true,
        message: "Average Rating is 0, no rating given till now",
        averageRating: 0,
    })
  } catch (error) {
     console.log(500).json({
      success: false,
      message: error.message,
    });

  }
};

// get all rating and  reviews 
exports.getAllRating = async (req, res) => {
    try{
        const allReviews = await RatingAndReview.find({})
           .sort({rating: "desc"})
           .populate({
            path:"User",
            select: "firstName lastName email image",
           })
           .populate({
            path: "course",
            select: "courseName",
           })
           .exec();

           return res.status(200).json({
            success:true,
            message: "All reviews fetched successfully",
            data:allReviews,
           });
          

    }
    catch(error){
         console.log(500).json({
      success: false,
      message: error.message,
    });

    }
}

