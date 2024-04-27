import React, { useState } from 'react';
import { Table, TableBody, TableRow, TableCell,TextField, TableContainer, TableHead, Paper, Box, CircularProgress, Typography } from '@mui/material';
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
            <h2>Countries List</h2>
            <TextField
            size="small"
            variant="outlined" type="text" 
            autoComplete="off"
            sx={{marginBottom: "20px"}}
            inputProps={{ maxLength: 2 }}
            value={countryCode} onChange={handleInputChange} label="Enter country code" />
            <TableContainer component={Paper}>
                <Table sx={{ padding: 20 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Country Code</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Country Name</TableCell>
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
