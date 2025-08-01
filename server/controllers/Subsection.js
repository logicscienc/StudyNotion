const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create SubSection

exports.createSubSection = async (req, res) => {
  try {
    // fetch data from Req body
    const { sectionId, title, timeDuration, description } = req.body;
    // extract file/video
    const video = req.files.videoFile;
    // validation
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    // create a sub-section
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // update section with this sub section ObjectId
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: SubSectionDetails._id,
        },
      },
      { new: true }
    ).populate("subSection");

    // HW: log updated section here, after adding populate query
    // return response
    return res.status(200).json({
      success: true,
      message: "Sub Section Created Successfully",
      updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// HW: updateSubSection

exports.updateSubSection = async (req, res) => {
  try {
    const { subSectionId, title, description, timeDuration } = req.body;
    // if u want to update the video too.
    const video = req.files.videoFile;

    //  validate subSectionId
    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "subSectionId is required",
      });
    }

    // Find subsection
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    // Update fields if provided
    if (title !== undefined) subSection.title = title;
    if (description !== undefined) subSection.description = description;
    if (timeDuration !== undefined) subSection.timeDuration = timeDuration;

    // If a new video is uploaded, handle upload
    if (video) {
      const uploadedVideo = await uploadImageToCloudinary(video);
      subSection.videoUrl = uploadedVideo.secure_url;
    }

    await subSection.save();

    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      data: subSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update SubSection",
      error: error.message,
    });
  }
};

// HW: deleteSubsection



exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId } = req.params;
    const { sectionId } = req.body; // frontend sends sectionId

    // Delete the subSection document
    await SubSection.findByIdAndDelete(subSectionId);

    // Remove subSectionId from the subSection array in Section
    await Section.findByIdAndUpdate(sectionId, {
      $pull: { subSection: subSectionId },
    });

    return res.status(200).json({
      success: true,
      message: "SubSection Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete SubSection, please try again",
      error: error.message,
    });
  }
};
