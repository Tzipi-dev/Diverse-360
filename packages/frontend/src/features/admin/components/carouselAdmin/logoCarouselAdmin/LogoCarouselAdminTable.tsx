import React, { useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Menu, MenuItem,
  Paper, TableContainer,
  CardMedia,
  Button,
  Select,
  TextField,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useGetAllLogoCarouselQuery, useDeleteLogoCarouselMutation } from '../../../../home/logoCarouselApi';
import { LogoItem } from '../../../../home/homeTypes';
import AddLogoCarouselForm from './AddLogoCarouselForm';
import EditLogoCarouselForm from './EditiLogoCarouselForm';
import { Box } from '@mui/material';
import { styles } from 'styles/carousel/admin/carouselTable.style';
import { LayoutGrid, LayoutList } from 'lucide-react';

const LogoCarouselAdminTable: React.FC = () => {
  const {
    data: logoItems = [],
    isLoading,
    error
  } = useGetAllLogoCarouselQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    pollingInterval: 3000 // ← מושך כל 3 שניות מהשרת
  });  const [deleteLogoItem] = useDeleteLogoCarouselMutation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLogoItemId, setSelectedLogoItemId] = useState<string | null>(null);
  const [editingLogoItem, setEditingLogoItem] = useState<LogoItem | null>(null);
  const [openModel,setOpenModel]=useState(false)
  const [textToSearch,setTextToSearch]=useState("")
  const [sortField, setSortField] = useState<'name' | 'created_at' | 'updated_at'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedItemDetails, setSelectedItemDetails] = useState<LogoItem | null>(null);

  const filteredItems = logoItems.filter((item) =>
  (item.name?.toLowerCase() ?? '').includes(textToSearch.toLowerCase()));

  const sortedItems = filteredItems.sort((a, b) => {
    if (sortField === 'name') {
      const comp = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? comp : -comp;
    } else {
      const dateA = a[sortField] ? new Date(a[sortField]!) : new Date(0);
      const dateB = b[sortField] ? new Date(b[sortField]!) : new Date(0);
      return sortOrder === 'asc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    }
  });

  function formatDate(dateString?: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }



  const open = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, logoItemId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedLogoItemId(logoItemId);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedLogoItemId(null);
  };
  const handleDelete = async () => {
    if (!selectedLogoItemId) return;
    const confirmDelete = window.confirm('האם את בטוחה שברצונך למחוק?');
    if (!confirmDelete) return;
    try {
      await deleteLogoItem(selectedLogoItemId).unwrap();
      handleMenuClose();
    } catch (err) {
      alert('שגיאה במחיקה');
      console.error(err);
    }
  };
  if (isLoading) return <p>טוען ...</p>;
  if (error) return <p>שגיאה בטעינה</p>;
  return (
    <>
    <Box sx={styles.container}>
            <Button sx={styles.addButton} variant="contained" onClick={() => setOpenModel(true)}>➕ הוספת פריט</Button>
            <Box sx={styles.displayOptions}>
              <Button variant={viewMode === "grid" ? "contained" : "outlined"} onClick={() => setViewMode("grid")}><LayoutGrid /></Button>
              <Button variant={viewMode === "table" ? "contained" : "outlined"} onClick={() => setViewMode("table")}><LayoutList /></Button>
            </Box>
            <TextField variant="outlined" placeholder="🔍 טקסט לחיפוש" onChange={(e) => setTextToSearch(e.target.value)} InputLabelProps={{ shrink: false }} sx={styles.searchBar}/>
              <span style={{color:"white"}} >מיון לפי:</span>
              <br />
             <Box sx={styles.sortingOptionsBox} > 
               <Select sx={styles.sortingOption} value={sortField} onChange={(e) => setSortField(e.target.value as any)} size="small">
                <MenuItem value="name">שם</MenuItem>
                <MenuItem value="created_at">תאריך יצירה</MenuItem>
                <MenuItem value="updated_at">תאריך עדכון</MenuItem>
              </Select>
              <Select sx={styles.sortingOption} value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} size="small">
                <MenuItem value="asc">סדר עולה</MenuItem>
                <MenuItem value="desc">סדר יורד</MenuItem>
              </Select></Box>
            </Box>
          {viewMode === 'grid' ? (
            <Box sx={styles.mainContainer} component={Paper}>
              {sortedItems.map(item => (
                <Box
                  key={item.id}
                  sx={styles.imageWrapper}
                  onClick={() => {
                    setSelectedItemDetails(item);
                    setDetailsDialogOpen(true);
                  }}
                >
                  <Box sx={styles.title}>{item.name}</Box>
                  <CardMedia
                    component="img"
                    image={item.imageURL}
                    alt={item.name}
                    sx={styles.itemImage}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <TableContainer component={Paper} sx={styles.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>פעולות</TableCell>
                    <TableCell>שם</TableCell>
                    <TableCell>תמונה</TableCell>
                    <TableCell>תאריך יצירה</TableCell>
                    <TableCell>תאריך עדכון</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <IconButton onClick={(e) => handleMenuOpen(e, item.id)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell><CardMedia component="img" height="100" image={item.imageURL} /></TableCell>
                      <TableCell>{formatDate(item.created_at)}</TableCell>
                      <TableCell>{formatDate(item.updated_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
    
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => {
                const logoItemToEdit = logoItems.find(item => item.id === selectedLogoItemId);
                if (logoItemToEdit) setEditingLogoItem(logoItemToEdit);
                handleMenuClose();
              }}
            >✏️ עריכה</MenuItem>
            <MenuItem onClick={handleDelete}>🗑 מחיקה</MenuItem>
          </Menu>
    
          <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle>פרטי פריט</DialogTitle>
            <DialogContent>
              {selectedItemDetails && (
                <Box display="flex" flexDirection="column" gap={2}>
                  <h3>{selectedItemDetails.name}</h3>
                  <img src={selectedItemDetails.imageURL} alt={selectedItemDetails.name} style={{ width: "100%", borderRadius: 8 }} />
                  <p><strong>תאריך יצירה:</strong> {formatDate(selectedItemDetails.created_at)}</p>
                  {selectedItemDetails.updated_at && <p><strong>תאריך עדכון:</strong> {formatDate(selectedItemDetails.updated_at)}</p>}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { setDetailsDialogOpen(false); if (selectedItemDetails) setEditingLogoItem(selectedItemDetails); }} color="primary">✏️ עדכון</Button>
              <Button onClick={() => { if (selectedItemDetails) { setSelectedLogoItemId(selectedItemDetails.id); setDeleteDialogOpen(true); setDetailsDialogOpen(false); } }} color="error">🗑 מחיקה</Button>
            </DialogActions>
          </Dialog>
    
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>אישור מחיקה</DialogTitle>
            <DialogContent>
              <DialogContentText>האם את בטוחה שברצונך למחוק את הפריט? פעולה זו אינה ניתנת לשחזור.</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>ביטול</Button>
              <Button onClick={handleDelete} color="error" variant="contained">מחיקה</Button>
            </DialogActions>
          </Dialog>
    
          {editingLogoItem && <EditLogoCarouselForm logoItem={editingLogoItem} onClose={() => setEditingLogoItem(null)} onSuccess={() => setEditingLogoItem(null)} />}
          {openModel && <AddLogoCarouselForm onClose={() => setOpenModel(false)} onSuccess={() => setOpenModel(false)} />}
        </>
      );
    };
    
   export default LogoCarouselAdminTable;