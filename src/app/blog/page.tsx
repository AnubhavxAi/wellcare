import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 pt-24 pb-32">
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4">
          Health Tips & Articles
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed mb-12">
          Expert wellness insights curated for Agra families.
        </p>
        <div className="bg-surface-container-low rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-primary text-5xl mb-4 block">auto_stories</span>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">More articles coming soon</h2>
          <p className="text-on-surface-variant max-w-md mx-auto">
            Our health experts are working on in-depth articles about wellness, nutrition, and disease prevention for Agra families.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
