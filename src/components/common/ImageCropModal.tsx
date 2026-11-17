"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

type ImageCropModalProps = {
  open: boolean;
  imageSrc: string;
  onCancel: () => void;
  onSave: (croppedImage: string) => void;
};

type CropHandle = "move" | "nw" | "ne" | "sw" | "se";

const STAGE_SIZE = 280;
const MIN_CROP_SIZE = 90;

export default function ImageCropModal({ open, imageSrc, onCancel, onSave }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 40, y: 40, size: 200 });
  const imageRef = useRef<HTMLImageElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, handle: "move" as CropHandle, x: 0, y: 0, crop: { x: 40, y: 40, size: 200 } });

  useEffect(() => {
    if (open) setCrop({ x: 40, y: 40, size: 200 });
  }, [open, imageSrc]);

  if (!open) return null;

  function startCropDrag(event: ReactPointerEvent<HTMLElement>, handle: CropHandle) {
    event.stopPropagation();
    stageRef.current?.setPointerCapture(event.pointerId);
    dragRef.current = { active: true, handle, x: event.clientX, y: event.clientY, crop };
  }

  function updateCrop(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active) return;
    const { handle, x: startX, y: startY, crop: startCrop } = dragRef.current;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    if (handle === "move") {
      setCrop({
        ...startCrop,
        x: Math.max(0, Math.min(STAGE_SIZE - startCrop.size, startCrop.x + dx)),
        y: Math.max(0, Math.min(STAGE_SIZE - startCrop.size, startCrop.y + dy)),
      });
      return;
    }

    const delta = handle === "nw" || handle === "se" ? (Math.abs(dx) > Math.abs(dy) ? dx : dy) : (Math.abs(dx) > Math.abs(dy) ? -dx : -dy);
    const nextSize = Math.max(MIN_CROP_SIZE, Math.min(STAGE_SIZE, startCrop.size + (handle === "nw" || handle === "ne" ? -delta : delta)));
    const nextX = handle === "nw" || handle === "sw" ? startCrop.x + startCrop.size - nextSize : startCrop.x;
    const nextY = handle === "nw" || handle === "ne" ? startCrop.y + startCrop.size - nextSize : startCrop.y;
    if (nextX < 0 || nextY < 0 || nextX + nextSize > STAGE_SIZE || nextY + nextSize > STAGE_SIZE) return;
    setCrop({ x: nextX, y: nextY, size: nextSize });
  }

  function stopCropDrag() {
    dragRef.current.active = false;
  }

  function saveCrop() {
    const image = imageRef.current;
    if (!image || !image.naturalWidth || !image.naturalHeight) return;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    if (!context) return;

    const displayScale = Math.max(STAGE_SIZE / image.naturalWidth, STAGE_SIZE / image.naturalHeight);
    const displayedWidth = image.naturalWidth * displayScale;
    const displayedHeight = image.naturalHeight * displayScale;
    const offsetX = (STAGE_SIZE - displayedWidth) / 2;
    const offsetY = (STAGE_SIZE - displayedHeight) / 2;
    const sourceSize = crop.size / displayScale;
    const sourceX = Math.max(0, Math.min(image.naturalWidth - sourceSize, (crop.x - offsetX) / displayScale));
    const sourceY = Math.max(0, Math.min(image.naturalHeight - sourceSize, (crop.y - offsetY) / displayScale));

    context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, 512, 512);
    onSave(canvas.toDataURL("image/jpeg", 0.9));
  }

  const handleClass = "absolute size-4 rounded-[2px] border-2 border-white bg-white shadow-[0_1px_4px_#0008]";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#10251b99] px-5" role="presentation">
      <div className="w-full max-w-[360px] rounded-[18px] bg-white p-5 shadow-[0_18px_50px_rgba(16,37,27,.25)]" role="dialog" aria-modal="true" aria-labelledby="crop-title">
        <h2 className="m-0 text-center text-[18px] font-extrabold text-[#20342a]" id="crop-title">Crop profile photo</h2>
        <p className="m-0 mt-1 text-center text-[13px] text-[#68766e]">Box ke corners drag karke crop set karein.</p>
        <div ref={stageRef} className="relative mx-auto mt-5 size-[280px] touch-none overflow-hidden bg-[#202522]" onPointerMove={updateCrop} onPointerUp={stopCropDrag} onPointerCancel={stopCropDrag}>
          <img ref={imageRef} src={imageSrc} alt="Crop preview" className="absolute inset-0 size-full object-cover" />
          <div className="pointer-events-none absolute inset-x-0 top-0 bg-black/45" style={{ height: crop.y }} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/45" style={{ height: STAGE_SIZE - crop.y - crop.size }} />
          <div className="pointer-events-none absolute left-0 bg-black/45" style={{ top: crop.y, width: crop.x, height: crop.size }} />
          <div className="pointer-events-none absolute right-0 bg-black/45" style={{ top: crop.y, width: STAGE_SIZE - crop.x - crop.size, height: crop.size }} />
          <div className="absolute cursor-move border-2 border-white" style={{ left: crop.x, top: crop.y, width: crop.size, height: crop.size }} onPointerDown={(event) => startCropDrag(event, "move")}>
            <span className={handleClass + " -left-2 -top-2 cursor-nwse-resize"} onPointerDown={(event) => startCropDrag(event, "nw")} />
            <span className={handleClass + " -right-2 -top-2 cursor-nesw-resize"} onPointerDown={(event) => startCropDrag(event, "ne")} />
            <span className={handleClass + " -bottom-2 -left-2 cursor-nesw-resize"} onPointerDown={(event) => startCropDrag(event, "sw")} />
            <span className={handleClass + " -bottom-2 -right-2 cursor-nwse-resize"} onPointerDown={(event) => startCropDrag(event, "se")} />
          </div>
        </div>
        <div className="mt-3 text-center text-[12px] text-[#68766e]">Crop box ko move ya resize karein.</div>
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button className="min-h-11 rounded-[10px] border border-[#d7e2da] bg-white px-3 text-sm font-bold text-[#526158]" onClick={onCancel} type="button">Cancel</button>
          <button className="min-h-11 rounded-[10px] bg-[#08714f] px-3 text-sm font-bold text-white" onClick={saveCrop} type="button">Use photo</button>
        </div>
      </div>
    </div>
  );
}
