import React from 'react';
import { TooltipProps } from 'recharts';
import { format, parseISO } from 'date-fns';

const CustomTooltip: React.FC<TooltipProps<any, any>> = ({ payload, label }) => {
  if (payload && payload.length) {
    const { dateRep, cases, deaths } = payload[0].payload;
    const date = parseISO(dateRep);

    return (
      <div className="custom-tooltip">
        <p>{format(date, 'MMMM dd, yyyy')}</p> 
        <p>Cases: {cases}</p>
        <p>Deaths: {deaths}</p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
