import { Link } from "react-router-dom";

interface SliderSkeletonsProps {
  title?: string;
  redirectTo?: string;
  items?: number;
}

const SliderSkeletons = ({ title, redirectTo, items = 10 }: SliderSkeletonsProps) => {
  return (
    <section className="mb-12 overflow-hidden">
      {title && (
        <div className="px-8 flex justify-between items-end mb-3">
          {redirectTo ? (
            <Link
              className="text-white hover:underline cursor-pointer"
              to={redirectTo}
            >
              <h2 className="text-2xl font-bold font-headline tracking-tight">
                {title}
              </h2>
            </Link>
          ) : (
            <h2 className="text-2xl font-bold font-headline text-white tracking-tight">
              {title}
            </h2>
          )}
        </div>
      )}

      <div className="md:px-8 p-4 flex gap-4">
        {Array.from({ length: items }).map((i) => (
          <div
            key={`made-for-you-${i}`}
            className="min-w-40 grow rounded-xl flex flex-col h-full animate-pulse"
          >
            <div className="aspect-square rounded-md bg-white/10 mb-3" />
            <div className="h-4 bg-white/10 rounded-md w-4/5 mb-2.5" />
            <div className="h-3 bg-white/5 rounded-md w-3/5" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default SliderSkeletons;