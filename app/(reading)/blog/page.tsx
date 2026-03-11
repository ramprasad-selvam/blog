import { redirect } from "next/navigation";

export default function BlogPage() {
  // This triggers as soon as the /blog route is hit
  redirect("/blog/pie");
}