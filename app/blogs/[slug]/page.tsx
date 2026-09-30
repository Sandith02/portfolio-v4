import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { threads, getThread, threadReadingTime, threadDate, threadPath } from "@/content/threads";
import { SITE_URL, threadMetadata } from "@/lib/seo";
import { AUTHOR_NAME } from "@/lib/identity";
import { ThreadDock } from "@/components/thread-dock";
import { ThreadStructuredData } from "@/components/structured-data";
import { WorldSky } from "@/components/world-sky";
import worldStyles from "@/components/mind-world.module.css";
import styles from "../threads.module.css";

export const dynamicParams = false;
export function generateStaticParams() { return threads.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const thread = getThread((await params).slug);
  if (!thread) notFound();
  return threadMetadata(thread);
}

export default async function ThreadPage({ params }: { params: Promise<{ slug: string }> }) {
  const thread = getThread((await params).slug);
  if (!thread) notFound();
  const nextThread = threads[(threads.indexOf(thread) + 1) % threads.length];
  return (
    <main id="main-content" className={`${worldStyles.world} ${styles.readingWorld}`}>
      <ThreadStructuredData thread={thread} />
      <WorldSky />
      <div className={styles.reader}>
        <article className={styles.article} aria-labelledby="thread-title">
          <header className={styles.articleHeader}>
            <h1 id="thread-title">{thread.title}</h1>
            <div className={styles.articleByline}>
              <Link href="/about" rel="author">{AUTHOR_NAME}</Link>
              <div className={styles.meta}>
                <time dateTime={thread.published}>{threadDate(thread)}</time>
                <span>{threadReadingTime(thread)}</span>
              </div>
            </div>
          </header>
          <div className={styles.storyColumn}>
            <div className={styles.prose}>
              {thread.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            </div>
            <footer className={styles.articleFooter}>
            {nextThread !== thread && <aside className={styles.nextThread} aria-labelledby="next-thread-title">
              <Link href={threadPath(nextThread)} className={styles.threadLink} aria-labelledby="next-thread-title">
                <span className={styles.eyebrow}>Another thread to follow</span>
                <h2 id="next-thread-title">{nextThread.title}</h2>
                <span className={styles.readLabel}>Read this thread<ArrowRight size={16} aria-hidden="true" /></span>
              </Link>
            </aside>}
            </footer>
          </div>
        </article>
      </div>
      <ThreadDock key={thread.slug} slug={thread.slug} question={thread.paragraphs[thread.paragraphs.length - 1]} title={thread.title} url={`${SITE_URL}${threadPath(thread)}`} />
    </main>
  );
}
