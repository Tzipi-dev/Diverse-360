import { useState, useEffect, useRef, useCallback } from "react";
import CourseCard from "./components/CourseCard";
import { useGetAllCoursesQuery } from "./coursesApi";
import { Course, OPTIONS } from "../../types/coursesTypes";
import {
  Button,
  CircularProgress,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Drawer,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

import { useAddScreenAnalyticsMutation } from "../admin/analyticsApi";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const CoursesPage = () => {
  const { data: AllCourses, isLoading } = useGetAllCoursesQuery();
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Array<Course>>([]);
  const [status, setStatus] = useState<OPTIONS>({ status: "ALL" });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLecturers, setSelectedLecturers] = useState<string[]>([]);
  const [sortByDate, setSortByDate] = useState<string>("");
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

  // ✅ ניטור זמן מסך
  const [addAnalyticsMutation] = useAddScreenAnalyticsMutation();
  const user_id = useSelector((state: RootState) => state.auth.user?.id);
  const enterTimeRef = useRef(Date.now());

  // יצירת פונקציה יציבה עם useCallback
  const addAnalytics = useCallback(
    (data: { user_id: string; path: string; duration: number }) => {
      addAnalyticsMutation(data);
    },
    [addAnalyticsMutation]
  );

  // רספונסיביות
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    enterTimeRef.current = Date.now();
    return () => {
      const duration = Date.now() - enterTimeRef.current;
      if (user_id && duration > 1000) {
        addAnalytics({
          user_id,
          path: "CoursesPage",
          duration,
        });
      }
    };
  }, [addAnalytics, user_id]);

  // Debounce search effect
  // REMOVE the debounce useEffect

  const getFilterLabelStyle = (id: string): React.CSSProperties => ({
    padding: "6px 10px",
    borderRadius: "8px",
    transition: "background-color 0.3s, color 0.3s",
    cursor: "pointer",
    display: "inline-block",
    backgroundColor: hoveredFilter === id ? "#f9f9f9" : "transparent",
    color: hoveredFilter === id ? "black" : "inherit",
  });

  const handleChange = (forSearch: string): void => {
    setQuery(forSearch);
  };

  const handleSearch = () => {
    const searchWords = query.trim().toLowerCase().split(" ");
    const filtered = AllCourses?.filter((item) =>
      searchWords.some(
        (word) =>
          item.title.toLowerCase().includes(word) ||
          item.description?.toLowerCase().includes(word) ||
          item.subject.toLowerCase().includes(word)
      )
    );
    setResults(filtered ?? []);
    setStatus({ status: "SEARCH" });
  };

  const handleReset = () => {
    setStatus({ status: "ALL" });
    setSelectedCategories([]);
    setSelectedLecturers([]);
    setSortByDate("");
    setQuery("");
  };

  const applyFilters = (
    categories: string[],
    lecturers: string[],
    date: string
  ) => {
    let filtered = AllCourses ?? [];
    if (query) {
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (categories.length > 0) {
      filtered = filtered.filter((course) =>
        categories.includes(course.subject)
      );
    }
    if (lecturers.length > 0) {
      filtered = filtered.filter((course) =>
        lecturers.includes(course.lecturer)
      );
    }
    if (date) {
      filtered = filtered.filter(
        (course) => new Date(course.uploadedAt) >= new Date(date)
      );
    }

    setResults(filtered);
    setStatus({ status: "SEARCH" });
  };

  const FilterSection = () => (
    <div style={{ direction: "rtl" }}>
      {/* Search Section for Mobile */}
      {["נושא", "מרצה", "תאריך"].map((filterType, index) => (
        <Accordion
          key={index}
          expanded={expandedAccordion === filterType}
          onChange={(_, isExpanded) => setExpandedAccordion(isExpanded ? filterType : false)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              "&:hover": {
                background: "#442063",
                color: "white",
                transition: "0.3s",
                borderRadius: "4px",
              },
            }}
          >
            <p style={{ fontWeight: "bold", margin: 0 }}>
              {`סינון לפי ${filterType}`}
            </p>
          </AccordionSummary>
          <AccordionDetails
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              textAlign: "right",
            }}
          >
            {filterType === "נושא" &&
              Array.from(new Set(AllCourses?.map((c) => c.subject))).map(
                (category) => (
                  <label
                    key={category}
                    style={getFilterLabelStyle(category)}
                    onMouseEnter={() => setHoveredFilter(category)}
                    onMouseLeave={() => setHoveredFilter(null)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => {
                        const newSelection = selectedCategories.includes(
                          category
                        )
                          ? selectedCategories.filter((c) => c !== category)
                          : [...selectedCategories, category];
                        setSelectedCategories(newSelection);
                        applyFilters(newSelection, selectedLecturers, sortByDate);
                        setExpandedAccordion("נושא"); // Keep open
                      }}
                      style={{ marginLeft: "6px" }}
                    />
                    {category}
                  </label>
                )
              )}

            {filterType === "מרצה" &&
              Array.from(new Set(AllCourses?.map((c) => c.lecturer))).map(
                (lecturer) => (
                  <label
                    key={lecturer}
                    style={getFilterLabelStyle(lecturer)}
                    onMouseEnter={() => setHoveredFilter(lecturer)}
                    onMouseLeave={() => setHoveredFilter(null)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedLecturers.includes(lecturer)}
                      onChange={() => {
                        const newSelection = selectedLecturers.includes(
                          lecturer
                        )
                          ? selectedLecturers.filter((l) => l !== lecturer)
                          : [...selectedLecturers, lecturer];
                        setSelectedLecturers(newSelection);
                        applyFilters(selectedCategories, newSelection, sortByDate);
                        setExpandedAccordion("מרצה"); // Keep open
                      }}
                      style={{ marginLeft: "6px" }}
                    />
                    {lecturer}
                  </label>
                )
              )}

            {filterType === "תאריך" && (
              <TextField
                label="הצג קורסים מתאריך זה"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={sortByDate}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  setSortByDate(selectedDate);
                  applyFilters(selectedCategories, selectedLecturers, selectedDate);
                  setExpandedAccordion("תאריך"); // Keep open
                }}
              />
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      <Button
        fullWidth
        onClick={() => {
          setSelectedLecturers([]);
          setSelectedCategories([]);
          setSortByDate("");
          applyFilters([], [], "");
        }}
        sx={{
          marginTop: "0.5rem",
          backgroundColor: "#442063",
          transition: "all 0.3s ease",
          border: "1px solid blue",
          borderRadius: "8px",
          padding: "7px 16px",
          color: "white",
          "&:hover": {
            background: "white",
            color: "#442063",
          },
        }}
      >
        איפוס
      </Button>
    </div>
  );

  if (isLoading) return <CircularProgress color="success" />;

  const coursesToShow = status.status === "ALL" ? AllCourses : results;

  return (
    <div style={{ direction: "rtl" }}>
      <div
        style={{
          backgroundImage: 'url("/images/home.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "2rem 1rem",
          borderBottom: "4px solid #ccc",
          height: isMobile ? "34vh" : "50vh",
          marginTop: "-80px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h1
            style={{
              marginBottom: "0.5rem",
              color: "white",
              marginTop: isMobile ? "140px" : "100px",
            }}
          >
            ספריית קורסים והדרכות
          </h1>
          <h3 style={{ color: "white", fontWeight: "normal" }}>
            לימוד עצמאי, מתי שנח לך
          </h3>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            marginTop: "10vh",
          }}
        >
          {/* Search Section - Hidden on Mobile */}
          {!isMobile && (
            <>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "30px",
                  display: "flex",
                  alignItems: "center",
                  padding: "0.2rem 1rem",
                  width: "50%",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              >
                <SearchIcon style={{ color: "#888", marginLeft: "0.5rem" }} />
                <TextField
                  type="text"
                  value={query}
                  placeholder="חפש קורס לפי מילת מפתח..."
                  onChange={(e) => handleChange(e.target.value)}
                  variant="standard"
                  fullWidth
                  InputProps={{ disableUnderline: true }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
              </div>
              <button
                onClick={handleSearch}
                style={{
                  borderRadius: "30px",
                  padding: "0.5rem 2rem",
                  backgroundColor: "#e0e0e0",
                  color: "black",
                }}
              >
                חיפוש
              </button>
              <button
                onClick={handleReset}
                style={{
                  borderRadius: "30px",
                  padding: "0.5rem 2rem",
                  backgroundColor: "#e0e0e0",
                  color: "black",
                }}
              >
                אפס
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div
            style={{
              width: "20%",
              padding: "1rem",
              boxSizing: "border-box",
              paddingTop: "7vh",
              backgroundColor: "rgb(243, 243, 243)",
            }}
          >
            <FilterSection />
          </div>
        )}

        {/* Mobile Filter Button */}
        {isMobile && (
          <div
            style={{
              width: "20%",
              padding: "1rem",
              boxSizing: "border-box",
              paddingTop: "7vh",
              backgroundColor: "rgb(243, 243, 243)",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <IconButton
              onClick={() => {
                setMobileMenuOpen(true);
              }}
              sx={{
                backgroundColor: "#442063",
                color: "white",
                "&:hover": {
                  backgroundColor: "#331a4a",
                },
              }}
            >
              <FilterListIcon />
            </IconButton>
          </div>
        )}

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            anchor="right"
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            PaperProps={{
              sx: {
                width: "80%",
                maxWidth: "300px",
                padding: "1rem",
                direction: "rtl",
              },
            }}
          >
            <Box sx={{ position: "relative" }}>
              <IconButton
                onClick={() => setMobileMenuOpen(false)}
                sx={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  zIndex: 1,
                }}
              >
                <CloseIcon />
              </IconButton>
              <div style={{ marginTop: "50px" }}>
                {/* תיבת החיפוש במובייל - עכשיו כאן בראש Drawer */}
                <div style={{ marginBottom: "2rem" }}>
                  <h3 style={{ marginBottom: "1rem", textAlign: "center" }}>חיפוש</h3>
                  <div
                    style={{
                      backgroundColor: "white",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      padding: "0.5rem 1rem",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      marginBottom: "1rem",
                    }}
                  >
                    <SearchIcon style={{ color: "#888", marginLeft: "0.5rem" }} />
                    <TextField
                      type="text"
                      value={query}
                      placeholder="חפש קורס לפי מילת מפתח..."
                      onChange={(e) => handleChange(e.target.value)}
                      variant="standard"
                      fullWidth
                      InputProps={{ disableUnderline: true }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                    <Button
                      onClick={handleSearch}
                      variant="contained"
                      sx={{
                        backgroundColor: "#442063",
                        "&:hover": { backgroundColor: "#331a4a" },
                      }}
                    >
                      חיפוש
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outlined"
                      sx={{
                        borderColor: "#442063",
                        color: "#442063",
                        "&:hover": {
                          borderColor: "#331a4a",
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      אפס
                    </Button>
                  </div>
                </div>
                <FilterSection />
              </div>
            </Box>
          </Drawer>
        )}

        <div
          style={{
            width: isMobile ? "80%" : "75%",
            padding: "1rem",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: isMobile ? "flex-start" : "space-around",
            flexWrap: isMobile ? "nowrap" : "wrap",
            marginBottom: "20vh",
            marginTop: "0",
            gap: isMobile ? "1rem" : "0",
          }}
        >
          {!coursesToShow || coursesToShow.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              לא נמצאו קורסים התואמים לחיפוש.
            </p>
          ) : (
            coursesToShow.map((course) => (
              <div 
                key={course.id} 
                style={{ 
                  marginBottom: isMobile ? "1rem" : "1.5rem",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                <CourseCard course={course} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;