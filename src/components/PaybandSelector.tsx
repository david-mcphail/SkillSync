import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Tooltip, Box, Typography } from '@mui/material';
import type { Payband } from '../types/models';

interface PaybandSelectorProps {
    value: string;
    onChange: (value: string) => void;
    paybands: Payband[];
    error?: boolean;
    helperText?: string;
}

const PaybandSelector: React.FC<PaybandSelectorProps> = ({ value, onChange, paybands, error, helperText }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <FormControl fullWidth error={error}>
            <InputLabel>Payband</InputLabel>
            <Select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                label="Payband"
            >
                {paybands.map((payband) => (
                    <MenuItem key={payband.id} value={payband.id}>
                        <Tooltip
                            title={
                                <Box>
                                    <Typography variant="body2">
                                        Range: {formatCurrency(payband.minSalary)} - {formatCurrency(payband.maxSalary)}
                                    </Typography>
                                </Box>
                            }
                            placement="right"
                        >
                            <Box>
                                <Typography variant="body1">
                                    {payband.code} - {payband.label}
                                </Typography>
                            </Box>
                        </Tooltip>
                    </MenuItem>
                ))}
            </Select>
            {helperText && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {helperText}
                </Typography>
            )}
        </FormControl>
    );
};

export default PaybandSelector;
