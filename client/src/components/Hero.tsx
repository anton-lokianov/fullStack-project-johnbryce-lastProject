import React from "react";
import { Box, Typography } from "@mui/material";

const Hero = () => {
  return (
    <Box
      sx={{
        height: "60vh",
        display: "flex",
        padding: "5rem 5rem",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: { xs: "flex-start", md: "center" },
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "sticky",
        top: 0,
      }}>
      <Typography
        variant="h1"
        sx={{ color: "#ffffff", textShadow: "2px 2px 4px #000000" }}>
        Welcome to Our Vacation Planner
      </Typography>
      <Typography
        variant="h5"
        sx={{ color: "#ffffff", textShadow: "2px 2px 4px #000000" }}>
        Discover and plan your next dream vacation
      </Typography>
    </Box>
  );
};

export default Hero;
