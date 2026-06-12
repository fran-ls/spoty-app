
import type { CSSProperties } from "react";
import { cn } from "../utils/tailwindCn";

interface LoaderProps {
  className?: string;
  style?: CSSProperties;
  width?: string | number;
  height?: string | number;
  size?: string | number;
  stroke?: string | number;
}

const Loader = (props: LoaderProps) => {
  const { className, style = {}, width, height, size = 48, stroke = 4 } = props;

  return (
    <div
      style={{
        width: width ?? size,
        height: height ?? size,
        borderWidth: stroke,
        ...style
      }}
      className={cn('w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin', className)}
    />
  )
}

export default Loader;