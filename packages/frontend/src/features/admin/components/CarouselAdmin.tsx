import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import InfoCarouselAdminTable from './carouselAdmin/infoCarouselAdmin/InfoCarouselAdminTable';
import ProjectCarouselAdminTable from './carouselAdmin/projectCarouselAdmin/ProjectCarouselAdminTable';
import LogoCarouselAdminTable from './carouselAdmin/logoCarouselAdmin/LogoCarouselAdminTable';
import TipesCarouselAdminTable from './carouselAdmin/tipesCarouselAdmin/TipesCarouselAdminTable';
import {styles} from '../../../styles/carousel/admin/carouselAdmin.style'

const CarouselAdmin = () => {
  const [active, setActive] = useState<'info' | 'projects' | 'logos' |'tipes' | null>(null);

  return (
    <Box sx={styles.navContainer}>
      <Box sx={styles.mainContainer}>
        <Button
          variant={active === 'info' ? 'contained' : 'outlined'}
          onClick={() => {setActive('info')}}
          className={active === 'info' ? 'active' : ''}
          sx={{
            ...styles.navItems,
            ...styles.button,

          }}
        >
          קרוסלת מידע
        </Button>
        <Button
          variant={active === 'projects' ? 'contained' : 'outlined'}
          onClick={() => setActive('projects')}
          className={active === 'projects' ? 'active' : ''}
          sx={{
            ...styles.navItems,
            ...styles.button,
          }}
        >
          קרוסלת פרויקטים
        </Button>
        <Button
          variant={active === 'tipes' ? 'contained' : 'outlined'}
          onClick={() => setActive('tipes')}
          className={active === 'tipes' ? 'active' : ''}
          sx={{
            ...styles.navItems,
            ...styles.button,
          }}
        >
          קרוסלת טיפים
        </Button>
        <Button
          variant={active === 'logos' ? 'contained' : 'outlined'}
          onClick={() => setActive('logos')}
          sx={{
            ...styles.navItems,
            ...styles.button,
          }}
        >
          קרוסלת לוגואים
        </Button>
      </Box>

      {active === 'tipes' && <TipesCarouselAdminTable />}
      {active === 'info' && <InfoCarouselAdminTable />}
      {active === 'projects' && <ProjectCarouselAdminTable />}
      {active === 'logos' && <LogoCarouselAdminTable />}
    </Box>
  );
};

export default CarouselAdmin;