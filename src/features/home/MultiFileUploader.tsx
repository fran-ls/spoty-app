import React, { useState, useRef, useCallback, type ChangeEvent } from "react";

type FileKind = "image" | "audio" | "video";

interface SlotConfig {
  kind: FileKind;
  label: string;
  accept: string;
}

interface SlotState {
  file: File | null;
  previewUrl: string | null;
  error: string | null;
}

const SLOTS: SlotConfig[] = [
  { kind: "image", label: "Imagen", accept: "image/*" },
  { kind: "audio", label: "Audio", accept: "audio/*" },
  { kind: "video", label: "Video", accept: "video/*" },
];

const MAX_SIZE_MB = 50;

function createEmptyState(): SlotState {
  return { file: null, previewUrl: null, error: null }
}

interface FileSlotProps {
  config: SlotConfig;
  state: SlotState;
  onSelect: (kind: FileKind, file: File | null) => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

const FileSlot: React.FC<FileSlotProps> = ({ config, state, onSelect }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const validateAndSet = useCallback(
    (file: File | null) => {
      if (!file) {
        onSelect(config.kind, null);
        return;
      }

      const mainType = config.kind === "image" ? "image" : config.kind;

      if (!file.type.startsWith(mainType)) {
        onSelect(config.kind, null);
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        onSelect(config.kind, null);
        return;
      }
      onSelect(config.kind, file);
    },
    [config.kind, onSelect]
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    validateAndSet(file);
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files && e.dataTransfer.files.length > 0 ? e.dataTransfer.files[0] : null;
    validateAndSet(file);
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }

  const handleRemove = () => {
    if (inputRef.current) inputRef.current.value = "";
    onSelect(config.kind, null);
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">{config.label}</h3>
        {state.file && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs font-medium text-red-500 hover:text-red-600"
          >
            Quitar
          </button>
        )}
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center transition-colors ${isDragging
          ? "border-blue-400 bg-blue-50"
          : "border-gray-300 hover:border-gray-400"
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={config.accept}
          onChange={handleInputChange}
          className="hidden"
        />
        {!state.file && (
          <p className="text-sm text-gray-500">
            Arrastra un archivo aquí o{" "}
            <span className="font-medium text-blue-600">selecciónalo</span>
          </p>
        )}

        {state.file && state.previewUrl && config.kind === "image" && (
          <img
            src={state.previewUrl}
            alt={state.file.name}
            className="max-h-48 w-full rounded-md object-contain"
          />
        )}

        {state.file && state.previewUrl && config.kind === "audio" && (
          <audio
            controls
            src={state.previewUrl}
            className="w-full"
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {state.file && state.previewUrl && config.kind === "video" && (
          <video
            controls
            src={state.previewUrl}
            className="max-h-48 w-full rounded-md"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>

      {state.file && (
        <p className="truncate text-xs text-gray-500">
          {state.file.name} · {formatBytes(state.file.size)}
        </p>
      )}

      {state.error && (
        <p className="text-xs font-medium text-red-500">{state.error}</p>
      )}
    </div>
  )
}

export interface MultiFileUploaderProps {
  onChange?: (files: { image: File | null; audio: File | null; video: File | null }) => void;
}

const MultiFileUploader: React.FC<MultiFileUploaderProps> = ({ onChange }) => {
  const [states, setStates] = useState<Record<FileKind, SlotState>>({
    image: createEmptyState(),
    audio: createEmptyState(),
    video: createEmptyState(),
  });

  const handleSelect = useCallback(
    (kind: FileKind, file: File | null) => {
      setStates((prev) => {
        if (prev[kind].previewUrl) {
          URL.revokeObjectURL(prev[kind].previewUrl as string);
        }
        const next: Record<FileKind, SlotState> = {
          ...prev,
          [kind]: {
            file,
            previewUrl: file ? URL.createObjectURL(file) : null,
            error: file ? null : prev[kind].error,
          },
        }

        if (onChange) {
          onChange({
            image: next.image.file,
            audio: next.audio.file,
            video: next.video.file,
          });
        }

        return next;
      });
    },
    [onChange]
  );

  return (
    <div className="mx-auto grid w-full max-w--4xl grid-cols-1 gap-4 p-4 sm:grid-cols-3">
      {SLOTS.map((slot) => (
        <FileSlot
          key={slot.kind}
          config={slot}
          state={states[slot.kind]}
          onSelect={handleSelect}
        />
      ))}
    </div>
  )
}

export default MultiFileUploader;