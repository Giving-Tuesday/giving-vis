import { ResponsiveLine } from '@nivo/line';
import type { DataPoint } from './useChartData';

type Props = {
  data: DataPoint[];
};

export function LineChart({ data }: Props) {
  if (data.length === 0) return null;

  const series = [
    {
      id: 'rolling_mean',
      data: data.map((d) => ({
        x: d.date,
        y: d.value,
      })),
    },
  ];

  return (
    <ResponsiveLine
      data={series}
      margin={{ top: 30, right: 40, bottom: 60, left: 60 }}
      xScale={{
        type: 'time',
        format: 'native',
        precision: 'day',
      }}
      xFormat="time:%Y-%m-%d"
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: false,
      }}
      axisBottom={{
        format: '%b %d',
        tickValues: 'every 1 month',
        tickRotation: -45,
        legend: 'Date',
        legendOffset: 50,
        legendPosition: 'middle',
      }}
      axisLeft={{
        legend: 'Rolling mean',
        legendOffset: -50,
        legendPosition: 'middle',
      }}
      colors={['#3b82f6']}
      lineWidth={2}
      enablePoints={false}
      useMesh={true}
      enableGridX={false}
      animate={true}
      motionConfig="gentle"
    />
  );
}