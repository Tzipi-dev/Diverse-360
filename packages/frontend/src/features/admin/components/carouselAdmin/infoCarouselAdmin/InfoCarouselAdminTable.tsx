import React, { useState } from 'react';
import {
  Box, Button, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, IconButton, MenuItem, Paper, Select, TextField, Tooltip,
  Table, TableHead, TableRow, TableCell, TableBody, Menu, TableContainer
} from '@mui/material';
import { InfoIcon, LayoutGrid, LayoutList, List, Text} from 'lucide-react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useGetAllInfoCarouselQuery, useDeleteInfoCarouselMutation } from '../../../../home/infoCarouselApi';
import { InfoItem } from '../../../../home/homeTypes';
import EditInfoCarouselForm from './EditInfoCarouselForm';
import AddInfoCarouselForm from './AddInfoCarouselForm';
import { styles } from '../../../../../styles/carousel/admin/carouselTable.style';

const InfoCarouselAdminTable: React.FC = () => {
  const { data: infoItems = [], isLoading, error } = useGetAllInfoCarouselQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    pollingInterval: 3000
  });
  const [deleteInfoItem] = useDeleteInfoCarouselMutation();

  const [selectedInfoItemId, setSelectedInfoItemId] = useState<string | null>(null);
  const [editingInfoItem, setEditingInfoItem] = useState<InfoItem | null>(null);
  const [openModel, setOpenModel] = useState(false);
  const [textToSearch, setTextToSearch] = useState("");
  const [sortField, setSortField] = useState<'title' | 'created_at' | 'updated_at'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedItemDetails, setSelectedItemDetails] = useState<InfoItem | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredItems = infoItems.filter((item) =>
    item.title.toLowerCase().includes(textToSearch.toLowerCase())
  );

  const sortedItems = filteredItems.sort((a, b) => {
    const aVal: string | number = sortField === 'title' ? a.title : new Date(a[sortField] ?? 0).getTime();
    const bVal: string | number = sortField === 'title' ? b.title : new Date(b[sortField] ?? 0).getTime();

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleDelete = async () => {
    if (selectedInfoItemId) {
      await deleteInfoItem(selectedInfoItemId).unwrap();
      setDeleteDialogOpen(false);
      setSelectedInfoItemId(null);
    }
  };

  const open = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, infoItemId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedInfoItemId(infoItemId);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedInfoItemId(null);
  };

  if (isLoading) return <p>טוען...</p>;
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
            <MenuItem value="title">כותרת</MenuItem>
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
              <Box sx={styles.title}>{item.title}</Box>
              <CardMedia
                component="img"
                image={item.imageURL}
                alt={item.title}
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
                <TableCell>כותרת</TableCell>
                <TableCell>תיאור</TableCell>
                <TableCell>תמונה</TableCell>
                <TableCell>קישור</TableCell>
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
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell><CardMedia component="img" height="100" image={item.imageURL} /></TableCell>
                  <TableCell>{item.referenceLinkURL}</TableCell>
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
            const infoItemToEdit = infoItems.find(item => item.id === selectedInfoItemId);
            if (infoItemToEdit) setEditingInfoItem(infoItemToEdit);
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
              <h3>{selectedItemDetails.title}</h3>
              <p>{selectedItemDetails.description}</p>
              <img src={selectedItemDetails.imageURL} alt={selectedItemDetails.title} style={{ width: "100%", borderRadius: 8 }} />
              <a href={selectedItemDetails.referenceLinkURL} target="_blank" rel="noopener noreferrer">{selectedItemDetails.referenceLinkURL}</a>
              <p><strong>תאריך יצירה:</strong> {formatDate(selectedItemDetails.created_at)}</p>
              {selectedItemDetails.updated_at && <p><strong>תאריך עדכון:</strong> {formatDate(selectedItemDetails.updated_at)}</p>}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDetailsDialogOpen(false); if (selectedItemDetails) setEditingInfoItem(selectedItemDetails); }} color="primary">✏️ עדכון</Button>
          <Button onClick={() => { if (selectedItemDetails) { setSelectedInfoItemId(selectedItemDetails.id); setDeleteDialogOpen(true); setDetailsDialogOpen(false); } }} color="error">🗑 מחיקה</Button>
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

      {editingInfoItem && <EditInfoCarouselForm infoItem={editingInfoItem} onClose={() => setEditingInfoItem(null)} onSuccess={() => setEditingInfoItem(null)} />}
      {openModel && <AddInfoCarouselForm onClose={() => setOpenModel(false)} onSuccess={() => setOpenModel(false)} />}
    </>
  );
};

export default InfoCarouselAdminTable;
