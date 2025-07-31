import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Job } from "../../../types/jobsTypes";
import { useLazyGetFilteredJobsQuery } from "../jobsApi";

interface SearchBarProps {
  onSearchResults: (results: Job[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchResults }) => {
  const [userSearch, setUserSearch] = useState("");
  const [field, setField] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [triggerFilteredJobs, { data, isLoading }] = useLazyGetFilteredJobsQuery();

  useEffect(() => {
    const dateFromFormatted = dateFrom ? dateFrom : undefined;
    triggerFilteredJobs({
      search: userSearch,
      field,
      jobType,
      location,
      ...(dateFromFormatted ? { dateFrom: dateFromFormatted } : {}),
    });
  }, [userSearch, field, jobType, location, dateFrom, triggerFilteredJobs]);

  useEffect(() => {
    if (data) {
      onSearchResults(data);
      setNotFound(data.length === 0);
    }
  }, [data, onSearchResults]);

  const resetFilters = () => {
    setUserSearch("");
    setField("");
    setJobType("");
    setLocation("");
    setDateFrom("");
  };

  return (
    <div className="searchbar-wrapper">
      <style>{`
        .searchbar-wrapper {
          background-color: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
          justify-content: space-between;
        }

        .searchbar-input-group {
          display: flex;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 8px 12px;
          background-color: #f9fafb;
          min-width: 180px;
          flex-grow: 1;
        }

        .searchbar-input-group input {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          font-size: 14px;
        }

        .searchbar-select,
        .searchbar-date {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #ddd;
          background-color: #f9fafb;
          font-size: 14px;
          min-width: 160px;
        }

        .searchbar-button {
          background: linear-gradient(135deg, #5b2d7a 0%, #442063 100%);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 18px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.2s;
        }

        .searchbar-button:hover {
          background: linear-gradient(135deg, #442063 0%, #2e1047 100%);
        }

        .searchbar-notfound {
          color: #e11d48;
          margin-top: 12px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .searchbar-wrapper {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>

      <div className="searchbar-input-group">
        <Search size={18} style={{ marginLeft: "8px", color: "#6b7280" }} />
        <input
          type="text"
          placeholder="חיפוש לפי שם משרה..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />
      </div>

      <select
        value={field}
        onChange={(e) => setField(e.target.value)}
        className="searchbar-select"
      >
        <option value="">תחום</option>
        <option value="פיתוח">פיתוח</option>
        <option value="עיצוב">עיצוב</option>
        <option value="שיווק">שיווק</option>
      </select>

      <select
        value={jobType}
        onChange={(e) => setJobType(e.target.value)}
        className="searchbar-select"
      >
        <option value="">סוג משרה</option>
        <option value="מרחוק">מרחוק</option>
        <option value="משרד">משרד</option>
        <option value="היברידי">היברידי</option>
      </select>

      <input
        type="text"
        placeholder="עיר/מיקום..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="searchbar-select"
      />

      <input
        type="date"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        className="searchbar-date"
      />

      <button onClick={resetFilters} className="searchbar-button">
        איפוס
      </button>

      {isLoading && <p>טוען משרות...</p>}
    </div>
  );
};

export default SearchBar;
