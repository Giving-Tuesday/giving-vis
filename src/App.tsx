import { useChartData } from './useChartData';
import { LineChart } from './LineChart';
import { useSubgroupOptions } from './useSubgroupOptions';
import { useFilters } from './useFilters';

function App() {
  const { filters, setFilter } = useFilters();
  const { data: options, isLoading: optionsLoading } = useSubgroupOptions();
  const {
    data: chartData,
    isLoading: chartLoading,
    error,
  } = useChartData(filters);

  if (optionsLoading)
    return <div style={{ padding: 20 }}>Loading filters...</div>;
  if (error)
    return (
      <div style={{ padding: 20, color: 'red' }}>Error: {error.message}</div>
    );

  return (
    <div style={{ padding: 20 }}>
      <h1>Civic Intent</h1>
      <div style={{ marginBottom: 20 }}>
        {options?.map((opt) => (
          <button
            key={opt}
            onClick={() => setFilter('subgroup', opt)}
            style={{
              marginRight: 8,
              padding: '6px 12px',
              background: filters.subgroup === opt ? '#3b82f6' : '#e5e7eb',
              color: filters.subgroup === opt ? 'white' : 'black',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
      <div style={{ width: '100%', height: 400 }}>
        {chartLoading ? (
          <div>Loading chart...</div>
        ) : (
          chartData && <LineChart data={chartData} />
        )}
      </div>
    </div>
  );
}

export default App;
