import { useState, useMemo, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stepper,
    Step,
    StepLabel,
    Box,
    Typography,
    TextField,
    Autocomplete,
    Rating,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Alert
} from '@mui/material';
import { TAXONOMY, SYNONYMS } from '../data/taxonomy';
import { type ProficiencyLevel, PROFICIENCY_DESCRIPTIONS, type TaxonomyCategory, type Skill } from '../types/models';

interface AddSkillModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (skill: Omit<Skill, 'id' | 'verified'>) => void;
    initialCategory?: TaxonomyCategory | null;
}

const steps = ['Select Category', 'Select Skill', 'Proficiency', 'Details'];

const AddSkillModal = ({ open, onClose, onAdd, initialCategory }: AddSkillModalProps) => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<TaxonomyCategory | null>(null);
    const [selectedSkill, setSelectedSkill] = useState<{ name: string; subcategory: string } | null>(null);
    const [proficiency, setProficiency] = useState<ProficiencyLevel | null>(null);
    const [yearsOfExperience, setYearsOfExperience] = useState<number | ''>('');
    const [certificationUrl, setCertificationUrl] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (open) {
            if (initialCategory) {
                setSelectedCategory(initialCategory);
                setActiveStep(1);
            } else {
                setActiveStep(0);
                setSelectedCategory(null);
            }
        } else {
            // Reset form when closed
            setActiveStep(0);
            setSelectedCategory(null);
            setSelectedSkill(null);
            setProficiency(null);
            setYearsOfExperience('');
            setCertificationUrl('');
            setNotes('');
        }
    }, [open, initialCategory]);

    const handleNext = () => {
        if (activeStep === 3 && selectedCategory && selectedSkill && proficiency) {
            onAdd({
                name: selectedSkill.name,
                category: selectedCategory.name,
                subcategory: selectedSkill.subcategory,
                proficiency,
                yearsOfExperience: yearsOfExperience === '' ? undefined : Number(yearsOfExperience),
                certificationUrl: certificationUrl || undefined,
                notes: notes || undefined,
            });
            handleClose();
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleClose = () => {
        onClose();
    };

    // Flatten skills for autocomplete based on selected category
    const availableSkills = useMemo(() => {
        if (!selectedCategory) return [];
        const skills: { name: string; subcategory: string }[] = [];
        selectedCategory.subcategories.forEach((sub) => {
            sub.skills.forEach((skill) => {
                skills.push({ name: skill, subcategory: sub.name });
            });
        });
        return skills.sort((a, b) => a.name.localeCompare(b.name));
    }, [selectedCategory]);

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {TAXONOMY.map((category) => (
                            <Grid item xs={12} sm={6} key={category.name}>
                                <Card
                                    variant={selectedCategory?.name === category.name ? 'outlined' : 'elevation'}
                                    sx={{
                                        height: '100%',
                                        borderColor: selectedCategory?.name === category.name ? 'primary.main' : undefined,
                                        borderWidth: selectedCategory?.name === category.name ? 2 : undefined
                                    }}
                                >
                                    <CardActionArea onClick={() => setSelectedCategory(category)} sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                {category.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {category.description}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                );
            case 1:
                return (
                    <Box sx={{ mt: 4, minHeight: 200 }}>
                        <Typography gutterBottom>
                            Search for a skill in <strong>{selectedCategory?.name}</strong>:
                        </Typography>
                        <Autocomplete
                            options={availableSkills}
                            getOptionLabel={(option) => option.name}
                            groupBy={(option) => option.subcategory}
                            value={selectedSkill}
                            onChange={(_, newValue) => setSelectedSkill(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Skill Tag"
                                    placeholder="e.g. React, Kubernetes..."
                                    helperText="Type to search. Synonyms (e.g. 'K8s') are supported."
                                />
                            )}
                            filterOptions={(options, { inputValue }) => {
                                const lowerInput = inputValue.toLowerCase();
                                // Check synonyms
                                const synonymMatch = Object.keys(SYNONYMS).find(key => key.toLowerCase() === lowerInput);
                                const searchTerm = synonymMatch ? SYNONYMS[synonymMatch].toLowerCase() : lowerInput;

                                return options.filter(option =>
                                    option.name.toLowerCase().includes(searchTerm)
                                );
                            }}
                        />
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography component="legend" gutterBottom>
                            How proficient are you with <strong>{selectedSkill?.name}</strong>?
                        </Typography>
                        <Rating
                            name="proficiency-rating"
                            value={proficiency}
                            onChange={(_, newValue) => setProficiency(newValue as ProficiencyLevel)}
                            size="large"
                            max={5}
                            sx={{ fontSize: '3rem', mb: 2 }}
                        />
                        {proficiency && (
                            <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    Level {proficiency}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {PROFICIENCY_DESCRIPTIONS[proficiency]}
                                </Typography>
                                {(proficiency === 4 || proficiency === 5) && (
                                    <Alert severity="warning" sx={{ mt: 2 }}>
                                        Manager approval is required for ratings of 4 or 5 to prevent inflation.
                                    </Alert>
                                )}
                            </Box>
                        )}
                    </Box>
                );
            case 3:
                return (
                    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Additional Details for <strong>{selectedSkill?.name}</strong>
                        </Typography>

                        <TextField
                            label="Years of Experience"
                            type="number"
                            value={yearsOfExperience}
                            onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                            fullWidth
                            inputProps={{ min: 0, step: 0.5 }}
                            helperText="Total years of professional experience with this skill"
                        />

                        <TextField
                            label="Certification URL (Optional)"
                            value={certificationUrl}
                            onChange={(e) => setCertificationUrl(e.target.value)}
                            fullWidth
                            placeholder="https://..."
                            helperText="Link to a valid certification or credential"
                        />

                        <TextField
                            label="Notes (Optional)"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Any additional context, specific projects, or achievements..."
                        />
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Add New Skill</DialogTitle>
            <DialogContent>
                <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 3 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {renderStepContent(activeStep)}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleClose} color="inherit">
                    Cancel
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleBack} disabled={activeStep === 0} sx={{ mr: 1 }}>
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    variant="contained"
                    disabled={
                        (activeStep === 0 && !selectedCategory) ||
                        (activeStep === 1 && !selectedSkill) ||
                        (activeStep === 2 && !proficiency) ||
                        (activeStep === 3 && yearsOfExperience === '')
                    }
                >
                    {activeStep === steps.length - 1 ? 'Add Skill' : 'Next'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddSkillModal;
