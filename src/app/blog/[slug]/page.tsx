"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BLOGS } from "@/components/HealthBlog";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const blog = BLOGS.find(b => b.slug === slug);

  if (!blog) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-4">Article Not Found</h1>
            <a href="/blog" className="text-primary font-semibold hover:underline">← Back to Blog</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-3xl mx-auto w-full px-6 pt-24 pb-32">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span className="text-outline-variant">›</span>
          <a href="/blog" className="hover:text-primary transition-colors">Blog</a>
          <span className="text-outline-variant">›</span>
          <span className="text-on-surface font-medium truncate">{blog.title}</span>
        </nav>

        {/* Category + Date */}
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed text-xs font-bold rounded-full">
            {blog.category}
          </span>
          <span className="text-on-surface-variant text-sm">{blog.date}</span>
        </div>

        {/* Title */}
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Author */}
        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-outline-variant/20">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-sm">person</span>
          </div>
          <div>
            <p className="font-semibold text-on-surface text-sm">{blog.author}</p>
            <p className="text-on-surface-variant text-xs">{blog.readTime}</p>
          </div>
        </div>

        {/* Hero illustration */}
        <div className="aspect-[2/1] rounded-xl overflow-hidden mb-10" style={{ backgroundColor: blog.bgColor }}>
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-on-surface/10 font-headline font-extrabold text-[80px] select-none">{blog.category}</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose max-w-none">
          <p className="text-on-surface leading-relaxed text-lg mb-6">{blog.excerpt}</p>
          <div className="bg-surface-container-low rounded-xl p-8 my-8">
            <p className="text-on-surface-variant text-sm leading-relaxed">
              This is a preview article. Full content with expert medical advice, prevention tips, and detailed guidance will be published soon. 
              Stay tuned for comprehensive health insights curated specifically for families in Agra.
            </p>
          </div>
          <p className="text-on-surface leading-relaxed">
            For immediate health concerns, please consult with a qualified healthcare professional or visit your nearest Wellcare Pharmacy branch.
          </p>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-outline-variant/20">
          <a href="/blog" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to all articles
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
