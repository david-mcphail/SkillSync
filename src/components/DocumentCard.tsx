import React from 'react';
import { Card, CardContent, Typography, Chip, Box, IconButton } from '@mui/material';
import {
    Download as DownloadIcon,
    PictureAsPdf as PdfIcon,
    InsertDriveFile as FileIcon
} from '@mui/icons-material';
import type { SupportingDocument } from '../types/models';

interface DocumentCardProps {
    document: SupportingDocument;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'success';
            case 'Under Review': return 'warning';
            case 'Draft': return 'default';
            case 'Archived': return 'default';
            default: return 'default';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Contract': return 'error';
            case 'Proposal': return 'warning';
            case 'Specification': return 'info';
            case 'Design': return 'secondary';
            case 'Report': return 'primary';
            case 'Meeting Notes': return 'default';
            default: return 'default';
        }
    };

    const getFileIcon = (fileName: string) => {
        if (fileName.endsWith('.pdf')) return <PdfIcon color="error" />;
        return <FileIcon color="action" />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        {getFileIcon(document.fileName)}
                        <Typography variant="h6" component="div" sx={{ wordBreak: 'break-word' }}>
                            {document.title}
                        </Typography>
                    </Box>
                    <IconButton size="small" color="primary" sx={{ ml: 1 }}>
                        <DownloadIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                        label={document.type}
                        color={getTypeColor(document.type) as any}
                        size="small"
                    />
                    <Chip
                        label={document.status}
                        color={getStatusColor(document.status) as any}
                        size="small"
                        variant="outlined"
                    />
                    <Chip
                        label={`v${document.version}`}
                        size="small"
                        variant="outlined"
                    />
                </Box>

                {document.description && (
                    <Typography variant="body2" color="text.secondary" paragraph>
                        {document.description}
                    </Typography>
                )}

                <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        File Name
                    </Typography>
                    <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all' }}>
                        {document.fileName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        Size: {formatFileSize(document.fileSize)}
                    </Typography>
                </Box>

                {document.tags && document.tags.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                            Tags
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {document.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem', height: '20px' }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                            Uploaded By
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                            {document.uploadedBy}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                            Uploaded
                        </Typography>
                        <Typography variant="body2">
                            {new Date(document.uploadedDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                            Modified: {new Date(document.lastModified).toLocaleDateString()}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default DocumentCard;
