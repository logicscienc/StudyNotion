 const {instance} = require("../config/razorpay");
 const Course = require("../models/Course");
 const User = require("../models/User");
 const mailSender = require("../utils/mailSender");
 const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");


//  capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
    // get courseId and UserID
    const {course_id} = req.body;
    const userId = req.user.id;

    // validation
    // valid courseId
    if(!course_id) {
        return res.json({
            success:false,
            message: "Please provide valid course ID",
        })
    };

    // valid courseDetail
    let course;
    try{
        course = await Course.findById(course_id);
        if(!course){
            return res.json({
                success:false,
                message: "Could not find the course",
            });
        }

        // user already pay for the same course. to check this we need to compair the userID which is in string form with ObjectId of the student which is present in the Course model which is in object form. for this we need to convert string into Object.
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)) {
            return res.status(200).json({
                success:false,
                message: "Student is already enrolled",
            });
        }

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

    // order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
            courseId: course_id,
            userId,
        }
    };

    try{
        // initiate the payment using Razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        // return response
        return res.status(200).json({
            success:true,
            courseName: course.courseName,
            courseDescription : course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,

        })
    }
    catch(error){
          console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// verify Signature of Razorpay and server
exports.verifySignature = async (req, res) => {
    // this is the signature which is stored in my backend
    const webhookSecret = "12345678";

    // this is the signature which will get from rezorpay
    const signature = req.headers("x-razorpay-signature");

    // we need to make it secure that's why we will use HMAC. and for HMAC we need to things hashing algoritham(SHA 256) and secret key. 
    // step A 
    const shasum = crypto.createHmac("sha256", webhookSecret);
    // step B
    shasum.update(JSON.stringify(req.body));
    // step C
    const digest = shasum.digest("hex");

    if(signature === digest) {
        console.log("Payment is Authorised");


        const {courseId, userId} = req.body.payload.payment.entity.notes;

        try{
            // fulfill the action

            // find the course and enroll the student in it

            const enrolledCourse = await Course.findOneAndUpdate(
                {_id: courseId},
                {$push: {studentsEnrolled: userId}},
                {new:true},
            );

            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message: "Course not Found",
                });
            }

            console.log(enrolledCourse);

            // find the student and add in the course to thire list enrolled courses mai.

            const enrolledStudent = await User.findOneAndUpdate(
                {_id:userId},
                {$push: {courses: courseId}},
                {new:true},
            );

            console.log(enrolledStudent);

            // mail send krdo confirmation wala
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Congratulations from StudyNotion",
                "Congratulations, you are onboarded into new StudyNotion Course",
            );

            console.log(emailResponse);
            return res.status(200).json({
                success: true,
                message: "Signature Veriifed and Course Added",
            });
        

        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
         } }

      else {
        return res.status(400).json({
            success: false,
            message: "Invalid request",
        });
      }    



}