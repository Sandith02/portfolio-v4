import { LinkArrow } from "@/components/link-arrow";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found">
      <div className="not-found-code">404</div>
      <div className="not-found-bottom">
        <div>
          <h1 className="display-sm">You found nothing.</h1>
          <p className="body-lg muted">Impressive, considering how much stuff is on the internet.</p>
        </div>
        <LinkArrow href="/">Go somewhere real</LinkArrow>
      </div>
    </main>
  );
}
