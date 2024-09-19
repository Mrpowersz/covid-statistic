import React, { useState } from 'react';
import { TextField, Button, Box, Autocomplete } from '@mui/material';
import { DatePicker, Space } from 'antd';
import moment, { Moment } from 'moment';
import 'antd/dist/reset.css'; 

interface FilterProps {
  onFilter: (country: string, dateRange: [Date | null, Date | null]) => void;
  onClear: () => void;
  availableCountries: string[]; 
}

const FilterComponent: React.FC<FilterProps> = ({ onFilter, onClear, availableCountries }) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [dates, setDates] = useState<[Moment | null, Moment | null] | null>(null);

  const minStartDate = moment('2019-01-01');

  const handleDateChange = (value: [Moment | null, Moment | null] | null) => {
    setDates(value);
  };

  const startDate = dates ? dates[0]?.toDate() : null;
  const endDate = dates ? dates[1]?.toDate() : null;

  const handleFilter = () => {
    onFilter(selectedCountry || '', [startDate ?? null, endDate ?? null]);
  };

  const handleClear = () => {
    setSelectedCountry(null);
    setDates(null);
    onClear();
  };

  const sortedCountries = ['All Countries', ...availableCountries].sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <Box 
      display="flex" 
      flexDirection={{ xs: 'column', sm: 'row' }} 
      flexWrap="wrap" 
      gap={2} 
      alignItems="center" 
      justifyContent="space-between"
      mb={3}
    >
      {/* Country selection with responsive width */}
      <Box flexGrow={1} minWidth={200} sx={{ marginTop: '-40px' }}>
        <Autocomplete
          options={sortedCountries}
          value={selectedCountry}
          onChange={(event: any, newValue: string | null) => setSelectedCountry(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Select Country" variant="outlined" size="small"  />
          )}
          freeSolo
          filterOptions={(options, { inputValue }) => {
            const filtered = options.filter(option =>
              option.toLowerCase().includes(inputValue.toLowerCase())
            );
            if (inputValue && !options.includes(inputValue)) {
              filtered.push(inputValue);
            }
            return filtered;
          }}
        />
      </Box>

      {/* Date Picker for Date Range with responsive width */}
      <Box display="flex" flexGrow={1} minWidth={250} gap={2}>
        <Space direction="vertical" size={12}>
          <DatePicker
            value={dates ? dates[0] : null}
            onChange={(date) => handleDateChange([date, dates ? dates[1] : null])}
            disabledDate={(current) => current && current < minStartDate}
            format="YYYY-MM-DD"
            placeholder="Start Date"
            style={{ width: '100%' }}
          />
          <DatePicker
            value={dates ? dates[1] : null}
            onChange={(date) => handleDateChange([dates ? dates[0] : null, date])}
            disabledDate={(current) => current && current < (dates ? dates[0] || minStartDate : minStartDate)}
            format="YYYY-MM-DD"
            placeholder="End Date"
            style={{ width: '100%' }}
          />
        </Space>
      </Box>

      {/* Filter and Clear buttons */}
      <Box display="flex" flexDirection="column" gap={1} mt={{ xs: 2, sm: 0 }} alignItems="flex-start" sx={{ ml: { sm: -13, xs: 0 } }}>
        <Button variant="contained" color="success" onClick={handleFilter}
        sx={{
          borderRadius: '4px',  
          padding: '8px 16px',  
          minWidth: '140px',    
          fontSize: '0.8rem',
          textTransform: 'none',
          width: { xs: '100%', sm: 'auto' }, 
        }}>
          Apply Filters
        </Button>
        <Button variant="contained" color="error" onClick={handleClear} sx={{
        borderRadius: '4px',  
        padding: '8px 16px',  
        minWidth: '140px',    
        fontSize: '0.8rem',
        textTransform: 'none',
        width: { xs: '100%', sm: 'auto' }, 
        
        }}>
          Clear Filters
        </Button>
      </Box>
    </Box>
  );
};

export default FilterComponent;
