import { Box } from "@mui/system";
import VacationList from "../components/VacationList";
import Hero from "../components/Hero";
import { Grid } from "@mui/material";

export const Home = () => {
  return (
    <Box sx={{ width: "100%", height: "100vh" }}>
      <Grid container sx={{ height: "100%" }}>
        <Grid item xs={12} md={4} sx={{ pr: { md: 2 } }}>
          <Hero />
        </Grid>
        <Grid item xs={12} md={8} sx={{ pl: { md: 2 } }}>
          <VacationList />
        </Grid>
      </Grid>
    </Box>
  );
};
