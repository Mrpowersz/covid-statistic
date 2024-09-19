import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import CustomTooltip from './CustomTooltip'; 

interface ChartComponentProps {
  data: {
    dateRep: string; 
    cases: number;
    deaths: number;
  }[];
}

const processData = (data: ChartComponentProps['data']) => {
  return data.flatMap(item => {
    const dates = item.dateRep.split('Z').filter(dateStr => dateStr.trim() !== '');
    return dates.map(dateStr => ({
      dateRep: new Date(dateStr + 'Z').toISOString(),
      cases: item.cases,
      deaths: item.deaths
    }));
  });
};

const getUniqueYears = (data: { dateRep: string }[]) => {
  const years = data.map(item => new Date(item.dateRep).getFullYear());
  return Array.from(new Set(years)).sort((a, b) => a - b);
};

const ChartComponent: React.FC<ChartComponentProps> = ({ data }) => {
 
  const processedData = processData(data);
  const uniqueYears = getUniqueYears(processedData);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 'Invalid Date' : format(date, 'yyyy'); 
  };

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart
        data={processedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="dateRep" 
          tickFormatter={formatDate} 
          ticks={uniqueYears.map(year => new Date(`${year}-01-01`).toISOString())} 
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="cases" stroke="#8884d8" strokeWidth={2} />
        <Line type="monotone" dataKey="deaths" stroke="#ff7300" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartComponent;

