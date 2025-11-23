import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import TitleSelector from './TitleSelector';
import PaybandSelector from './PaybandSelector';
import RateCardSelector from './RateCardSelector';
import { mockService } from '../services/mockService';
import type { User, Payband, RateCard, UserFinancials } from '../types/models';

interface AdminProfileTabProps {
    user: User;
    onUpdate: (updatedUser: User) => void;
}

const AdminProfileTab: React.FC<AdminProfileTabProps> = ({ user, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form state
    const [title, setTitle] = useState(user.title || '');
    const [location, setLocation] = useState(user.location || '');
    const [status, setStatus] = useState<'Active' | 'Inactive'>(user.status || 'Active');

    // Financial data state
    const [paybands, setPaybands] = useState<Payband[]>([]);
    const [rateCards, setRateCards] = useState<RateCard[]>([]);
    const [financials, setFinancials] = useState<UserFinancials | null>(null);

    const [selectedPayband, setSelectedPayband] = useState('');
    const [selectedRateCard, setSelectedRateCard] = useState<string | 'custom'>('');
    const [customRate, setCustomRate] = useState<number | undefined>();
    const [customCurrency, setCustomCurrency] = useState('USD');
    const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        loadFinancialData();
    }, [user.id]);

    const loadFinancialData = async () => {
        setLoading(true);
        try {
            const [paybandsData, rateCardsData, financialsData] = await Promise.all([
                mockService.getPaybands(),
                mockService.getRateCards(),
                mockService.getUserFinancials(user.id)
            ]);

            setPaybands(paybandsData);
            setRateCards(rateCardsData);
            setFinancials(financialsData);

            if (financialsData) {
                setSelectedPayband(financialsData.paybandId || '');
                if (financialsData.customRate) {
                    setSelectedRateCard('custom');
                    setCustomRate(financialsData.customRate);
                    setCustomCurrency(financialsData.customRateCurrency || 'USD');
                } else {
                    setSelectedRateCard(financialsData.rateCardId || '');
                }
                setEffectiveDate(financialsData.effectiveDate);
            }
        } catch (err) {
            setError('Failed to load financial data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            // Update user profile
            const updatedUser: User = {
                ...user,
                title,
                location,
                status
            };
            await mockService.updateUser(updatedUser);

            // Update financials
            const updatedFinancials: UserFinancials = {
                userId: user.id,
                paybandId: selectedPayband || undefined,
                rateCardId: selectedRateCard !== 'custom' ? selectedRateCard : undefined,
                customRate: selectedRateCard === 'custom' ? customRate : undefined,
                customRateCurrency: selectedRateCard === 'custom' ? customCurrency : undefined,
                effectiveDate
            };
            await mockService.updateUserFinancials(updatedFinancials);

            onUpdate(updatedUser);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError('Failed to save changes');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Administrative Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Manage user profile, payband, and billing rate information. This data is restricted to administrators only.
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        Changes saved successfully!
                    </Alert>
                )}

                <Stack spacing={3}>
                    {/* Profile Section */}
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Profile Information
                        </Typography>
                        <Stack spacing={2}>
                            <TitleSelector
                                value={title}
                                onChange={setTitle}
                            />
                            <TextField
                                label="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g., New York, NY or Remote"
                                fullWidth
                            />
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                                    label="Status"
                                >
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Inactive">Inactive</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </Box>

                    {/* Financial Section */}
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Financial Information
                        </Typography>
                        <Stack spacing={2}>
                            <PaybandSelector
                                value={selectedPayband}
                                onChange={setSelectedPayband}
                                paybands={paybands}
                            />
                            <RateCardSelector
                                value={selectedRateCard}
                                customRate={customRate}
                                customCurrency={customCurrency}
                                onChange={(rateCardId, rate, currency) => {
                                    setSelectedRateCard(rateCardId);
                                    if (rate !== undefined) setCustomRate(rate);
                                    if (currency) setCustomCurrency(currency);
                                }}
                                rateCards={rateCards}
                            />
                            <TextField
                                label="Effective Date"
                                type="date"
                                value={effectiveDate}
                                onChange={(e) => setEffectiveDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Stack>
                    </Box>

                    {/* Save Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                            onClick={handleSave}
                            disabled={saving}
                            size="large"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
};

export default AdminProfileTab;
