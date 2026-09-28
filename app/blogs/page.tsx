import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/structured-data";
import { ConstructedTitle } from "@/components/constructed-title";
import { BackToMind } from "@/components/back-to-mind";
import { WorldSky } from "@/components/world-sky";
import worldStyles from "@/components/mind-world.module.css";
import styles from "./threads.module.css";

export const metadata = pageMetadata("threads");

export default function ThreadsPage() {
  return (
    <main id="main-content" className={worldStyles.world}>
      <PageStructuredData page="threads" />
      <WorldSky />
      <BackToMind world="threads" />
      <section className={styles.layout} aria-labelledby="threads-title">
        <h1 id="threads-title" className={styles.title}>
          <span className="inner-accessible-title">Threads</span>
          <ConstructedTitle lines={["Threads"]} />
        </h1>
        <div className={styles.introduction}>
          <p className={styles.description}>A place for my thoughts on design, code and the ideas in between. Notes, experiments and things I’m still figuring out.</p>
          <p className={styles.soon}>Coming soon.</p>
        </div>
      </section>
    </main>
  );
}
