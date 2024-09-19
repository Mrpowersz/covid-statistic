import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CovidData } from '../models/models';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.grey[200],
  padding: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

interface TableComponentProps {
  data: CovidData[];
  sortOrder: 'asc' | 'desc';
  sortBy: keyof CovidData;
  onSortChange: (property: keyof CovidData) => void;
}

const TableComponent: React.FC<TableComponentProps> = ({ data, sortOrder, sortBy, onSortChange }) => {
  const handleRequestSort = (property: keyof CovidData) => {
    onSortChange(property);
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 1200, margin: 'auto', boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <TableSortLabel
                active={sortBy === 'countriesAndTerritories'}
                direction={sortBy === 'countriesAndTerritories' ? sortOrder : 'asc'}
                onClick={() => handleRequestSort('countriesAndTerritories')}
              >
                Country
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell>
              <TableSortLabel
                active={sortBy === 'cases'}
                direction={sortBy === 'cases' ? sortOrder : 'asc'}
                onClick={() => handleRequestSort('cases')}
              >
                Cases
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell>
              <TableSortLabel
                active={sortBy === 'deaths'}
                direction={sortBy === 'deaths' ? sortOrder : 'asc'}
                onClick={() => handleRequestSort('deaths')}
              >
                Deaths
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell>
              <TableSortLabel
                active={sortBy === 'casesPer1000'}
                direction={sortBy === 'casesPer1000' ? sortOrder : 'asc'}
                onClick={() => handleRequestSort('casesPer1000')}
              >
                Cases per 1000
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell>
              <TableSortLabel
                active={sortBy === 'deathsPer1000'}
                direction={sortBy === 'deathsPer1000' ? sortOrder : 'asc'}
                onClick={() => handleRequestSort('deathsPer1000')}
              >
                Deaths per 1000
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell>Total Cases</StyledTableCell>
            <StyledTableCell>Total Deaths</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow key={row.countriesAndTerritories}>
              <TableCell>{row.countriesAndTerritories}</TableCell>
              <TableCell align="right">{row.cases}</TableCell>
              <TableCell align="right">{row.deaths}</TableCell>
              <TableCell align="right">{row.casesPer1000?.toFixed(2)}</TableCell>
              <TableCell align="right">{row.deathsPer1000?.toFixed(2)}</TableCell>
              <TableCell align="right">{row.totalCases}</TableCell>
              <TableCell align="right">{row.totalDeaths}</TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
