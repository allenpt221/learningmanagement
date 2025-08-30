import mapCourses from "@/lib/courses";
import Link from "next/link";


function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-xl text-center mb-8 md:w-[50rem] mx-auto">Explore a diverse range of courses from modern technologies to engineering principles and business strategies.</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mapCourses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden bg-white"
          >
            <img
              src={course.img as string}
              alt={course.course}
              className="h-40 w-full object-contain bg-gray-50 p-4"
            />

            <div className="flex flex-col flex-1 p-4">
              <h2 className="text-lg font-semibold mb-2">{course.course}</h2>
              <p className="text-gray-600 text-sm flex-1">{course.descrip}</p>

              <Link
                href={`/courses/${course.id}`}
                className="mt-4 bg-black text-white text-center rounded-lg py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                View Course
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;