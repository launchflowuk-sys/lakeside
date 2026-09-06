import { Link } from "wouter";
import BlogCover from "./BlogCover";
import { formatPostDate, type BlogPost } from "./posts";
import { IconArrowRight } from "@/components/icons/Icons";

interface PostCardProps {
  post: BlogPost;
  /** The lead card runs full width with the cover beside the copy. */
  lead?: boolean;
}

export default function PostCard({ post, lead = false }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`bl-card ls-reveal${lead ? " bl-card-lead" : ""}`}
      aria-label={post.title}
    >
      <div className="bl-card-media">
        <BlogCover variant={post.cover} className="bl-card-cover" />
      </div>
      <div className="bl-card-body">
        <div className="bl-card-meta">
          <span className="ls-pill ls-pill-yellow">{post.category}</span>
          <time dateTime={post.published}>{formatPostDate(post.published)}</time>
          <span className="bl-dot" aria-hidden="true" />
          <span>{post.readMinutes} min read</span>
        </div>
        <h2 className="bl-card-title">{post.title}</h2>
        <p className="bl-card-excerpt">{post.excerpt}</p>
        <span className="bl-card-go">
          Read the guide
          <IconArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}
