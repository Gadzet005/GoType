import MarkdownViewer from './viewer'
import { Box } from "@mui/material"

export const CommunityRules = () => {
  
    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 3 }}>
            <MarkdownViewer filePath='/documents/community_rules.md' />
        </Box>
    );
  }