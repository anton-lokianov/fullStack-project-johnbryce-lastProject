import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Page404 = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}>
      <Typography variant="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Oops! Page not found.
      </Typography>
      <Typography variant="body1" gutterBottom>
        We couldn't find the page you were looking for.
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" onClick={() => navigate("/home")}>
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default Page404;
