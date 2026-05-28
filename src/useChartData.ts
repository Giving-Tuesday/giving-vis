import { useQuery } from '@tanstack/react-query';
import { loadParquet, query } from './duckdb';

export type DataPoint = {
  date: Date;
  value: number;
};

type Filters = {
  subgroup: string;
};

export function useChartData(filters: Filters) {
  return useQuery({
    queryKey: ['chart-data', filters],
    queryFn: async (): Promise<DataPoint[]> => {
      await loadParquet('/data_clean.parquet', 'my_data');

      const rows = await query<{
        collection_week: string | Date;
        rolling_mean: number;
      }>(
        `SELECT collection_week, rolling_mean 
         FROM my_data 
         WHERE subgroups = '${filters.subgroup.replace(/'/g, "''")}'
         ORDER BY collection_week`,
      );

      return rows.map((r) => ({
        date: new Date(r.collection_week),
        value: Number(r.rolling_mean),
      }));
    },
  });
}
