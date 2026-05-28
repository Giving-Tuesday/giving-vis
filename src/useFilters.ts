import { useSearchParams } from 'react-router-dom';

export type Filters = {
  subgroup: string;
};

const DEFAULT_SUBGROUP = '18 to 24';

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: Filters = {
    subgroup: searchParams.get('subgroup') ?? DEFAULT_SUBGROUP,
  };

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setSearchParams(
      (prev) => {
        prev.set(key, value);
        return prev;
      },
      { replace: false }
    );
  };

  return { filters, setFilter };
}