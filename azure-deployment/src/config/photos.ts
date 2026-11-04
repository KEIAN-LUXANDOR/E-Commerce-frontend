/**
 * Every photo slot on the site (not product photos — those come from the admin upload).
 *
 * To add a photo from the shoot:
 *   1. Export it at the size below and save it in /public/photos/ with the file name shown.
 *   2. Set `src` for that slot to "/photos/<file name>".
 * Until `src` is set, the site shows a clean diamond drawing instead (and, while developing,
 * a small label naming the slot so it's easy to find).
 *
 * The full shot list with briefs is in docs/PHOTO-SHOT-LIST.md.
 */
export interface PhotoSlot {
  /** Path under /public, e.g. "/photos/home-hero.jpg". null until the photo is ready. */
  src: string | null;
  /** Describes the photo for screen readers and Google. Write what's actually in the picture. */
  alt: string;
  /** Width / height, used to reserve space so the page doesn't jump. */
  ratio: "16/9" | "3/2" | "4/5" | "1/1" | "21/9" | "4/3";
  /** Short note for the photographer and for whoever adds the file. */
  brief: string;
}

export const photos = {
  homeHero: {
    src: null,
    alt: "A loose diamond held in tweezers under soft studio light",
    ratio: "16/9",
    brief: "Hero. One loose diamond in tweezers or on a dark navy surface, lots of empty space on the left for the headline. 2400×1350, plus a 4:5 crop for phones.",
  },
  homeNatural: {
    src: null,
    alt: "A natural diamond resting on a grey stone surface",
    ratio: "4/5",
    brief: "Natural diamonds card. A natural stone on a mineral/stone surface. 1200×1500.",
  },
  homeLabGrown: {
    src: null,
    alt: "A lab-grown diamond on a clean white surface",
    ratio: "4/5",
    brief: "Lab-grown diamonds card. Same framing as the natural shot but on a clean white/glass surface. 1200×1500.",
  },
  homeCertificate: {
    src: null,
    alt: "A diamond beside its grading report",
    ratio: "3/2",
    brief: "Trust section. A stone next to its IGI or GIA report (report number blurred). 1800×1200.",
  },
  homeShowroom: {
    src: null,
    alt: "The viewing table at the Keian Luxandor showroom in Baner, Pune",
    ratio: "3/2",
    brief: "Visit us section. The viewing desk in the Baner showroom: loupe, tray, daylight lamp. 1800×1200.",
  },
  homeDelivery: {
    src: null,
    alt: "A sealed Keian Luxandor diamond box ready for insured delivery",
    ratio: "3/2",
    brief: "Delivery section. The branded box/packet, sealed, with the report folder. 1800×1200.",
  },
  aboutHero: {
    src: null,
    alt: "A Keian Luxandor gemmologist inspecting a diamond with a loupe",
    ratio: "21/9",
    brief: "About page banner. Hands inspecting a stone with a loupe at the bench. 2400×1030.",
  },
  aboutTeam: {
    src: null,
    alt: "The Keian Luxandor team at the Baner showroom",
    ratio: "3/2",
    brief: "About page. Natural team photo (2–5 people) in the showroom. 1800×1200.",
  },
  contactShowroom: {
    src: null,
    alt: "Entrance of the Keian Luxandor showroom in Baner, Pune",
    ratio: "4/3",
    brief: "Contact page. The showroom entrance or building, so visitors recognise it. 1600×1200.",
  },
  authSide: {
    src: null,
    alt: "Close-up of diamond facets",
    ratio: "4/5",
    brief: "Log in / create account side panel. Macro of facets, calm and dark. 1200×1500.",
  },
  educationHero: {
    src: null,
    alt: "Several loose diamonds of different shapes on a tray",
    ratio: "21/9",
    brief: "Learn hub banner. 6–10 shapes laid out on a tray. 2400×1030.",
  },
  educationNaturalVsLab: {
    src: null,
    alt: "A natural diamond and a lab-grown diamond side by side",
    ratio: "3/2",
    brief: "Natural vs lab-grown guide. Two similar stones side by side, labelled cards under each. 1800×1200.",
  },
  educationCertificate: {
    src: null,
    alt: "A diamond grading report with its key sections visible",
    ratio: "4/3",
    brief: "Reading a certificate guide. A full report flat-lay, report number blurred. 1600×1200.",
  },
  ogDefault: {
    src: null,
    alt: "Keian Luxandor — certified diamonds",
    ratio: "16/9",
    brief: "Link preview when the site is shared on WhatsApp/social. 1200×630 with the logo.",
  },
} satisfies Record<string, PhotoSlot>;

export type PhotoKey = keyof typeof photos;
