
import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "../utils/tailwindCn";

type LoaderProps = HTMLAttributes<HTMLDivElement> & {
  width?: string | number;
  height?: string | number;
  size?: string | number;
  stroke?: string | number;
}

const Loader = forwardRef<HTMLDivElement, LoaderProps>((props, ref) => {
  const { className, style = {}, width, height, size = 48, stroke = 4, ...rest } = props;

  return (
    <div
      {...rest}
      ref={ref}
      style={{
        width: width ?? size,
        height: height ?? size,
        borderWidth: stroke,
        ...style
      }}
      className={cn('w-12 h-12 border-4 border-[#72fe8e53] border-t-[#72FE8F] rounded-full animate-spin', className)}
    />
  )
})

export default Loader;