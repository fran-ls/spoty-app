import type { SearchFilter } from "./SearchHeader";

interface ResultsContainerProps {
  ungrid?: boolean;
  filter: SearchFilter;
  children: React.ReactNode;
}

const ResultsContainer = ({ ungrid, filter, children }: ResultsContainerProps) => {
  const grid = {
    base: 'grid-cols-2',
    min500: 'min-[500px]:grid-cols-[repeat(auto-fit,minmax(160px,1fr))]',
    md: 'md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]'
  }

  return ungrid ? children : (
    <div className={`${filter !== 'all' ? `${grid.md} ${grid.min500} ${grid.base} grid` : ''} mt-8`}>
      {children}
    </div>
  )
}

export default ResultsContainer;