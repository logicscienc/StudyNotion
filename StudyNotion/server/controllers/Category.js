const { Mongoose } = require("mongoose");
const Category = require("../models/Category");
const Course = require("../models/Course")
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
    console.log("PRINTING CATEGORY ID: ", categoryId);

    // 1️ Fetch courses for the selected category
    const selectedCategoryCourses = await Course.find({
      category: categoryId,
      status: "Published",
    })
      .populate("ratingAndReviews")
      .exec();

    // Fetch selected category details
    const selectedCategory = await Category.findById(categoryId).lean();
    if (!selectedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    selectedCategory.courses = selectedCategoryCourses;

    // Handle case when no courses are found
    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.");
      // Still returning category details but empty courses array
      return res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory: null,
          mostSellingCourses: [],
        },
      });
    }

    // 2️ Fetch a different category with its published courses
    const otherCategories = await Category.find({
      _id: { $ne: categoryId },
    }).lean();

    let differentCategory = null;
    if (otherCategories.length > 0) {
      const randomCategory =
        otherCategories[getRandomInt(otherCategories.length)];
      const differentCategoryCourses = await Course.find({
        category: randomCategory._id,
        status: "Published",
      }).exec();
      randomCategory.courses = differentCategoryCourses;
      differentCategory = randomCategory;
    }

    // 3️ Get top-selling courses across all categories
    const allCourses = await Course.find({ status: "Published" })
      .populate("instructor")
      .exec();

    const mostSellingCourses = allCourses
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 10);

    // 4️ Return final response
    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};