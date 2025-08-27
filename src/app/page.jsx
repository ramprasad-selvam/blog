import Link from "next/link"

export default function DashboardPage() {
  return (
    <div>
      <h1>Welcome to Your Dashboard</h1>
      <div className="grid">
        <Link href="/blog" className="card">
          <h2>📝 Blog</h2>
          <p>Manage your blog posts, drafts, and articles.</p>
        </Link>

        <Link href="/portfolio" className="card">
          <h2>💼 Portfolio</h2>
          <p>Showcase and edit your projects here.</p>
        </Link>
      </div>
    </div>
  )
}
