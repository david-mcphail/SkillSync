import React from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';

interface TitleSelectorProps {
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
    helperText?: string;
}

// Standardized job titles grouped by level
const JOB_TITLES = [
    { level: 'Junior', titles: ['Junior Software Engineer', 'Associate Consultant', 'Junior Designer'] },
    { level: 'Mid-Level', titles: ['Software Engineer', 'Consultant', 'Designer', 'Data Engineer'] },
    { level: 'Senior', titles: ['Senior Software Engineer', 'Senior Consultant', 'Senior Designer', 'Senior Backend Developer', 'Senior UX Designer'] },
    { level: 'Lead/Staff', titles: ['Lead Engineer', 'Staff Engineer', 'Staff DevOps Engineer', 'Lead Designer'] },
    { level: 'Principal', titles: ['Principal Engineer', 'Principal Consultant', 'Principal Cloud Architect'] },
    { level: 'Director', titles: ['Director of Engineering', 'Engineering Director', 'Director of Design'] },
    { level: 'Executive', titles: ['VP of Engineering', 'CTO', 'Chief Architect'] },
];

const ALL_TITLES = JOB_TITLES.flatMap(group => group.titles);

const TitleSelector: React.FC<TitleSelectorProps> = ({ value, onChange, error, helperText }) => {
    return (
        <Autocomplete
            freeSolo
            value={value}
            onChange={(_event, newValue) => {
                onChange(newValue || '');
            }}
            options={ALL_TITLES}
            groupBy={(option) => {
                const group = JOB_TITLES.find(g => g.titles.includes(option));
                return group?.level || 'Other';
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Job Title"
                    error={error}
                    helperText={helperText}
                    placeholder="Select or type a title"
                />
            )}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                    />
                ))
            }
        />
    );
};

export default TitleSelector;
