import React from "react";
import { Job } from "../../../types/jobsTypes";

interface Props {
  jobs: Job[];
}

const SuggestedJobsList: React.FC<Props> = ({ jobs }) => {
  if (jobs.length === 0) return null;

  return (
    <div style={{ marginTop: "25px" }}>
      <h4 style={{ color: "#e83e8c", marginBottom: "15px" }}>
        משרות שמצאנו לך:
      </h4>
      <div style={{
        maxHeight: "200px",
        overflowY: "auto",
        border: "1px solid #e5e7eb",
        borderRadius: "8px"
      }}>
        {jobs.map((job) => (
          <div key={job.id} style={{
            padding: "12px",
            borderBottom: "1px solid #f3f4f6",
            fontSize: "14px"
          }}>
            {job.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedJobsList;
