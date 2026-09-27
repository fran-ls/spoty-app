import { Link } from "react-router-dom";

interface SliderSkeletonsProps {
  title?: string;
  redirectTo?: string;
  items?: number;
}

const SliderSkeletons = ({ title, redirectTo, items = 10 }: SliderSkeletonsProps) => {
  const sliderTitleHTML = (
    <h2 className="text-xl md:text-2xl font-bold font-headline text-white tracking-tight">
      {title}
    </h2>
  )

  return (
    <section className="md:mb-8 mb-5 overflow-hidden">
      {title && (
        <div className="md:px-8 px-4 flex justify-between items-end mb-3">
          {redirectTo ? (
            <Link
              className="text-white hover:underline cursor-pointer"
              to={redirectTo}
            >
              {sliderTitleHTML}
            </Link>
          ) : (
            sliderTitleHTML
          )}
        </div>
      )}

      <div className="md:px-5 px-2 flex">
        {Array.from({ length: items }).map((_, i) => (
          <div
            key={`quick-${i}`}
            className="md:min-w-50 min-w-42 grow max-w-50 md:p-3 p-2 rounded-lg flex flex-col h-full animate-pulse"
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