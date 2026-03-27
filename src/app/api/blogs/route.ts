import { NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["enclosure", "enclosure", { keepArray: true }],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

export async function GET() {
  try {
    // Fetch from a reliable health news source
    // Medical News Today or Healthline are good candidates
    const feed = await parser.parseURL("https://www.medicalnewstoday.com/feed");

    const blogs = feed.items.map((item) => {
      // Extract image URL
      let imageUrl = null;
      
      // Try to find image in media:content or enclosure
      if (item.mediaContent && item.mediaContent[0]?.$?.url) {
        imageUrl = item.mediaContent[0].$.url;
      } else if (item.enclosure && item.enclosure[0]?.$?.url) {
        imageUrl = item.enclosure[0].$.url;
      }

      // If no image found in tags, try to parse it from content:encoded using regex
      if (!imageUrl && item.contentEncoded) {
        const imgMatch = item.contentEncoded.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) imageUrl = imgMatch[1];
      }

      // Fallback for categories
      const categories = item.categories || ["Health"];

      return {
        id: item.guid || item.link,
        title: item.title,
        link: item.link,
        excerpt: item.contentSnippet?.slice(0, 160) + "...",
        pubDate: item.pubDate,
        author: item.creator || "Medical News Today",
        category: categories[0],
        image: imageUrl || "https://images.unsplash.com/photo-1505751172157-c72ad59ce984?auto=format&fit=crop&q=80&w=800", // Fallback image
        source: "Medical News Today"
      };
    });

    return NextResponse.json(blogs.slice(0, 12));
  } catch (error: any) {
    console.error("RSS Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}
