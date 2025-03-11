import MarkdownViewer from './viewer'
import { Box } from "@mui/material"

export const Agreement = () => {
  
    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 3 }}>
            <MarkdownViewer filePath='/documents/user_agreement.md' />
        </Box>
    );
  }