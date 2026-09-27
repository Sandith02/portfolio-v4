# A world within

A large centered, faceless human bust carrying 10,240 single-word instances plus 80 larger accents. Sandith's 29 chosen words and phrases are defined verbatim in `thoughtWords`, including “SANDITH”, “SITHMAKA” and “MY MIND”. The 16 single words form the dense texture; the larger accents include every entry, with wider spaces for complete phrases.

The scanned inner cranium forms a closed, curved back wall. Its black cosmic lining carries faint stars and slow nebula texture beneath the visible words. A separate transparent film across the face retains restrained moving reflections. The figure has tiny idle motion and responds subtly to the pointer. There is no floating globe.

Scrolling enters the head and approaches its interior. The walls, lettering, and reflections darken progressively with proximity; the opening film fades as the camera passes through it. During the final 23% of the journey, the dark interior dissolves into a full-screen cosmic galaxy, fully revealed by 97%. Layered stars, drifting nebula clouds and dark dust lanes fill the viewport without a globe boundary. Reverse scrolling restores the head and its lighting. Pause, reduced-motion support, visibility suspension, cleanup, and static fallback posters are included.

Geometry: modified Lee Perry-Smith scan, with symmetric repair and isolated inner-ear cleanup. Attribution: public/models/inner-world-credits.txt.

Scene: lib/inner-world-scene.ts
Final galaxy: lib/cosmic-galaxy.ts
Layout: components/cinematic-hero.tsx
Styles: app/globals.css

The final galaxy uses a predominantly charcoal and silver palette, with only a faint purple accent in the outer haze. Cloud-layer intensity is roughly halved, the broad haze is narrower, and the distant core is softened so more dark space and stars show through.

## Creative role typography

The hero introduces Sandith as a creative developer seeking a creative team. Megrim is the display face; Manrope supports the name, role, navigation and links. The existing centered figure and camera are untouched. Two offset headline fields frame the head: “Quiet outside.” / “Worlds within.” Small captions and descriptive paragraphs have been removed. The only supporting hero copy is the name and role, a creative-role email link, and the work link. Mobile places the two headline fields below the face. Scroll chapters continue into “Always looking.” / “Never ordinary.” and “Strange ideas.” / “Real things.”

The background is a neutral charcoal #141417, with a brighter desaturated haze and only a faint cool undertone, reduced grain and no green-grey cast. Two soft desaturated light fields converge behind the head with scroll progress, creating soft inward-moving bands before darkening into the galaxy reveal. The shared scene clock keeps idle drift, pause and reduced motion consistent. Reverse scrolling restores the atmosphere. The figure materials are unchanged. Display text uses Megrim at 400; body and utility text use Manrope at 400–500.

The homepage grain overlays are removed: the hero retains its charcoal color with smooth, broad haze. Sparse background stars, occasional diagonal meteors and brief localized silver-blue electrical filaments sit behind the figure. They fade as the camera enters the head. Events follow the shared scene clock and pause control; reduced motion hides meteors and pulses. Pulses illuminate only a small background region, never the whole viewport.

The transparent face laminate catches the same events as curved, muted meteor streaks and pulse glints. Reflections use the same event timing as the background, follow the film's surface and pointer response, preserve the lettering underneath, and fade with the film during entry.

The background star field has three depth layers with varied sizes, restrained silver-blue and warm-white stars, slow twinkling and subtle scroll parallax. A loose diagonal concentration suggests a galaxy while retaining the smooth charcoal backdrop. Star sizes account for screen resolution so they remain visible on mobile; reduced motion keeps the stars still.

A faint Scorpius constellation occupies the upper-right background as a personal detail. Its hooked star arrangement is adapted from the [ESO / IAU reference chart](https://eso.org/public/images/eso1726d/), with no connecting lines and Antares as the brightest warm amber-red point. It scales down on mobile, stays behind the figure, and follows the atmosphere's pause, reduced-motion and scroll fade behavior.

Navigation follows the compact central capsule of Fourmula.ai: a solid #020108 pill, two-line Menu icon, home shortcut and live page scroll percentage. It has no logo. A narrow disclosure opens underneath, with Work, About, Contact and a direct role-enquiry email. Escape and outside clicks close the menu; links remain keyboard accessible. The same navigation works at all screen sizes.

The visible hero pause button has been removed. A bottom-left “Connect on LinkedIn” capsule links to https://www.linkedin.com/in/sandith02/, with a blue-and-white LinkedIn mark. It matches the navbar's near-black pill, fine border, sentence-case Manrope and inset charcoal circle around the arrow. “Explore my work” replaces the right-side “Open to creative roles” link; the bottom-center work link is removed. The scroll arrow sits in a thin outlined circle at bottom-right. LinkedIn opens in a new tab. On mobile its visible label shortens to “LinkedIn” while retaining the full accessible name. Reduced-motion and automatic scene visibility suspension remain active.

The LinkedIn mark is the unmodified `LI-In-Bug.png` from LinkedIn's [official downloads](https://brand.linkedin.com/downloads), stored at `public/images/linkedin-in-official.png`. The navbar uses a 44px capsule with 32px controls and equal 6px outer padding, including around the progress badge.
