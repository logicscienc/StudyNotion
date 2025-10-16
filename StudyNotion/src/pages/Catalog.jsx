import React, { useEffect, useState } from "react"
import Footer from "../components/common/Footer"
import { useParams } from "react-router-dom"
import { apiConnector } from "../services/apiconnector"
import { categories } from "../services/apis"
import { getCatalogaPageData } from "../services/operations/pageAndComponentData"
import Course_Card from "../components/core/Catalog/Course_Card"
import CourseSlider from "../components/core/Catalog/CourseSlider"

const Catalog = () => {
  const { catalogName } = useParams()
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [categoryId, setCategoryId] = useState("")

  // 1️⃣ Fetch all categories to get categoryId
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        const selectedCategory = res?.data?.data?.find(
          (ct) =>
            ct.name.split(" ").join("-").toLowerCase() === catalogName.toLowerCase()
        )

        if (selectedCategory) {
          setCategoryId(selectedCategory._id)
        } else {
          console.log("Category not found")
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    getCategories()
  }, [catalogName])

  // 2️⃣ Fetch category page data once categoryId is available
  useEffect(() => {
    const getCategoryDetails = async () => {
      try {
        if (!categoryId) return
        const res = await getCatalogaPageData(categoryId)
        console.log("Catalog page data:", res)
        setCatalogPageData(res)
      } catch (error) {
        console.error("Error fetching catalog page data:", error)
      }
    }
    getCategoryDetails()
  }, [categoryId])

  return (
    <div className="text-white">
      {/* Breadcrumb / Category Info */}
      <div className="py-6 px-4">
        <p className="text-sm text-richblack-400">
          Home / Catalog /{" "}
          <span className="text-yellow-25">
            {catalogPageData?.data?.selectedCategory?.name}
          </span>
        </p>
        <h1 className="text-3xl font-semibold mt-2">
          {catalogPageData?.data?.selectedCategory?.name}
        </h1>
        <p className="text-richblack-300 mt-2">
          {catalogPageData?.data?.selectedCategory?.description}
        </p>
      </div>

      {/* Section 1: Courses to get you started */}
      <div className="py-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">Courses to get you started</h2>
        <div className="flex gap-x-3 mb-4">
          <p className="cursor-pointer text-yellow-25">Most Popular</p>
          <p className="cursor-pointer text-richblack-200">New</p>
        </div>
        <CourseSlider
          Courses={catalogPageData?.data?.selectedCategory?.courses}
        />
      </div>

      {/* Section 2: Top Courses from another category */}
      <div className="py-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">
          Top Courses in {catalogPageData?.data?.differentCategory?.name}
        </h2>
        <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses} />
      </div>

      {/* Section 3: Frequently Bought */}
      <div className="py-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">Frequently Bought</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {catalogPageData?.data?.mostSellingCourses
            ?.slice(0, 4)
            .map((course, index) => (
              <Course_Card course={course} key={index} Height={"h-[400px]"} />
            ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Catalog
