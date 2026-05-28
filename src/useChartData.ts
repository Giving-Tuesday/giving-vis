import { useEffect, useState } from 'react';
import { loadParquet, query } from './duckdb';

export type DataPoint = {
  date: Date;
  value: number;
};

export function useChartData() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await loadParquet('/data_clean.parquet', 'my_data');

        // ⚠️ Change these column names to match your parquet file
        const rows = await query<{
          collection_week: string | Date;
          rolling_mean: number;
        }>(
          `SELECT collection_week, rolling_mean FROM my_data WHERE subgroups='18 to 24' ORDER BY collection_week`,
        );

        if (cancelled) return;

        const parsed: DataPoint[] = rows.map((r) => ({
          date:
            r.collection_week instanceof Date
              ? r.collection_week
              : new Date(r.collection_week),
          value: Number(r.rolling_mean),
        }));

        setData(parsed);
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);
  return { data, loading, error };
}
