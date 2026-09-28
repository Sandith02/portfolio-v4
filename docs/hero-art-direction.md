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

## Inner universe / September 27

The homepage is now exclusively the head-to-inner-universe journey. The old
positioning, project, services, manifesto, rescue and contact blocks are removed
from the homepage, along with its footer. Other destination pages remain accessible.

After crossing the head, the visitor travels through Sandith’s own imagined galaxy.
During the planet journey, the star field is sparser and dimmer, and the diagonal
cloud band is softened to keep the worlds prominent. The shared background
gradually regains its light as it forms the finale beam.
Five worlds represent Work, About, Contact, Why and Threads. Work is a complete spherical
shell of 6,400 tiny ash-grey 3D particles, with no split, terrain half or pills.
A smaller dark globe sits inside, visible between the particles. Its smooth,
unpatterned surface blends muted pink and light-blue tones with a trace of warm
coral, softly illuminating on a 5.6-second breathing cycle while the base stays dark.
The entire object rotates together, with real shaded
particle volume and depth around the core.
The ash-grey particles have a faint cool glow with independent, slow twinkles.
Each pulse has its own phase and pace, with a small soft halo at its peak;
reduced-motion preference holds the twinkle steady.
No maps or photographs of Solar System planets ship.

About is a full solid globe with Sandith's thoughts carved across its curved
surface, using a dedicated texture with every word and phrase at one consistent
font size. The hero keeps its own texture. Soft silver reflections
and recessed lettering give it a personal, sculptural character. The particle
cloud treatment is removed. All worlds are enlarged by roughly 15–20%; About
remains the largest; its globe was subsequently reduced by 12% while the rings
kept their size (the globe is now about 1.66 times Work's diameter),
with a correspondingly larger interaction area.
Two diagonally inclined electric-white orbital bands surround About. The bands
have visible width, filled with fine luminous strands, racing packets and sparks
moving in opposite directions, plus a soft local halo. The globe occludes their far-side arcs. Reduced motion holds the
ring highlights steady.

Why is a deep pink-to-blue globe with a faint neutral edge sheen. The strong
orange/yellow outer border is removed; color stays within the globe. The
earlier split silver shell is also removed.

Contact is a deep teal glass globe containing 2,800 softly glowing mint particles
at different depths. A restrained teal haze and reflective rim follow the supplied
reference; the particles drift and twinkle slowly. The earlier companion and
connecting streams are removed. Work retains its pink/light-blue inner globe.


The original head geometry, center position and camera path remain. That passage
takes three viewport lengths. Thereafter native scrolling drives travel in 3D:
worlds approach, enlarge, pass beside the unseen viewer and disappear behind.
The initial world depths are 3, -32, -76, -126 and -166; positions are staggered vertically
and across the flight path. Only the approaching, hovered or focused world gets a
full caption. Other worlds remain quiet discoveries at a distance.

The native scroll journey spans 26 viewport heights. Progress is measured in
viewport units. The five worlds have fixed depths and pass once; stars wrap in
depth independently. Small travel-driven camera drift suggests a smooth ride
without showing a vehicle. The navbar tracks the complete journey as a percentage.

After Why passes, a centered cinematic message appears: “You’ve seen a part
of me.” above “The rest stays within.” It resolves into focus, holds for reading,
and fades before the silhouette appears. Reverse scrolling clears the message.

The diagonal galaxy band itself now becomes the ending. The voyage and finale
share one cloud/star shader: the same band rotates upright, narrows, and gathers
into the vertical beam. The cloud texture and fine particles stream rapidly upward along the band,
accelerating to roughly one viewport per second, then easing into a slow upward
drift around the silhouette. The beam stays anchored as the clouds pass through it.
The surrounding stars remain visible throughout; the earlier heavy darkening,
closing curtains, separate ribbon backdrop and radial speed lines are removed.
The arrival now unfolds over 9.4 seconds. The current first gathers into a small
bright point; a thin filament grows upward from it and soft strands merge into the
beam. The fully dark figure drifts upward from below the viewport at a constant
size and depth, easing gradually to rest in the centered pose. The relaxed
arms open gently in the upward current, then settle with a small
delay between the shoulders and forearms. There is no raised-fist gesture.
A small sideways drift and body lean resolve to the original relaxed pose;
Once settled, the arms keep drifting on a slow seven-second cycle, with the
forearms following the shoulders and each side slightly out of phase.
The halo broadens as it settles. The footer waits until the rise is complete
before appearing.

A posed MakeHuman full-body mesh supplies the silhouette, with plain clothing,
natural hands, loose arms, one extended leg and one lifted leg. It replaces the
rejected procedural mannequin. The material stays fully opaque and unlit from
its first visible frame: the backlight reveals only its outline, never a lit face.
Fine white stars and illuminated dust surround the beam. Source/license notes
accompany the asset. Scrolling back restores the four worlds.

Drag a globe to rotate it; release leaves a short damped momentum. Vertical touch
scrolling remains available. Arrow keys rotate a focused globe. Click/Enter flies
into the chosen surface, fades during crossing and opens its page. Modified clicks
retain normal link behavior. Route completion is independent of animation frames.
Fallback backgrounds use desktop and mobile captures of the 3D canvas only, at
`/images/inner-world-background.webp` and `/images/inner-world-background-mobile.webp`.
Never capture the full page for these assets: headings, navigation and contact
copy are rendered once by the live HTML. If WebGL fails during the journey, the
fallback immediately restores this background and the opening hero copy, hiding
later chapters and planet controls.

Reduced-motion and fallback visitors can use the persistent menu directly. Why uses
the personal language already supplied for the figure’s words.

Resources, listeners and navigation timers are disposed on unmount. The second
scene shares the hero renderer and visibility lifecycle. HTML controls are projected
from the same 3D positions as the worlds, with offscreen links excluded from focus.

## Life in the inner galaxy

The continuous journey now includes independent layers of motion: silver-blue
meteors with broken fading trails, rotating pieces of dark planetary strata,
fine particles that fade in and out of slow currents, and warm luminous presences
with short curved trails. A dark moving field gently distorts and dims the distant
stars. These are poetic inner-world elements, not scientific claims about dark matter.

All foreground elements occupy 3D depth and share the forward scroll motion. Fixed
geometry pools and instancing bound resource use; mobile renders fewer particles,
fragments and meteor lanes. Effects fade during entry into a selected world and
share the hero’s visibility/reduced-motion lifecycle. No input is intercepted.

Floating text/paper scraps were explicitly rejected and removed. Words remain only
in the existing figure and About glass sculpture; no memory cards float in space.

## Footer in the final sky

The final scene now serves as the homepage footer. After the figure arrives,
“Still becoming.” appears at the bottom in Megrim, with “Have a place for a mind
like mine?” and a dark capsule email link. A quiet bottom row contains the name,
copyright year, LinkedIn and a “Back to the surface” control. The footer fades in
below the silhouette, remains on the galaxy background, and becomes hidden/inert
when the visitor reverses out of the ending. Mobile stacks these elements.

Threads (the blog destination) is one uneven glossy liquid body, without a
separate rim or membrane. Its entire silhouette continuously folds and reshapes;
surface normals deform with it so reflections follow the moving liquid. Muted
bronze and pale cyan highlights replace the earlier amber archive treatment. It follows Why and enters /blogs; the page starts with an honest empty
state for the first article. The journey is 30 viewport lengths, with departure
from 25.8 and the finale beginning at 27.1, after the fifth world.

Threads is enlarged to radius 2.25 on desktop and 1.3 on mobile. About remains
the largest globe at effective radius 2.992 / 1.672, excluding its larger rings.

Unfinished ideas appear sparingly throughout the journey: seven broken-ring,
partial-wireframe and loose-facet forms draw and gather themselves into shape.
Only fourteen isolated fragments remain (seven on mobile), with generous empty
space between them. One distant idea gathers into a bright starburst near
Contact, Why or Threads, randomly selected for each journey. Its position varies
across the upper-left and upper-right before it disperses into sparks and a lingering glow.
The burst sends a pale light wave across the viewport and a brief, irregular
earthquake-like vibration through the entire scene, decaying smoothly back to
stillness. It triggers once per forward approach, cancels immediately when
scrolling backward, and never repeats while idle. Returning to the early galaxy
selects a new encounter for the next forward pass. Reduced motion disables the ignition
and holds the unfinished forms still.

Solid fragments use irregular, cratered meteorite geometry with rough mineral
grain rather than flat primitive faces. The final figure stays almost black:
a sparse, heavily dimmed starfield lives within its silhouette, with a soft
silver-blue rim tracing the body edges. Its face remains unlit.

The word-lined threshold is a freely scrolling introduction. A centered invitation,
“Somewhere only I know,” introduces the worlds, forming ideas and turbulence.
The invitation title uses the hero’s letter-construction animation. The body
copy is one paragraph, with no eyebrow or dash. There is no entry button or
scroll lock: the original scroll-driven camera movement continues naturally.
The top-left identity and hero controls disappear for this stage, leaving the
centered copy and main navbar. “Inside my mind” also uses the hero’s
letter-construction animation when the galaxy comes into view.
The farewell heading, “The rest / stays within,” shares that animation as well.
Every word gap is an explicit, nonanimated spacer so construction never
collapses adjacent words together.

The hero previews the inner galaxy at 22% of its shared field intensity, adding
faint stars and a soft diagonal haze behind the head. Its base atmosphere and
edge vignette use a soft charcoal between the original gray and near-black,
keeping the head and lettering prominent.
The former “Strange ideas / Real things” side headings
are removed from this stage so the invitation stands alone.
