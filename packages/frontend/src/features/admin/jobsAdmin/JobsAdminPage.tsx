
import React, { useState } from 'react';
import CreateJobModal from './CreateJobModal';
import JobsAdminTable from './JobsAdminTable';

const JobsAdminPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div style={{ direction: "rtl", padding: "20px" ,textAlign:"center"}}>
      <h1>🔧 ניהול משרות</h1>
      <button onClick={handleOpenModal} style={{ marginBottom: "20px" }}>
        הוספת משרה
      </button>

      <JobsAdminTable />

      {isModalOpen && <CreateJobModal onClose={handleCloseModal} />}
    </div>
  );
};

export default JobsAdminPage;
