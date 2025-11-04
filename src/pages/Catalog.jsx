import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import { useSelector } from "react-redux"
import Error from "./Error"


console.log(" Catalog.jsx rendered");


const Catalog = () => {
   console.log("Catalog component mounted!");
  const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams()
  const [active, setActive] = useState(1)
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [categoryId, setCategoryId] = useState("")

  // -----------------------------
  // 🔹 FETCH ALL CATEGORIES
  // -----------------------------

  console.log(" Catalog.jsx rendered, catalogName:", catalogName);

useEffect(() => {
  console.log(" useEffect running for catalog:", catalogName);

  const getCategories = async () => {
    try {
      console.log(" Inside getCategories() before API call");
      console.log(" Endpoint:", categories.CATEGORIES_API);

      const res = await apiConnector("GET", categories.CATEGORIES_API);

      //  Debug logs right after response
      console.log(" All categories response:", res?.data?.data);
      console.log(" Raw catalogName from URL:", catalogName);

      // Log every category name for comparison
      res?.data?.data?.forEach((ct) => {
        console.log("🔹 Category from backend:", ct.name);
      });

      // Category matching logic
      const selectedCategory = res?.data?.data?.find((ct) => {
        const formattedName = ct.name.replace(/\s+/g, "-").replace(/[^\w-]/g, "").toLowerCase();
        const formattedCatalog = catalogName.replace(/[^\w-]/g, "").toLowerCase();
        return formattedName === formattedCatalog;
      });

      console.log("Selected category object:", selectedCategory);

      if (selectedCategory) {
        console.log(" Matched Category:", selectedCategory.name);
        setCategoryId(selectedCategory._id);
      } else {
        console.log(" Category not found for:", catalogName);
      }
    } catch (error) {
      console.error(" Error fetching categories:", error);
    }
  };

  getCategories();
}, [catalogName]);


  // -----------------------------
  // 🔹 FETCH CATALOG PAGE DATA
  // -----------------------------
  useEffect(() => {
    const getCategoryDetails = async () => {
      try {
        if (!categoryId) {
          console.warn(" No categoryId yet, skipping catalog fetch.")
          return
        }
        console.log(" Fetching catalog page data for categoryId:", categoryId)
        const res = await getCatalogaPageData(categoryId)
        console.log(" Catalog page data response:", res)
        setCatalogPageData(res)
      } catch (error) {
        console.error(" Error fetching catalog page data:", error)
      }
    }

    getCategoryDetails()
  }, [categoryId])

  // -----------------------------
  // 🔹 CONDITIONAL RENDER CHECKS
  // -----------------------------
  console.log(" Loading:", loading)
  console.log(" Catalog Page Data:", catalogPageData)

  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!loading && !catalogPageData.success) {
    return <Error />
  }

  // -----------------------------
  // 🔹 MAIN RETURN UI
  // -----------------------------
  return (
    <>
      {/* Hero Section */}
      <div className="box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* Section 1 */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Courses to get you started</div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 ${
              active === 1
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Popular
          </p>
          <p
            className={`px-4 py-2 ${
              active === 2
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>
        <div>
          <CourseSlider Courses={catalogPageData?.data?.categoryCourses} />
        </div>
      </div>

      {/* Section 2 */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
          Top courses in {catalogPageData?.data?.differentCategory?.name}
        </div>
        <div className="py-8">
          <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses} />
        </div>
      </div>

      {/* Section 3 */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Frequently Bought</div>
        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {catalogPageData?.data?.mostSellingCourses
              ?.slice(0, 4)
              .map((course, i) => (
                <Course_Card course={course} key={i} Height={"h-[400px]"} />
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Catalog

