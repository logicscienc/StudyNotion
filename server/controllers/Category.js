const { Mongoose } = require("mongoose");
const Category = require("../models/Category");
const Course = require("../models/Course");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

exports.createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log(CategorysDetails);
		return res.status(200).json({
			success: true,
			message: "Categorys Created Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
};

exports.showAllCategories = async (req, res) => {
	try {
        console.log("INSIDE SHOW ALL CATEGORIES");
		const allCategorys = await Category.find({});
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

//categoryPageDetails 

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;
    console.log("PRINTING CATEGORY ID:", categoryId);

    // 1️ Fetch the selected category
    const selectedCategory = await Category.findById(categoryId).select("name description");
    if (!selectedCategory) {
      console.log("❌ Category not found.");
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // 2️ Fetch all published courses that belong to this category
    const categoryCourses = await Course.find({ 
      category: categoryId, 
      status: "Published" 
    })
      .populate("instructor")
      .populate("ratingAndReviews")
      .exec();

    if (categoryCourses.length === 0) {
      console.log("⚠️ No courses found for this category.");
      return res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          categoryCourses: [],
          differentCategory: null,
          mostSellingCourses: [],
        },
        message: "No courses found for the selected category.",
      });
    }

    // 3️ Pick a random different category
    const otherCategories = await Category.find({ _id: { $ne: categoryId } });
    const randomCategory =
      otherCategories.length > 0
        ? otherCategories[getRandomInt(otherCategories.length)]
        : null;

    let differentCategoryCourses = [];
    if (randomCategory) {
      differentCategoryCourses = await Course.find({
        category: randomCategory._id,
        status: "Published",
      }).populate("instructor");
    }

    // 4️ Get top-selling courses across all categories
    const allCourses = await Course.find({ status: "Published" }).populate("instructor");
    const mostSellingCourses = allCourses.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 10);

    // 5️ Send response
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        categoryCourses,
        differentCategory: {
          ...randomCategory?._doc,
          courses: differentCategoryCourses,
        },
        mostSellingCourses,
      },
    });
  } catch (error) {
    console.error("❌ Error in categoryPageDetails:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};