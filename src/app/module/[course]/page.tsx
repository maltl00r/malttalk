import { redirect } from "next/navigation";

interface ModulePageProps {
  params: Promise<{ course: string }>;
}

export default async function CourseModulePage({ params }: ModulePageProps) {
  const { course } = await params;
  redirect(`/module/${course}/dashboard`);
}
