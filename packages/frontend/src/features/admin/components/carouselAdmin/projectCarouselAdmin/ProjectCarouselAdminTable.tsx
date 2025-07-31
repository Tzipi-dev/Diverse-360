
import React, { useState } from 'react';
import {
  Box, Button, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, IconButton, MenuItem, Paper, Select, TextField, Tooltip,
  Table, TableHead, TableRow, TableCell, TableBody, Menu, TableContainer
} from '@mui/material';
import { InfoIcon, LayoutGrid, LayoutList, List, Text} from 'lucide-react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useGetAllProjectCarouselQuery, useDeleteProjectCarouselMutation } from '../../../../home/projectCarouselApi';
import { ProjectItem } from '../../../../home/homeTypes';
import EditProjectCarouselForm from './EditProjectCarouselForm';
import AddProjectCarouselForm from './AddProjectCaruselForm';
import { styles } from '../../../../../styles/carousel/admin/carouselTable.style';

const ProjectCarouselAdminTable: React.FC = () => {
  const { data: projectItems = [], isLoading, error } = useGetAllProjectCarouselQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    pollingInterval: 3000
  });
  const [deleteProjectItem] = useDeleteProjectCarouselMutation();

  const [selectedProjectItemId, setSelectedProjectItemId] = useState<string | null>(null);
  const [editingProjectItem, setEditingProjectItem] = useState<ProjectItem | null>(null);
  const [openModel, setOpenModel] = useState(false);
  const [textToSearch, setTextToSearch] = useState("");
  const [sortField, setSortField] = useState<'projectName' | 'created_at' | 'updated_at'>('projectName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedItemDetails, setSelectedItemDetails] = useState<ProjectItem | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredItems = projectItems.filter((item) =>
    item.projectName.toLowerCase().includes(textToSearch.toLowerCase())
  );

  const sortedItems = filteredItems.sort((a, b) => {
    const aVal: string | number = sortField === 'projectName' ? a.projectName : new Date(a[sortField] ?? 0).getTime();
    const bVal: string | number = sortField === 'projectName' ? b.projectName : new Date(b[sortField] ?? 0).getTime();

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
    if (selectedProjectItemId) {
      await deleteProjectItem(selectedProjectItemId).unwrap();
      setDeleteDialogOpen(false);
      setSelectedProjectItemId(null);
    }
  };

  const open = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, projectItemId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedProjectItemId(projectItemId);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProjectItemId(null);
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
            <MenuItem value="projectName">שם הפרויקט</MenuItem>
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
              <Box sx={styles.title}>{item.projectName}</Box>
              <CardMedia
                component="img"
                image={item.imageURL}
                alt={item.projectName}
                sx={styles.itemImage}
              />
            </Box>
          ))}
        </Box>
      ) : (
        <TableContainer 
        component={Paper} sx={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>פעולות</TableCell>
                <TableCell>שפ הפרוקיט</TableCell>
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
                  <TableCell>{item.projectName}</TableCell>
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
            const projectItemToEdit = projectItems.find(item => item.id === selectedProjectItemId);
            if (projectItemToEdit) setEditingProjectItem(projectItemToEdit);
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
              <h3>{selectedItemDetails.projectName}</h3>
              <p>{selectedItemDetails.description}</p>
              <img src={selectedItemDetails.imageURL} alt={selectedItemDetails.projectName} style={{ width: "100%", borderRadius: 8 }} />
              <a href={selectedItemDetails.referenceLinkURL} target="_blank" rel="noopener noreferrer">{selectedItemDetails.referenceLinkURL}</a>
              <p><strong>תאריך יצירה:</strong> {formatDate(selectedItemDetails.created_at)}</p>
              {selectedItemDetails.updated_at && <p><strong>תאריך עדכון:</strong> {formatDate(selectedItemDetails.updated_at)}</p>}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDetailsDialogOpen(false); if (selectedItemDetails) setEditingProjectItem(selectedItemDetails); }} color="primary">✏️ עדכון</Button>
          <Button onClick={() => { if (selectedItemDetails) { setSelectedProjectItemId(selectedItemDetails.id); setDeleteDialogOpen(true); setDetailsDialogOpen(false); } }} color="error">🗑 מחיקה</Button>
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

      {editingProjectItem && <EditProjectCarouselForm projectItem={editingProjectItem} onClose={() => setEditingProjectItem(null)} onSuccess={() => setEditingProjectItem(null)} />}
      {openModel && <AddProjectCarouselForm onClose={() => setOpenModel(false)} onSuccess={() => setOpenModel(false)} />}
    </>
  );
};

export default ProjectCarouselAdminTable;

// import React, { useState } from 'react';
// import {
//   Table, TableHead, TableRow, TableCell, TableBody,
//   IconButton, Menu, MenuItem, Paper, TableContainer,
//   CardMedia, Button, Select, Box
// } from '@mui/material';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import { useGetAllProjectCarouselQuery, useDeleteProjectCarouselMutation } from '../../../../home/projectCarouselApi';
// import { ProjectItem } from '../../../../home/homeTypes';
// import EditProjectCarouselForm from './EditProjectCarouselForm';
// import AddProjectCaruselForm from './AddProjectCaruselForm';

// const ProjectCarouselAdminTable: React.FC = () => {
//   const {
//     data: projectItems = [],
//     isLoading,
//     error
//   } = useGetAllProjectCarouselQuery(undefined, {
//     refetchOnMountOrArgChange: true,
//     refetchOnReconnect: true,
//     pollingInterval: 3000
//   });
//   const [deleteProjectItem] = useDeleteProjectCarouselMutation();

//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [selectedProjectItemId, setSelectedProjectItemId] = useState<string | null>(null);
//   const [editingProjectItem, setEditingProjectItem] = useState<ProjectItem | null>(null);
//   const [openModel, setOpenModel] = useState(false);
//   const [textToSearch, setTextToSearch] = useState('');
//   const [sortField, setSortField] = useState<'projectName' | 'created_at' | 'updated_at'>('projectName');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

//   const open = Boolean(anchorEl);

//   const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, itemId: string) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedProjectItemId(itemId);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedProjectItemId(null);
//   };

//   const handleDelete = async () => {
//     if (!selectedProjectItemId) return;
//     const confirmDelete = window.confirm('האם את בטוחה שברצונך למחוק?');
//     if (!confirmDelete) return;
//     try {
//       await deleteProjectItem(selectedProjectItemId).unwrap();
//       handleMenuClose();
//     } catch (err) {
//       alert('שגיאה במחיקה');
//       console.error(err);
//     }
//   };

//   const filteredItems = projectItems.filter((item) =>
//     item.projectName.toLowerCase().includes(textToSearch.toLowerCase()) ||
//     item.description?.toLowerCase().includes(textToSearch.toLowerCase())
//   );

//   const sortedItems = filteredItems.sort((a, b) => {
//     if (sortField === 'projectName') {
//       const comp = a.projectName.localeCompare(b.projectName);
//       return sortOrder === 'asc' ? comp : -comp;
//     } else {
//       const dateA = a[sortField] ? new Date(a[sortField]!) : new Date(0);
//       const dateB = b[sortField] ? new Date(b[sortField]!) : new Date(0);
//       return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
//     }
//   });

//   function formatDate(dateString?: string) {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     return `${day}/${month}/${year} ${hours}:${minutes}`;
//   }

//   if (isLoading) return <p>טוען ...</p>;
//   if (error) return <p>שגיאה בטעינה</p>;

//   return (
//     <>
//       <Button variant="contained" onClick={() => setOpenModel(true)}>
//         ➕ הוספת פרויקט חדש
//       </Button>
//       <input placeholder='🔍 חיפוש' onChange={(e) => setTextToSearch(e.target.value)} />
//       <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
//         <Select value={sortField} onChange={(e) => setSortField(e.target.value as any)} size="small">
//           <MenuItem value="projectName">כותרת</MenuItem>
//           <MenuItem value="created_at">תאריך יצירה</MenuItem>
//           <MenuItem value="updated_at">תאריך עדכון</MenuItem>
//         </Select>
//         <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} size="small">
//           <MenuItem value="asc">סדר עולה</MenuItem>
//           <MenuItem value="desc">סדר יורד</MenuItem>
//         </Select>
//       </Box>
//       <TableContainer component={Paper} sx={{ mt: 4 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell align="center" sx={{ fontWeight: 'bold' }}>פעולות</TableCell>
//               <TableCell align="center" sx={{ fontWeight: 'bold' }}>כותרת</TableCell>
//               <TableCell align="center" sx={{ fontWeight: 'bold' }}>תיאור</TableCell>
//               <TableCell align="center" sx={{ fontWeight: 'bold' }}>תמונה</TableCell>
//               <TableCell align="center" sx={{ fontWeight: 'bold' }}>קישור</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {sortedItems.map((item) => (
//               <TableRow key={item.id}>
//                 <TableCell align="center">
//                   <IconButton onClick={(e) => handleMenuOpen(e, item.id)}>
//                     <MoreVertIcon />
//                   </IconButton>
//                 </TableCell>
//                 <TableCell align="center">{item.projectName.slice(0, 50)}</TableCell>
//                 <TableCell align="center">{item.description?.slice(0, 50)}</TableCell>
//                 <TableCell align="center">
//                   <CardMedia component="img" height="80" image={item.imageURL} />
//                 </TableCell>
//                 <TableCell align="center">{item.referenceLinkURL}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//         <Menu
//           anchorEl={anchorEl}
//           open={open}
//           onClose={handleMenuClose}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//           transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//         >
//           <MenuItem
//             onClick={() => {
//               const itemToEdit = projectItems.find(p => p.id === selectedProjectItemId);
//               if (itemToEdit) setEditingProjectItem(itemToEdit);
//               handleMenuClose();
//             }}
//           >
//             ✏️ עריכה
//           </MenuItem>
//           <MenuItem onClick={handleDelete}>🗑 מחיקה</MenuItem>
//         </Menu>
//       </TableContainer>

//       {editingProjectItem && (
//         <EditProjectCarouselForm
//           projectItem={editingProjectItem}
//           onClose={() => setEditingProjectItem(null)}
//           onSuccess={() => setEditingProjectItem(null)}
//         />
//       )}
//       {openModel && (
//         <AddProjectCaruselForm
//           onClose={() => setOpenModel(false)}
//           onSuccess={() => setOpenModel(false)}
//         />
//       )}
//     </>
//   );
// };

// export default ProjectCarouselAdminTable;


// // import React, { useState } from 'react';
// // import {
// //   Table, TableHead, TableRow, TableCell, TableBody, IconButton, Menu, MenuItem,
// //   Paper, TableContainer,
// //   CardMedia,
// //   Button,
// //   Select,
// //   Tooltip
// // } from '@mui/material';

// // import MoreVertIcon from '@mui/icons-material/MoreVert';
// // import { useGetAllInfoCarouselQuery, useDeleteInfoCarouselMutation } from '../../../../home/infoCarouselApi';
// // import { InfoItem } from '../../../../home/homeTypes';
// // import EditInfoCarouselForm from './EditInfoCarouselForm';
// // import AddInfoCarouselForm from './AddInfoCarouselForm';
// // import { Box } from '@mui/material';
// // import {styles} from '../../../../../styles/carousel/admin/carouselTable.style'
// // import { InfoIcon, TrashIcon } from 'lucide-react';
// // import Dialog from '@mui/material/Dialog';
// // import DialogActions from '@mui/material/DialogActions';
// // import DialogContent from '@mui/material/DialogContent';
// // import DialogContentText from '@mui/material/DialogContentText';
// // import DialogTitle from '@mui/material/DialogTitle';


// // const InfoCarouselAdminTable: React.FC = () => {
// //   const {
// //     data: infoItems = [],
// //     isLoading,
// //     error
// //   } = useGetAllInfoCarouselQuery(undefined, {
// //     refetchOnMountOrArgChange: true,
// //     refetchOnReconnect: true,
// //     pollingInterval: 3000 // ← מושך כל 3 שניות מהשרת
// //   });  const [deleteInfoItem] = useDeleteInfoCarouselMutation();

// //   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
// //   const [selectedInfoItemId, setSelectedInfoItemId] = useState<string | null>(null);
// //   const [editingInfoItem, setEditingInfoItem] = useState<InfoItem | null>(null);
// //   const [openModel,setOpenModel]=useState(false)
// //   const [textToSearch,setTextToSearch]=useState("")
// //   const [sortField, setSortField] = useState<'title' | 'created_at' | 'updated_at'>('title');
// //   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
// //   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// //   const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
// //   const [selectedItemDetails, setSelectedItemDetails] = useState<InfoItem | null>(null);


// //   const filteredItems = infoItems.filter((item) =>
// //     item.title.toLowerCase().includes(textToSearch.toLowerCase()) ||
// //     item.description?.toLowerCase().includes(textToSearch.toLowerCase())
// //   );

// //   const sortedItems = filteredItems.sort((a, b) => {
// //     if (sortField === 'title') {
// //       const comp = a.title.localeCompare(b.title);
// //       return sortOrder === 'asc' ? comp : -comp;
// //     } else {
// //       const dateA = a[sortField] ? new Date(a[sortField]!) : new Date(0);
// //       const dateB = b[sortField] ? new Date(b[sortField]!) : new Date(0);
// //       return sortOrder === 'asc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
// //     }
// //   });

// //   function formatDate(dateString?: string) {
// //     if (!dateString) return '';
// //     const date = new Date(dateString);
// //     const day = String(date.getDate()).padStart(2, '0');
// //     const month = String(date.getMonth() + 1).padStart(2, '0'); 
// //     const year = date.getFullYear();
// //     const hours = String(date.getHours()).padStart(2, '0');
// //     const minutes = String(date.getMinutes()).padStart(2, '0');

// //     return `${day}/${month}/${year} ${hours}:${minutes}`;
// //   }



// //   // const open = Boolean(anchorEl);
// //   // const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, infoItemId: string) => {
// //   //   setAnchorEl(event.currentTarget);
// //   //   setSelectedInfoItemId(infoItemId);
// //   // };
// //   // const handleMenuClose = () => {
// //   //   setAnchorEl(null);
// //   //   setSelectedInfoItemId(null);
// //   // };
// //   const handleDelete = (event: React.MouseEvent<HTMLButtonElement>, infoItemId: string) => {
// //   event.stopPropagation();
// //   setSelectedInfoItemId(infoItemId);
// //   setDeleteDialogOpen(true);
// //   };

// //   const handleConfirmDelete = async () => {
// //     if (!selectedInfoItemId) return;
// //     try {
// //       await deleteInfoItem(selectedInfoItemId).unwrap();
// //     } catch (err) {
// //       alert('שגיאה במחיקה');
// //       console.error(err);
// //     } finally {
// //       setDeleteDialogOpen(false);
// //       setSelectedInfoItemId(null);}
// //     };

// //   const handleCancelDelete = () => {
// //     setDeleteDialogOpen(false);
// //     setSelectedInfoItemId(null);
// //   };

// //   const handleImageClick = (item: InfoItem) => {
// //   setSelectedItemDetails(item);
// //   setDetailsDialogOpen(true);
// // };


// //   if (isLoading) return <p>טוען ...</p>;
// //   if (error) return <p>שגיאה בטעינה</p>;
// //   return (
// //     <>
// //         <Button variant="contained" onClick={() => setOpenModel(true)}>
// //            ➕ הוספת פריט חדש
// //        </Button>
// //        <input placeholder='🔍 טקטס לחיפוש' onChange={(e)=>{setTextToSearch(e.target.value)}} />
// //        <Box sx={styles.mainContainer}>
// //         <Select
// //           value={sortField}
// //           onChange={(e) => setSortField(e.target.value as any)}
// //           size="small"
// //         >
// //           <MenuItem value="title">כותרת</MenuItem>
// //           <MenuItem value="created_at">תאריך יצירה</MenuItem>
// //           <MenuItem value="updated_at">תאריך עדכון</MenuItem>
// //         </Select>
// //         <Select
// //           value={sortOrder}
// //           onChange={(e) => setSortOrder(e.target.value as any)}
// //           size="small"
// //         >
// //           <MenuItem value="asc">סדר עולה</MenuItem>
// //           <MenuItem value="desc">סדר יורד</MenuItem>
// //         </Select>
// //       </Box>
// //        <Box sx={styles.mainContainer} component={Paper}>
// //           {sortedItems.map((infoItem: InfoItem) => (
// //               <Box sx={styles.imageWrapper} onClick={() => handleImageClick(infoItem)} style={{ cursor: "pointer" }}>
// //   <CardMedia
// //     component="img"
// //     image={infoItem.imageURL}
// //     alt={infoItem.title}
// //     sx={styles.itemImage}
// //   />
// //   <Box sx={styles.iconOverlay}>
// //     <Tooltip
// //       title={
// //         <>
// //           <p>תאריך יצירה: {formatDate(infoItem.created_at)}</p>
// //           {infoItem.updated_at && <p>תאריך עדכון: {formatDate(infoItem.updated_at)}</p>}
// //         </>
// //       }
// //     >
// //       <IconButton size="small">
// //         <InfoIcon size={18} />
// //       </IconButton>
// //     </Tooltip>
// //     {/* <IconButton size="small" onClick={(e) => handleDelete(e, infoItem.id)}>
// //       <TrashIcon size={18} />
// //     </IconButton> */}
// //   </Box>
// // </Box>

// //         ))}
// //         <Dialog
// //   open={detailsDialogOpen}
// //   onClose={() => setDetailsDialogOpen(false)}
// //   fullWidth
// //   maxWidth="sm"
// // >
// //   <DialogTitle>פרטי פריט</DialogTitle>
// //   <DialogContent>
// //     {selectedItemDetails && (
// //       <Box display="flex" flexDirection="column" gap={2}>
// //         <img
// //           src={selectedItemDetails.imageURL}
// //           alt={selectedItemDetails.title}
// //           style={{ width: "100%", borderRadius: 8 }}
// //         />
// //         <h3>{selectedItemDetails.title}</h3>
// //         <p>{selectedItemDetails.description}</p>
// //         {selectedItemDetails.imageURL && (
// //           <a href={selectedItemDetails.imageURL} target="_blank" rel="noopener noreferrer">
// //             {selectedItemDetails.imageURL}
// //           </a>
// //         )}
// //       </Box>
// //     )}
// //   </DialogContent>
// //   <DialogActions>
// //     <Button onClick={() => {
// //       setDetailsDialogOpen(false);
// //       if (selectedItemDetails) {
// //         setEditingInfoItem(selectedItemDetails);
// //       }
// //     }} color="primary" variant="outlined">
// //       ✏️ עדכון
// //     </Button>
// //     <Button
// //       onClick={(e) => {
// //         if (selectedItemDetails) {
// //           handleDelete(e as any, selectedItemDetails.id);
// //           setDetailsDialogOpen(false);
// //         }
// //       }}
// //       color="error"
// //       variant="contained"
// //     >
// //       🗑 מחיקה
// //     </Button>
// //   </DialogActions>
// // </Dialog>

// //         </Box>
// //         {/* <Menu
// //           anchorEl={anchorEl}
// //           open={open}
// //           onClose={handleMenuClose}
// //           anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
// //           transformOrigin={{ vertical: 'top', horizontal: 'right' }}
// //         >
// //           <MenuItem
// //             onClick={() => {
// //               const infoItemToEdit = infoItems.find(InfoItem => InfoItem.id === selectedInfoItemId);
// //               if (infoItemToEdit) {
// //                 setEditingInfoItem(infoItemToEdit);
// //               }
// //               handleMenuClose();
// //             }}
// //           >
// //             ✏️ עריכה
// //           </MenuItem>
// //           <MenuItem onClick={handleDelete}>🗑 מחיקה</MenuItem>
// //         </Menu> */}

// //       {editingInfoItem && (
// //         <EditInfoCarouselForm
// //         infoItem={editingInfoItem}
// //         onClose={() => setEditingInfoItem(null)}
// //         onSuccess={() => setEditingInfoItem(null)}
// //         />
// //       )}
// //       {openModel && (
// //         <AddInfoCarouselForm
// //           onClose={() => setOpenModel(false)}
// //           onSuccess={() => setOpenModel(false)}
// //         />
// //       )}
// //     </>
// //   );
// // };
// // export default InfoCarouselAdminTable;

// // InfoCarouselAdminTable.tsx
// import React, { useState } from 'react';
// import {
//   Box, Button, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText,
//   DialogTitle, IconButton, MenuItem, Paper, Select, TextField, Tooltip
// } from '@mui/material';
// import { InfoIcon } from 'lucide-react';
// import { useGetAllInfoCarouselQuery, useDeleteInfoCarouselMutation } from '../../../../home/infoCarouselApi';
// import { InfoItem } from '../../../../home/homeTypes';
// import EditInfoCarouselForm from './EditInfoCarouselForm';
// import AddInfoCarouselForm from './AddInfoCarouselForm';
// import { styles } from '../../../../../styles/carousel/admin/carouselTable.style';

// const InfoCarouselAdminTable: React.FC = () => {
//   const { data: infoItems = [], isLoading, error } = useGetAllInfoCarouselQuery(undefined, {
//     refetchOnMountOrArgChange: true,
//     refetchOnReconnect: true,
//     pollingInterval: 3000
//   });
//   const [deleteInfoItem] = useDeleteInfoCarouselMutation();

//   const [selectedInfoItemId, setSelectedInfoItemId] = useState<string | null>(null);
//   const [editingInfoItem, setEditingInfoItem] = useState<InfoItem | null>(null);
//   const [openModel, setOpenModel] = useState(false);
//   const [textToSearch, setTextToSearch] = useState("");
//   const [sortField, setSortField] = useState<'title' | 'created_at' | 'updated_at'>('title');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
//   const [selectedItemDetails, setSelectedItemDetails] = useState<InfoItem | null>(null);

//   const filteredItems = infoItems.filter((item) =>
//     item.title.toLowerCase().includes(textToSearch.toLowerCase()));

// const sortedItems = filteredItems.sort((a, b) => {
//   const aVal: string | number = sortField === 'title' ? a.title : new Date(a[sortField] ?? 0).getTime();
//   const bVal: string | number = sortField === 'title' ? b.title : new Date(b[sortField] ?? 0).getTime();

//   if (typeof aVal === 'string' && typeof bVal === 'string') {
//     return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
//   }

//   if (typeof aVal === 'number' && typeof bVal === 'number') {
//     return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
//   }

//   return 0; // fallback במקרה של טיפוס שונה
// });

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return '';
//     const d = new Date(dateString);
//     return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
//   };

//   const handleDelete = async () => {
//     if (selectedInfoItemId) {
//       await deleteInfoItem(selectedInfoItemId).unwrap();
//       setDeleteDialogOpen(false);
//       setSelectedInfoItemId(null);
//     }
//   };

//   if (isLoading) return <p>טוען...</p>;
//   if (error) return <p>שגיאה בטעינה</p>;

//   return (
//     <>
//       <Button variant="contained" onClick={() => setOpenModel(true)}>➕ הוספת פריט חדש</Button>
//       {/* <input placeholder='🔍 טקסט לחיפוש'  /> */}
//       <TextField id="outlined-basic" label="🔍 טקסט לחיפוש" variant="outlined" onChange={(e) => setTextToSearch(e.target.value)} />

//       <Box sx={styles.mainContainer}>
//         <Select value={sortField} onChange={(e) => setSortField(e.target.value as any)} size="small">
//           <MenuItem value="title">כותרת</MenuItem>
//           <MenuItem value="created_at">תאריך יצירה</MenuItem>
//           <MenuItem value="updated_at">תאריך עדכון</MenuItem>
//         </Select>
//         <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} size="small">
//           <MenuItem value="asc">סדר עולה</MenuItem>
//           <MenuItem value="desc">סדר יורד</MenuItem>
//         </Select>
//       </Box>

//       <Box sx={styles.mainContainer} component={Paper}>
//         {sortedItems.map(item => (
//           <Box
//             key={item.id}
//             sx={styles.imageWrapper}
//             onClick={() => {
//               setSelectedItemDetails(item);
//               setDetailsDialogOpen(true);
//             }}
//           >
//             <Box sx={styles.title}>{item.title}</Box>
//             <CardMedia
//               component="img"
//               image={item.imageURL}
//               alt={item.title}
//               sx={styles.itemImage}
//             />
//           </Box>
//         ))}
//       </Box>

//       {/* Dialogs */}
//       <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} fullWidth maxWidth="sm">
//         <DialogTitle>פרטי פריט</DialogTitle>
//         <DialogContent>
//           {selectedItemDetails && (
//             <Box display="flex" flexDirection="column" gap={2}>
//               <h3>{selectedItemDetails.title}</h3>
//               <p>{selectedItemDetails.description}</p>
//               <img src={selectedItemDetails.imageURL} alt={selectedItemDetails.title} style={{ width: "100%", borderRadius: 8 }} />
//               <a href={selectedItemDetails.referenceLinkURL} target="_blank" rel="noopener noreferrer">{selectedItemDetails.referenceLinkURL}</a>
//               <p><strong>תאריך יצירה:</strong> {formatDate(selectedItemDetails.created_at)}</p>
//               {selectedItemDetails.updated_at && <p><strong>תאריך עדכון:</strong> {formatDate(selectedItemDetails.updated_at)}</p>}
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => { setDetailsDialogOpen(false); if (selectedItemDetails) setEditingInfoItem(selectedItemDetails); }} color="primary">✏️ עדכון</Button>
//           <Button onClick={() => { if (selectedItemDetails) { setSelectedInfoItemId(selectedItemDetails.id); setDeleteDialogOpen(true); setDetailsDialogOpen(false); } }} color="error">🗑 מחיקה</Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
//         <DialogTitle>אישור מחיקה</DialogTitle>
//         <DialogContent>
//           <DialogContentText>האם את בטוחה שברצונך למחוק את הפריט? פעולה זו אינה ניתנת לשחזור.</DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialogOpen(false)}>ביטול</Button>
//           <Button onClick={handleDelete} color="error" variant="contained">מחיקה</Button>
//         </DialogActions>
//       </Dialog>

//       {editingInfoItem && <EditInfoCarouselForm infoItem={editingInfoItem} onClose={() => setEditingInfoItem(null)} onSuccess={() => setEditingInfoItem(null)} />}
//       {openModel && <AddInfoCarouselForm onClose={() => setOpenModel(false)} onSuccess={() => setOpenModel(false)} />}
//     </>
//   );
// };

// export default InfoCarouselAdminTable;
// InfoCarouselAdminTable.tsx
