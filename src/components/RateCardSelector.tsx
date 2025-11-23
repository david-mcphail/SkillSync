import React, { useState } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    Stack
} from '@mui/material';
import type { RateCard } from '../types/models';

interface RateCardSelectorProps {
    value: string | 'custom';
    customRate?: number;
    customCurrency?: string;
    onChange: (rateCardId: string | 'custom', customRate?: number, customCurrency?: string) => void;
    rateCards: RateCard[];
    error?: boolean;
    helperText?: string;
}

const CURRENCIES = ['USD', 'GBP', 'EUR', 'CAD'];

const RateCardSelector: React.FC<RateCardSelectorProps> = ({
    value,
    customRate,
    customCurrency = 'USD',
    onChange,
    rateCards,
    error,
    helperText
}) => {
    const [isCustom, setIsCustom] = useState(value === 'custom');
    const [localCustomRate, setLocalCustomRate] = useState(customRate || 0);
    const [localCustomCurrency, setLocalCustomCurrency] = useState(customCurrency);

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const custom = event.target.value === 'custom';
        setIsCustom(custom);
        if (custom) {
            onChange('custom', localCustomRate, localCustomCurrency);
        } else {
            onChange(rateCards[0]?.id || '');
        }
    };

    const handleRateCardChange = (rateCardId: string) => {
        onChange(rateCardId);
    };

    const handleCustomRateChange = (rate: number) => {
        setLocalCustomRate(rate);
        onChange('custom', rate, localCustomCurrency);
    };

    const handleCustomCurrencyChange = (currency: string) => {
        setLocalCustomCurrency(currency);
        onChange('custom', localCustomRate, currency);
    };

    return (
        <Box>
            <RadioGroup row value={isCustom ? 'custom' : 'standard'} onChange={handleModeChange}>
                <FormControlLabel value="standard" control={<Radio />} label="Standard Rate Card" />
                <FormControlLabel value="custom" control={<Radio />} label="Custom Rate" />
            </RadioGroup>

            {!isCustom ? (
                <FormControl fullWidth error={error} sx={{ mt: 2 }}>
                    <InputLabel>Rate Card</InputLabel>
                    <Select
                        value={value === 'custom' ? '' : value}
                        onChange={(e) => handleRateCardChange(e.target.value)}
                        label="Rate Card"
                    >
                        {rateCards.map((card) => (
                            <MenuItem key={card.id} value={card.id}>
                                <Box>
                                    <Typography variant="body1">{card.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatCurrency(card.hourlyRate, card.currency)}/hr • Effective: {card.effectiveDate}
                                    </Typography>
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                    {helperText && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                            {helperText}
                        </Typography>
                    )}
                </FormControl>
            ) : (
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <TextField
                        label="Hourly Rate"
                        type="number"
                        value={localCustomRate}
                        onChange={(e) => handleCustomRateChange(Number(e.target.value))}
                        error={error}
                        helperText={helperText}
                        fullWidth
                    />
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Currency</InputLabel>
                        <Select
                            value={localCustomCurrency}
                            onChange={(e) => handleCustomCurrencyChange(e.target.value)}
                            label="Currency"
                        >
                            {CURRENCIES.map((currency) => (
                                <MenuItem key={currency} value={currency}>
                                    {currency}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            )}
        </Box>
    );
};

export default RateCardSelector;
