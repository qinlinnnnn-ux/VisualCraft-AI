import { useMemo } from "react";
import KineticVideoCommerce, { Segment } from "./KineticVideoCommerce";
import "./commerce-orbit.css";

const productName = "Veyra Court Runner";

const orbitMetadata: Segment[] = [
  {
    timestamp: 0,
    title: "Side Profile",
    feature: "The first 18 frames show the full sneaker side profile, toe shape, and clean upper.",
    price: "$210",
    buyLabel: "Shop The Pair",
    gradientClass: "segment-shoes-1",
    accentClass: "accent-rose"
  },
  {
    timestamp: 2.5,
    title: "Lace System",
    feature: "Frames 19-36 rotate toward the lace bed, padded tongue, and soft collar geometry.",
    price: "$245",
    buyLabel: "Buy Comfort Fit",
    gradientClass: "segment-shoes-2",
    accentClass: "accent-sky"
  },
  {
    timestamp: 5,
    title: "Sole Geometry",
    feature: "Frames 37-54 expose the midsole volume, outsole curve, and AO-filled contact shadow.",
    price: "$275",
    buyLabel: "Add Grip Sole",
    gradientClass: "segment-shoes-3",
    accentClass: "accent-lime"
  },
  {
    timestamp: 7.5,
    title: "Runway Color",
    feature: "Frames 55-72 complete the turntable with the seasonal accent stripe and heel structure.",
    price: "$310",
    buyLabel: "Buy Runway Color",
    gradientClass: "segment-shoes-4",
    accentClass: "accent-violet"
  }
];

export default function CommerceOrbitDemo() {
  const frameUrls = useMemo(
    () =>
      Array.from(
        { length: 72 },
        (_, index) => `${import.meta.env.BASE_URL}real-products/veyra-runner/frame_${String(index).padStart(3, "0")}.jpg`
      ),
    []
  );

  function handleBuyNow() {
    console.log(`Footer Buy Now clicked for ${productName}`);
  }

  return (
    <main className="commerce-page-shell">
      <header className="commerce-site-header" aria-label="Product header">
        <a className="commerce-brand-lockup" href={import.meta.env.BASE_URL} aria-label="ViralCraft Commerce home">
          <span className="commerce-brand-mark">V</span>
          <span>ViralCraft Commerce</span>
        </a>

        <nav className="commerce-category-nav" aria-label="Orbit status">
          <a className="commerce-back-link" href={import.meta.env.BASE_URL}>
            ViralCraft
          </a>
          <span className="commerce-orbit-pill">72 generated views</span>
          <span className="commerce-orbit-pill muted">Sneaker orbit</span>
        </nav>
      </header>

      <KineticVideoCommerce
        categoryKey="veyra-72-frame-orbit"
        productName={productName}
        frameUrls={frameUrls}
        metadata={orbitMetadata}
        onBuy={(segment) => console.log(`Panel buy clicked for ${productName}: ${segment.buyLabel}`)}
      />

      <footer className="commerce-site-footer" aria-label="Checkout footer">
        <span>{productName} / 72-frame sneaker orbit</span>
        <button type="button" onClick={handleBuyNow}>
          Buy Now
        </button>
      </footer>
    </main>
  );
}

export { orbitMetadata };


