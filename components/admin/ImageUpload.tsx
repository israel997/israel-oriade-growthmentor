"use client";

import { useRef, useState } from "react";

type Props = {
  label?: string;
  value?: string; // base64 or URL
  onChange: (base64: string) => void;
  maxWidth?: number;  // px — resize before compression
  maxHeight?: number;
  quality?: number;   // 0–1
  aspectHint?: string; // ex: "1:1" | "16:9"
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(2)} Mo`;
}

function compressImage(file: File, maxWidth: number, maxHeight: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Scale down proportionally
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);

        // Prefer WebP, fall back to JPEG
        const supportsWebP = canvas.toDataURL("image/webp").startsWith("data:image/webp");
        const mime = supportsWebP ? "image/webp" : "image/jpeg";
        resolve(canvas.toDataURL(mime, quality));
      };
      img.onerror = reject;
      img.src = e.target!.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUpload({
  label = "Image",
  value,
  onChange,
  maxWidth = 800,
  maxHeight = 600,
  quality = 0.75,
  aspectHint,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [info, setInfo] = useState<{ original: number; compressed: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const process = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setLoading(true);
    const originalSize = file.size;
    try {
      const base64 = await compressImage(file, maxWidth, maxHeight, quality);
      // Estimate compressed size from base64 length
      const compressedSize = Math.round((base64.length * 3) / 4);
      setInfo({ original: originalSize, compressed: compressedSize });
      onChange(base64);
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) process(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) process(file);
  };

  return (
    <div>
      <label className="block text-xs font-semibold mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
        {label}{aspectHint && <span className="ml-1.5 font-normal" style={{ color: "rgba(255,255,255,0.35)" }}>— ratio conseillé {aspectHint}</span>}
      </label>

      <div className="flex gap-4 items-start">
        {/* Preview */}
        <div
          className="shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
          style={{
            width: 80,
            height: 80,
            background: value ? "transparent" : "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="preview" className="h-full w-full object-cover" />
          ) : (
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "rgba(255,255,255,0.2)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          )}
        </div>

        {/* Drop zone */}
        <div
          className="flex-1 rounded-xl flex flex-col items-center justify-center gap-2 py-5 cursor-pointer transition-all"
          style={{
            background: dragging ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.03)",
            border: `1px dashed ${dragging ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.15)"}`,
          }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          {loading ? (
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Compression…</span>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: "rgba(255,255,255,0.3)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.4)" }}>
                Glisse une image ou <span style={{ color: "#60A5FA" }}>clique</span>
              </p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                JPG, PNG, WebP — max {maxWidth}×{maxHeight}px · qualité {Math.round(quality * 100)}%
              </p>
            </>
          )}
        </div>
      </div>

      {/* Compression stats */}
      {info && (
        <div className="mt-2 flex items-center gap-2 text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          <span>Original : {formatBytes(info.original)}</span>
          <span>→</span>
          <span style={{ color: "#34D399" }}>Compressé : {formatBytes(info.compressed)}</span>
          <span style={{ color: "#34D399" }}>(-{Math.round((1 - info.compressed / info.original) * 100)}%)</span>
        </div>
      )}

      {/* Clear button */}
      {value && !loading && (
        <button
          type="button"
          onClick={() => { onChange(""); setInfo(null); }}
          className="mt-2 text-[10px] transition-colors"
          style={{ color: "rgba(239,68,68,0.6)" }}
        >
          Supprimer l&apos;image
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
    </div>
  );
}
