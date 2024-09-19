import React, { useEffect, useState } from 'react';
import { fetchCovidData } from './api';
import { CircularProgress, Box, Pagination, Button } from '@mui/material';
import TableComponent from './components/TableComponent';
import FilterComponent from './components/FilterComponent';
import ChartComponent from './components/ChartComponent';
import { CovidData } from './models/models';
import { cleanCountryName } from './utlis/stringUtils';
import { Alert } from '@mui/material';

const App = () => {
  const [covidData, setCovidData] = useState<CovidData[]>([]);
  const [filteredData, setFilteredData] = useState<CovidData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<keyof CovidData>('countriesAndTerritories');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [isInitial, setIsInitial] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  useEffect(() => {
    const getData = async () => {
      const covidData: CovidData[] = await fetchCovidData();

      const processedData = covidData.map((item: CovidData) => {
        const [day, month, year] = item.dateRep.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        return {
          ...item,
          dateRep: date.toISOString(),
          casesPer1000: (item.cases / item.popData2019) * 1000,
          deathsPer1000: (item.deaths / item.popData2019) * 1000,
        };
      });

      const { data: initialAggregatedData} = processData(processedData);
      
      setCovidData(processedData);
      setFilteredData(initialAggregatedData);

      const countries = Array.from(new Set(processedData.map(item => item.countriesAndTerritories)));
      setAvailableCountries(countries.map(cleanCountryName));
      setLoading(false);
    };
    

    getData();
  }, []);

  interface TotalData {
    cases: number;
    deaths: number
  }

  const processData = (data: CovidData[]) => {
    const aggregatedData: { [key: string]: CovidData } = {};
    let totalDict: {[country: string]: TotalData} = {}
    var originalData: CovidData[]
    if (isInitial){
      originalData = data
    }else{
      originalData = covidData
    }
    originalData.forEach(item => {
      const country = item.countriesAndTerritories;
      if (country in totalDict){
        totalDict[country].cases += item.cases
        totalDict[country].deaths += item.deaths
      }else{
        totalDict[country] = {cases: item.cases, deaths:item.deaths}
      }
      
    });

    data.forEach(item => {
      const country = item.countriesAndTerritories;

      if (!aggregatedData[country]) {
        aggregatedData[country] = {
          countriesAndTerritories: country,
          cases: 0,
          deaths: 0,
          casesPer1000: 0,
          deathsPer1000: 0,
          popData2019: item.popData2019,
          dateRep: '',
          totalCases: 0,
          totalDeaths: 0
        };
      }

      const existingEntry = aggregatedData[country];
      existingEntry.cases += item.cases;
      existingEntry.deaths += item.deaths;
      existingEntry.totalDeaths = totalDict[country]?.deaths
      existingEntry.totalCases = totalDict[country]?.cases
      existingEntry.dateRep += item.dateRep

      const population = existingEntry.popData2019;
      existingEntry.casesPer1000 = population > 0 ? (existingEntry.cases / population) * 1000 : 0;
      existingEntry.deathsPer1000 = population > 0 ? (existingEntry.deaths / population) * 1000 : 0;
    });

    const result = Object.values(aggregatedData);
    setIsInitial(false)
    return {
      data: result
    };
  };

  const handleFilter = (country: string, dateRange: [Date | null, Date | null]) => {
    setSelectedCountry(country);
    setDateRange(dateRange);

    if (dateRange[0] && !dateRange[1]) {
      setErrorMessage('Please select end date');
      return;
    } else if (!dateRange[0] && dateRange[1]) {
      setErrorMessage('Please select start date');
      return;
    } else {
      setErrorMessage(null);
    }

    let filtered = covidData;
    if (country && country !== 'All Countries') {
      filtered = filtered.filter((item) =>
        cleanCountryName(item.countriesAndTerritories).toLowerCase().includes(country.toLowerCase())
      );
    }

    if (dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0];
      const endDate = dateRange[1];
      filtered = filtered.filter((item) => {
        const date = new Date(item.dateRep);
        return date >= startDate && date <= endDate;
      });
    } else if (dateRange[0]) {
      const startDate = dateRange[0];
      filtered = filtered.filter((item) => {
        const date = new Date(item.dateRep);
        return date >= startDate;
      });
    } else if (dateRange[1]) {
      const endDate = dateRange[1];
      filtered = filtered.filter((item) => {
        const date = new Date(item.dateRep);
        return date <= endDate;
      });
    }

    if (filtered.length === 0) {
      console.log('No data available for the selected filters');
    }

    const { data: aggregatedData } = processData(filtered);
    setFilteredData(aggregatedData);
    setCurrentPage(1);
  };  

  const handleClearFilters = () => {
    setSelectedCountry(null);
    setDateRange([null, null]);
    const { data: aggregatedData} = processData(covidData);
    setFilteredData(aggregatedData);
    setCurrentPage(1);
  }; 

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleSortChange = (property: keyof CovidData) => {
    const isAscending = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAscending ? 'desc' : 'asc');
    setSortBy(property);
  };

  const sortedFilteredData = [...filteredData].sort((a, b) => {
    if (sortBy) {
      const aValue = a[sortBy] as number | string | undefined;
      const bValue = b[sortBy] as number | string | undefined;

      if (aValue == null || bValue == null) {
        return 0;
      }

      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = sortedFilteredData.slice(startIndex, endIndex);

  const handleTitleClick = () => {
    window.location.reload();
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box p={2} display="flex" flexDirection="column" alignItems="center">
      <h1 onClick={handleTitleClick} style={{ cursor: 'pointer' }}>COVID-19 Statistics</h1>
  
      {/* Filter Component, horizontally aligned */}
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" maxWidth="1200px" mb={2}>
        <FilterComponent
          onFilter={handleFilter}
          onClear={handleClearFilters}
          availableCountries={availableCountries}
        />
  
        {/* Switch View Button */}
        <Button
          variant="contained"
          color="success"
          onClick={() => setViewMode(viewMode === 'table' ? 'chart' : 'table')}
          sx={{ height: 'fit-content', mb: -3, textTransform: 'none'  }}
        >
          {viewMode === 'table' ? 'Switch to Chart View' : 'Switch to Table View'}
        </Button>
      </Box>

      {/* Error Message Display */}
      {errorMessage && (
        <Alert variant="filled" severity="error" sx={{ mb: 2 }}>
        {errorMessage}
        </Alert>
      )}
  
      {/* Main Content - Table or Chart */}
      <Box width="100%" maxWidth="1200px">
        {viewMode === 'table' ? (
          <>
            {/* Table */}
            <TableComponent
              data={paginatedData}
              sortOrder={sortOrder}
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />
  
            {/* Pagination, centered */}
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                shape="rounded"
                count={Math.ceil(filteredData.length / rowsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                
              />
            </Box>
          </>
        ) : (
          <ChartComponent data={filteredData} />
        )}
      </Box>
    </Box>
  );
};

export default App;
