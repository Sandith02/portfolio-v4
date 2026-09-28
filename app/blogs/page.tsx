import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/structured-data";
import { ConstructedTitle } from "@/components/constructed-title";
import { BackToMind } from "@/components/back-to-mind";
import { WorldSky } from "@/components/world-sky";
import { threads, threadPath, threadReadingTime, threadDate } from "@/content/threads";
import worldStyles from "@/components/mind-world.module.css";
import styles from "./threads.module.css";

export const metadata = pageMetadata("threads");

export default function ThreadsPage() {
  const [latest, ...earlier] = threads;
  return (
    <main id="main-content" className={`${worldStyles.world} ${styles.indexWorld}`}>
      <PageStructuredData page="threads" />
      <WorldSky />
      <BackToMind world="threads" />
      <div className={styles.indexLayout}>
        <header className={styles.indexIntro}>
          <h1 id="threads-title" className={styles.title}>
            <span className="inner-accessible-title">Threads</span>
            <ConstructedTitle lines={["Threads"]} />
          </h1>
          <p className={styles.description}>A place for my thoughts on design, code and the ideas in between. Notes, experiments and things I’m still figuring out.</p>
          <p className={styles.collectionNote}>{threads.length} threads to wander through.</p>
        </header>
        <section className={styles.collection} aria-label="Published threads">
          {latest && <article className={styles.featured}>
            <Link href={threadPath(latest)} className={styles.threadLink} aria-labelledby={`title-${latest.slug}`}>
              <span className={styles.eyebrow}>The latest thread</span>
              <h2 id={`title-${latest.slug}`}>{latest.title}</h2>
              <p className={styles.excerpt}>{latest.description}</p>
              <div className={styles.meta}><time dateTime={latest.published}>{threadDate(latest)}</time><span>{threadReadingTime(latest)}</span></div>
              <span className={styles.readLabel}>Read this thread<ArrowRight size={16} aria-hidden="true" /></span>
            </Link>
          </article>}
          {earlier.length > 0 && <div className={styles.archive}>
            <h2 className={styles.archiveTitle}>Earlier threads</h2>
            <div className={styles.entryGrid}>
              {earlier.map(thread => (
                <article key={thread.slug} className={styles.entry}>
                  <Link href={threadPath(thread)} className={styles.threadLink} aria-labelledby={`title-${thread.slug}`}>
                    <div className={styles.meta}><time dateTime={thread.published}>{threadDate(thread)}</time><span>{threadReadingTime(thread)}</span></div>
                    <h3 id={`title-${thread.slug}`}>{thread.title}</h3>
                    <p className={styles.excerpt}>{thread.description}</p>
                    <span className={styles.readLabel}>Read this thread<ArrowRight size={16} aria-hidden="true" /></span>
                  </Link>
                </article>
              ))}
            </div>
          </div>}
        </section>
      </div>
    </main>
  );
}
