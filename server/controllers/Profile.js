const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    // get data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
    // get userId-> so from where we will get this, we had stored or fetch the userId in our auth middleware   const decode = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decode);
    // req.user = decode; and in our payload in our login function of Auth.js
    const id = req.user.id;

    // validation
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    // update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    // return response
    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      profileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete Account
// Explore -> how can we schedule this deletion opertion

exports.deleteAccount = async (req, res) => {
  try {
    // get id
    const id = req.user.id;
    // validation
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

     // current code snippet
    //  await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

    // Schedule deletion 
    //  userDetails.markedForDeletion = true;
    //     userDetails.deletionDate = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
    //     await userDetails.save();
    
   

    // TODO: HW unenroll user from all enrolled courses
     if (userDetails.courses && userDetails.courses.length > 0) {
            await Course.updateMany(
                { _id: { $in: userDetails.courses } },
                { $pull: { studentsEnrolled: id } }
            );
        }

    // Delete profile
    await Profile.findByIdAndDelete(userDetails.additionalDetails);
    // delete user
     await User.findByIdAndDelete({ _id: id });

    // return response
    return res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User cannot be deleted successfully",
    });
  }
};

exports.getAllUserdetails = async (req, res) => {
  try {
    // get id
    const id = req.user.id;

    // validation and get user details
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    // return response
    return res.status(200).json({
      success: true,
      message: "User Dta Fetched Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
