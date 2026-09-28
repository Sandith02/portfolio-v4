// In-memory only: client navigation keeps this flag; a fresh document resets it.
// Do not use localStorage/sessionStorage: refreshing should replay the intro.
let enteredThisDocument = false;

export function skipIntroOnNavigation() { enteredThisDocument = true; }
export function hasEnteredThisDocument() { return enteredThisDocument; }
