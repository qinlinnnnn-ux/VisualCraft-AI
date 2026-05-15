import { PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Hand, RotateCcw, ShoppingBag, Sparkles } from "lucide-react";

export type Segment = {
  timestamp: number;
  title: string;
  feature: string;
  price: string;
  buyLabel: string;
  gradientClass: string;
  accentClass: string;
};

const defaultMetadata: Segment[] = [
  {
    timestamp: 0,
    title: "Signature Reveal",
    feature: "Swipe through the opening silhouette and inspect the satin recycled-shell finish.",
    price: "$149",
    buyLabel: "Reserve Drop",
    gradientClass: "segment-signature",
    accentClass: "accent-rose"
  },
  {
    timestamp: 2.5,
    title: "Magnetic Fit",
    feature: "Hidden clasp geometry appears as the video reaches the side profile.",
    price: "$179",
    buyLabel: "Buy Magnetic Fit",
    gradientClass: "segment-magnetic",
    accentClass: "accent-emerald"
  },
  {
    timestamp: 5,
    title: "Travel Mode",
    feature: "Compact fold angle, scratch-safe lining, and one-hand packability.",
    price: "$199",
    buyLabel: "Add Travel Kit",
    gradientClass: "segment-travel",
    accentClass: "accent-sky"
  },
  {
    timestamp: 7.5,
    title: "Limited Finish",
    feature: "Final hero frame unlocks the launch color and bundled accessory.",
    price: "$229",
    buyLabel: "Buy Limited Finish",
    gradientClass: "segment-limited",
    accentClass: "accent-amber"
  }
];

type KineticVideoCommerceProps = {
  productName: string;
  metadata?: Segment[];
  categoryKey?: string;
  frameUrls?: string[];
  posterSrc?: string;
  videoSrc?: string;
  onBuy?: (segment: Segment) => void;
};

export default function KineticVideoCommerce({
  productName,
  metadata = defaultMetadata,
  categoryKey = productName,
  frameUrls = [],
  posterSrc,
  videoSrc,
  onBuy
}: KineticVideoCommerceProps) {
  const rafRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const targetFrameRef = useRef(0);
  const smoothFrameRef = useRef(0);

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasFrameError, setHasFrameError] = useState(false);

  const frameCount = frameUrls.length || 1;
  const virtualDuration = metadata[metadata.length - 1]?.timestamp + 2.5 || 10;
  const currentTime = frameCount > 1 ? (currentFrame / (frameCount - 1)) * virtualDuration : 0;
  const activeFrameUrl = frameUrls[currentFrame] || posterSrc || videoSrc || "";

  const activeSegment = useMemo(
    () => metadata.reduce((active, segment) => (currentTime >= segment.timestamp ? segment : active), metadata[0]),
    [currentTime, metadata]
  );
  const activeSegmentIndex = Math.max(0, metadata.findIndex((segment) => segment.timestamp === activeSegment.timestamp));
  const progress = frameCount > 1 ? Math.min(100, Math.max(0, (currentFrame / (frameCount - 1)) * 100)) : 0;

  function syncTargetFromPointer(clientX: number) {
    const viewportWidth = Math.max(window.innerWidth, 1);
    const normalizedX = Math.min(1, Math.max(0, clientX / viewportWidth));

    /*
      Frame-to-gesture mapping:
      clientX is normalized against the full viewport. 0 is the left edge, 1 is
      the right edge. Multiplying by frameCount - 1 maps the whole drag distance
      to the complete 72-frame orbit, so frame 0 and frame 71 are reachable with
      pixel-precise intent.
    */
    targetFrameRef.current = normalizedX * (frameCount - 1);
  }

  function beginScrub(event: PointerEvent<HTMLDivElement>) {
    if (frameCount <= 1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    setIsDragging(true);
    setHasInteracted(true);
    syncTargetFromPointer(event.clientX);
  }

  function moveScrub(event: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current || frameCount <= 1) return;
    syncTargetFromPointer(event.clientX);
  }

  function endScrub() {
    draggingRef.current = false;
    setIsDragging(false);
  }

  useEffect(() => {
    function tick() {
      /*
        Smoothness layer:
        Pointer events arrive unevenly. requestAnimationFrame is synchronized to
        browser paint, and this lerp eases the displayed image sequence toward the
        latest target frame. With a 72-frame source set plus AO-style filled
        lighting/shadow frames, it reads as a continuous 3D turntable video.
      */
      const nextFrame = smoothFrameRef.current + (targetFrameRef.current - smoothFrameRef.current) * 0.24;
      smoothFrameRef.current =
        Math.abs(nextFrame - targetFrameRef.current) < 0.01 ? targetFrameRef.current : nextFrame;
      setCurrentFrame(Math.min(frameCount - 1, Math.max(0, Math.round(smoothFrameRef.current))));

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [frameCount]);

  useEffect(() => {
    targetFrameRef.current = 0;
    smoothFrameRef.current = 0;
    setCurrentFrame(0);
    setIsDragging(false);
    setHasInteracted(false);
    setHasFrameError(false);
  }, [categoryKey]);

  useEffect(() => {
    frameUrls.forEach((url) => {
      const image = new Image();
      image.src = url;
    });
  }, [frameUrls]);

  return (
    <section className={`kinetic-commerce ${activeSegment.gradientClass}`}>
      <div
        className="scrub-stage"
        onPointerDown={beginScrub}
        onPointerMove={moveScrub}
        onPointerUp={endScrub}
        onPointerCancel={endScrub}
        role="slider"
        aria-label="Scrub product rotation"
        aria-valuemin={0}
        aria-valuemax={frameCount - 1}
        aria-valuenow={currentFrame}
      >
        {frameUrls.length > 0 ? (
          hasFrameError ? (
            <div className="missing-frame-state">
              <strong>需要真实商品 72 帧图片</strong>
              <p>
                请放入 <code>public/real-products/veyra-runner/frame_000.jpg</code> 到{" "}
                <code>frame_071.jpg</code>。当前页面不会再用程序绘制的假商品图替代真实商品。
              </p>
            </div>
          ) : (
            <motion.img
              className="product-video product-frame"
              src={activeFrameUrl}
              alt={`${productName} rotating view ${currentFrame + 1} of ${frameCount}`}
              draggable={false}
              animate={{ scale: isDragging ? 1.018 : 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              onError={() => setHasFrameError(true)}
            />
          )
        ) : (
          <motion.video
            className="product-video"
            src={videoSrc}
            poster={posterSrc}
            preload="metadata"
            muted
            playsInline
            controls={false}
            autoPlay={false}
            animate={{ scale: isDragging ? 1.018 : 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
          />
        )}

        <div className="video-vignette" />

        <motion.div
          className="angle-badge"
          key={`${categoryKey}-${activeSegment.timestamp}-badge`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24 }}
          aria-live="polite"
        >
          <span>
            View 0{activeSegmentIndex + 1} / Frame {String(currentFrame + 1).padStart(2, "0")}
          </span>
          <strong>{activeSegment.title}</strong>
        </motion.div>

        <AnimatePresence>
          {!hasInteracted && (
            <motion.div className="hand-hint-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div
                className="hand-hint"
                animate={{ x: [-34, 34, -34] }}
                transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
              >
                <Hand size={20} />
                <span>Swipe to rotate 72 frames</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="commerce-panel"
          key={`${categoryKey}-${activeSegment.timestamp}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="panel-kicker">
            <Sparkles size={16} />
            72-frame commerce orbit
          </div>
          <h1>{productName}</h1>
          <div className="price-row">
            <span>{activeSegment.title}</span>
            <strong>{activeSegment.price}</strong>
          </div>
          <p className="feature-tooltip">{activeSegment.feature}</p>
          <div className="segment-list">
            {metadata.map((segment) => (
              <button
                className={activeSegment.timestamp === segment.timestamp ? "segment-button active" : "segment-button"}
                key={segment.timestamp}
                onClick={() => {
                  setHasInteracted(true);
                  targetFrameRef.current = Math.min(
                    frameCount - 1,
                    Math.round((segment.timestamp / virtualDuration) * (frameCount - 1))
                  );
                }}
              >
                <span>{segment.title}</span>
                <small>{segment.timestamp.toFixed(1)}s</small>
              </button>
            ))}
          </div>
          <button
            className="commerce-buy"
            onClick={() => {
              onBuy?.(activeSegment);
              console.log(`Buying ${productName}: ${activeSegment.buyLabel}`);
            }}
          >
            <ShoppingBag size={18} />
            {activeSegment.buyLabel}
          </button>
        </motion.div>

        <div className="progress-shell" aria-hidden="true">
          <motion.div className={`progress-bar ${activeSegment.accentClass}`} animate={{ width: `${progress}%` }} />
        </div>

        <button
          className="reset-scrub"
          onClick={() => {
            setHasInteracted(true);
            targetFrameRef.current = 0;
          }}
          aria-label="Restart product scrub"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </section>
  );
}

export { defaultMetadata };
