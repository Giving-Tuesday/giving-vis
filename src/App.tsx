import { useChartData } from './useChartData';
import { LineChart } from './LineChart';

function App() {
  const { data, loading, error } = useChartData();

  if (loading) return <div style={{ padding: 20 }}>Loading data...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>My Viz</h1>
      <div style={{ width: '100%', height: 400 }}>
        <LineChart data={data} />
      </div>
    </div>
  );
}

export default App;