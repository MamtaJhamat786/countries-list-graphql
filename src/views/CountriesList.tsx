import React, { useState } from 'react';
import { Table, TableBody, TableRow, TableCell, TableContainer, TableHead, Paper, Box, CircularProgress, Typography } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_COUNTRIES } from '../queries/countries_list';
import { useDebounce } from 'use-debounce'; 

const CountriesList: React.FC = () => {
    const [countryCode, setCountryCode] = useState<string | undefined>('');
    const [debouncedCountryCode] = useDebounce(countryCode, 500); // Debounce the countryCode state
    const { loading, error, data } = useQuery(GET_COUNTRIES, {
        variables: debouncedCountryCode ? { filter: { code: { eq: debouncedCountryCode } } } : {}
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const code = event.target.value.toUpperCase();
        setCountryCode(code);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography variant="body1">Error: {error.message}</Typography>;

    return (
        <Box>
            <h2>Countries</h2>
            <input type="text" value={countryCode} onChange={handleInputChange} placeholder="Enter country code" />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650, padding: 20 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Country Name</TableCell>
                            <TableCell align="center">Country Code</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.countries && data.countries.length > 0 ? (
                            data.countries.map((country: any) => (
                                <TableRow key={country.code}>
                                    <TableCell align="center">{country.code}</TableCell>
                                    <TableCell align="center">{country.name}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2} align="center">No countries found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CountriesList;
