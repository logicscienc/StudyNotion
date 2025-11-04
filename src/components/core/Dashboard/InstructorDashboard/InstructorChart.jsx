import { useState } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"

Chart.register(...registerables)

export default function InstructorChart({ courses = [] }) {
  const [currChart, setCurrChart] = useState("students")

  // Generate random colors
  const generateRandomColors = (numColors) => {
    const colors = []
    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`
      colors.push(color)
    }
    return colors
  }

  // ✨ Automatically limit the chart to show up to 10 items
  // But make it scrollable if there are more
  const maxVisible = 10
  const visibleCourses = courses.length > maxVisible ? courses.slice(0, maxVisible) : courses

  // Prepare chart data
  const chartDataStudents = {
    labels: visibleCourses.map((course) =>
      course.courseName.length > 15
        ? course.courseName.substring(0, 15) + "..."
        : course.courseName
    ),
    datasets: [
      {
        data: visibleCourses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: generateRandomColors(visibleCourses.length),
      },
    ],
  }

  const chartIncomeData = {
    labels: visibleCourses.map((course) =>
      course.courseName.length > 15
        ? course.courseName.substring(0, 15) + "..."
        : course.courseName
    ),
    datasets: [
      {
        data: visibleCourses.map((course) => course.totalAmountGenerated),
        backgroundColor: generateRandomColors(visibleCourses.length),
      },
    ],
  }

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#fff",
          font: {
            size: window.innerWidth < 640 ? 9 : 12, // smaller font on mobile
          },
        },
      },
    },
  }

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
      <p className="text-lg font-bold text-richblack-5">Visualize</p>

      {/* Toggle buttons */}
      <div className="space-x-4 font-semibold flex flex-wrap">
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Students
        </button>
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Income
        </button>
      </div>

      {/* Chart container */}
      <div className="relative mx-auto w-full max-h-[400px] min-h-[300px] overflow-y-auto custom-scrollbar">
        <Pie
          data={currChart === "students" ? chartDataStudents : chartIncomeData}
          options={options}
        />

        {/* If more than 10 courses, show hint */}
        {courses.length > maxVisible && (
          <p className="text-center text-sm text-richblack-300 mt-2 italic">
            Showing top {maxVisible} courses — scroll to see more.
          </p>
        )}
      </div>
    </div>
  )
}

