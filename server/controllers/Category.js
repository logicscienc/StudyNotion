const Category = require("../models/Category");

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
		const allCategorys = await Category.find(
			{},
			{ name: true, description: true }
		);
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


// category page details 
exports.categoryPageDetails = async (req, res) => {
	try{
		// get category Id, category might be like-> top rated courses, similar kinds,  this simpley means that just think like you have lots of courses in Python , so here python is a category right. and we need to arrange them together.
		const {categoryId} = req.body;

		// get courses for specified categoryId
		const selectedCategory = await Category.findById(categoryId)
		       .populate("courses")
			   .exec();

		// validation
		if(!selectedCategory) {
			return res.status(404).json({
				success:false,
				message: "Data Not Found",
			});
		}

		// get courses for different categories
		const differentCategories = await Category.find({
			// ne = not equal, 
			_id: {$ne: categoryId},
		})
		.populate("courses")
		.exec();
		

		//HW ->  get top selling courses

		// return response
		return res.status(200).json({
			success: true,
			data: {
				selectedCategory,
				differentCategories,
			},
		});


	}
	catch(error){
		console.log(error);
		return res.status(500).json({
			success:false,
			message:error.message,
		});

	}
}