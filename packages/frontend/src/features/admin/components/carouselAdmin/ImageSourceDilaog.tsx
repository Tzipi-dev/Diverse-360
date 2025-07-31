import React from 'react';
import { Dialog, DialogTitle, DialogContent, Button, Box } from '@mui/material';
type Props = {
  open: boolean;
  onClose: () => void;
  onPickFromComputer: () => void;
  onPickFromDrive: () => void;
  // onPickFromPhotos: () => void;
  onPickFromSupabase: () => void;
};


const ImageSourceDialog: React.FC<Props> = ({
  open, onClose,
  onPickFromComputer, onPickFromDrive, onPickFromSupabase,
  // onPickFromPhotos
}) => {


  const verifyDrive=()=>{
   
    onPickFromDrive()
  }


  return <>
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>בחרי מקור לתמונה</DialogTitle>
   
    <DialogContent>
      <Box display="flex" flexDirection="column" gap={2} mt={1}>
        <Button variant="outlined" onClick={onPickFromComputer}>📁 מהמחשב האישי</Button>
        <Button variant="outlined" onClick={verifyDrive}>☁️ Google Drive</Button>
        {/* <Button variant="outlined" onClick={onPickFromPhotos}>🌄 Google Photos</Button> */}
        <Button variant="outlined" onClick={onPickFromSupabase}>📦 תמונות שמורות</Button>
      </Box>
    </DialogContent>
  </Dialog>
</>
};


export default ImageSourceDialog;




