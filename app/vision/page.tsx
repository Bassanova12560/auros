import { permanentRedirect } from "next/navigation";

/** Alias for institutional bookmarks — vision + roadmap live on Resource Layer. */
export default function VisionPage() {
  permanentRedirect("/resource-layer#roadmap");
}
