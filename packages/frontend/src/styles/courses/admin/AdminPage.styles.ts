export const linkBaseStyle = {
  fontWeight: 'normal',
  color: '#442063',
  textShadow: 'none',
  padding: '10px 18px 0 18px',  // הוספתי 10 פיקסל padding למעלה
  borderRadius: 8,
  background: 'none',
  transition: 'all 0.2s',
  textDecoration: 'none',
  cursor: 'pointer',
};

export const navStyle = {
  marginBottom: 40,
  marginTop: 20,                // הוספתי 20 פיקסל מרווח מעל הניווט
  display: 'flex',
  justifyContent: 'center',
  gap: 30,
  fontSize: 22,
};

export const getLinkStyle = (isActive: boolean) => ({
  ...linkBaseStyle,
  fontWeight: isActive ? 'bold' : 'normal',
  color: isActive ? '#442063' : '#18181b',
  textShadow: isActive ? '0 0 8px #44206399' : linkBaseStyle.textShadow,
  background: 'none',
  WebkitTextFillColor: isActive ? '#442063' : '#18181b',
});
