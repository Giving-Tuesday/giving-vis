import { useQuery } from '@tanstack/react-query';
import { loadParquet, query } from './duckdb';

export function useSubgroupOptions() {
  return useQuery({
    queryKey: ['subgroup-options', 'Age'],
    queryFn: async (): Promise<string[]> => {
      await loadParquet('/data_clean.parquet', 'my_data');

      const rows = await query<{ subgroups: string }>(
        `SELECT DISTINCT subgroups 
 FROM my_data 
 WHERE comparisons = 'Age'
   AND subgroups IS NOT NULL
   AND subgroups != ''
 ORDER BY subgroups`,
      );

      return rows.map((r) => r.subgroups);
    },
  });
}
