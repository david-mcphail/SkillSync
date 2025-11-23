import React from 'react';
import {
    Box,
    List,
    ListItemButton,
    ListItemText,
    Chip,
    Typography,
    Collapse,
    Stack
} from '@mui/material';
import {
    ExpandLess,
    ExpandMore,
    Business as BusinessIcon,
    Group as GroupIcon,
    People as PeopleIcon
} from '@mui/icons-material';
import type { Group } from '../types/models';

interface GroupTreeViewProps {
    groups: Group[];
    selectedGroupId?: string;
    onGroupSelect: (groupId: string) => void;
    memberCounts?: Record<string, number>;
}

const GroupTreeView: React.FC<GroupTreeViewProps> = ({
    groups,
    selectedGroupId,
    onGroupSelect,
    memberCounts = {}
}) => {
    const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set());

    const toggleExpand = (groupId: string) => {
        setExpandedGroups(prev => {
            const newSet = new Set(prev);
            if (newSet.has(groupId)) {
                newSet.delete(groupId);
            } else {
                newSet.add(groupId);
            }
            return newSet;
        });
    };

    const getGroupIcon = (type: string) => {
        switch (type) {
            case 'Department':
                return <BusinessIcon fontSize="small" />;
            case 'Practice':
                return <GroupIcon fontSize="small" />;
            case 'Squad':
                return <PeopleIcon fontSize="small" />;
            default:
                return <GroupIcon fontSize="small" />;
        }
    };

    const getGroupColor = (type: string) => {
        switch (type) {
            case 'Department':
                return 'primary';
            case 'Practice':
                return 'secondary';
            case 'Squad':
                return 'success';
            default:
                return 'default';
        }
    };

    // Organize groups into parent-child hierarchy
    const rootGroups = groups.filter(g => !g.parentGroupId);
    const getChildGroups = (parentId: string) => groups.filter(g => g.parentGroupId === parentId);

    const renderGroup = (group: Group, level: number = 0) => {
        const hasChildren = groups.some(g => g.parentGroupId === group.id);
        const isExpanded = expandedGroups.has(group.id);
        const isSelected = selectedGroupId === group.id;
        const memberCount = memberCounts[group.id] || 0;

        return (
            <Box key={group.id}>
                <ListItemButton
                    selected={isSelected}
                    onClick={() => onGroupSelect(group.id)}
                    sx={{
                        pl: 2 + level * 2,
                        borderLeft: level > 0 ? '2px solid rgba(255,255,255,0.1)' : 'none',
                        ml: level > 0 ? 2 : 0,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 1 }}>
                        {getGroupIcon(group.type)}
                        <ListItemText
                            primary={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="body1">{group.name}</Typography>
                                    <Chip
                                        label={group.type}
                                        size="small"
                                        color={getGroupColor(group.type) as any}
                                        sx={{ height: 20, fontSize: '0.7rem' }}
                                    />
                                </Stack>
                            }
                            secondary={`${memberCount} member${memberCount !== 1 ? 's' : ''}`}
                        />
                        {hasChildren && (
                            <Box onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(group.id);
                            }}>
                                {isExpanded ? <ExpandLess /> : <ExpandMore />}
                            </Box>
                        )}
                    </Box>
                </ListItemButton>
                {hasChildren && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {getChildGroups(group.id).map(childGroup =>
                                renderGroup(childGroup, level + 1)
                            )}
                        </List>
                    </Collapse>
                )}
            </Box>
        );
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
                Groups & Practices
            </Typography>
            <List>
                {rootGroups.map(group => renderGroup(group))}
            </List>
        </Box>
    );
};

export default GroupTreeView;
