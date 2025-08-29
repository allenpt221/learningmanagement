import Link from "next/link";

import Electrical from '@/Images/electrical.png';
import BusinnesMarketing from '@/Images/businessmarketing.png'
import Marketing from '@/Images/marketing.png'



export const mapCourses = [
  {
    id: "f64d6c2f-131a-41e2-bb45-ced198035f5e",
    course: "TypeScript",
    img: "https://malcoded.com/_astro/Typescript.ApdKzZht_vchHI.webp",
    descrip: "Learn TypeScript from the ground up and strengthen your typing skills.",
  },
  {
    id: "5a8853c1-52c7-4ecc-bf2b-164b6aeb70bf",
    course: "React",
    img: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    descrip: "Build modern UIs using React and component-driven development.",
  },
  {
    id: "88af959d-7eda-497a-8136-139cdeed0d7b",
    course: "Next.js",
    img: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png",
    descrip: "Master fullstack development with Next.js and server-side rendering.",
  },
  {
    id: "55dad268-6fe0-496d-a3b0-df2777db5c54",
    course: "Node.js",
    img: "https://blog.42mate.com/wp-content/uploads/2016/08/Node-js-Logo.png",
    descrip: "Learn backend development with Node.js and build scalable APIs.",
  },
  {
    id: "9f8d2b1e-6c44-4ad8-b25c-11223cc44c1f",
    course: "Mechanical Engineering",
    img: "https://png.pngtree.com/png-clipart/20241124/original/pngtree-mechanical-engineers-png-image_17291732.png",
    descrip: "Explore mechanics, thermodynamics, and materials to design real-world machines.",
  },
  {
    id: "ad1f90b2-87cb-43f6-9f12-6cf032b674aa",
    course: "Electrical Engineering",
    img: Electrical.src,
    descrip: "Learn circuits, electronics, and power systems to build modern electrical solutions.",
  },
  {
    id: "6e91d51c-2e2c-4d67-9b4d-1a27d4cc5a9e",
    course: "Business Management",
    img: BusinnesMarketing.src,
    descrip: "Understand leadership, organizational behavior, and strategic management.",
  },
  {
    id: "c95b2f3e-53c1-4df0-9c59-3f45e2445b7d",
    course: "Marketing",
    img: Marketing.src,
    descrip: "Learn market research, branding, and digital marketing strategies.",
  },
];



export default function Page() {
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
