import { mapCourses } from "@/lib/courses";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const course = mapCourses.find((c) => c.id === params.id);

  if (!course) {
    return {
      title: "Course Not Found",
      description: "This course does not exist",
    };
  }

  return {
    title: course.course,
    description: course.descrip,
    openGraph: {
      title: course.course,
      description: course.descrip,
      images: [course.img as string],
    },
  };
}

export default function Page({ params }: { params: { id: string } }) {
  const course = mapCourses.find((c) => c.id === params.id);

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold mb-4">Course not found</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-10 border-b pb-6">
        <h1 className="text-4xl font-bold mb-2">{course.course}</h1>
        <p className="text-gray-600">{course.descrip}</p>
      </div>

      {/* Body like documentation */}
      <article className="prose prose-lg max-w-none">
        <img
          src={course.img as string}
          alt={course.course}
          className="w-full h-32 object-contain mb-6"
        />

        <h2 className="font-bold text-xl">Introduction</h2>
        <p>
          Welcome to the <strong>{course.course}</strong> course. This section
          will give you a quick overview of what you’ll be learning and why it’s
          important in modern development workflows.
        </p>

        <h2>What You’ll Learn</h2>
        <ul>
          <li>Key concepts behind {course.course}.</li>
          <li>Best practices and common pitfalls.</li>
          <li>Hands-on examples and exercises.</li>
        </ul>

        <h2>Getting Started</h2>
        <p>
          To begin, ensure you have the proper environment set up. Follow the
          installation guide and prerequisites before diving into the lessons.
        </p>
        <h1 className="text-center py-2 font-medium">TBA</h1>
      </article>

      {/* Footer navigation */}
      <div className="mt-12 border-t pt-6 flex justify-between text-sm text-gray-600">
        <Link href="/courses" className="hover:text-black transition-colors">
          ← Back to Courses
        </Link>
      </div>
    </div>
  );
}
