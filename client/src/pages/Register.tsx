import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/anton-lokianov">
        Anton Lokianov
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const backgroundImages = [
  "https://wallpaper.dog/large/5550890.jpg",
  "https://wallpapers.com/images/featured/wzdpjdlafduou991.jpg",
  "https://images2.alphacoders.com/458/thumb-1920-458495.jpg",
];

const theme = createTheme();

export default function Register() {
  const [backgroundImage, setBackgroundImage] = useState(backgroundImages[0]);
  const navigate = useNavigate();
  const [emailValue, setEmailValue] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    const changeBackground = () => {
      const currentImageIndex = backgroundImages.indexOf(backgroundImage);
      const nextImageIndex = (currentImageIndex + 1) % backgroundImages.length;
      setBackgroundImage(backgroundImages[nextImageIndex]);
    };
    const interval = setInterval(changeBackground, 3000);
    return () => clearInterval(interval);
  }, [backgroundImage]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    trigger,
    clearErrors,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post("http://localhost:4000/auth/register", {
        ...data,
      });
      console.log(response);
      if (response.status === 201) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Typography
            variant="h3"
            noWrap
            sx={{
              mt: 5,
              display: "flex",
              justifyContent: "center",
              fontFamily: "monospace",
              fontWeight: 600,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}>
            Elite Vacations
          </Typography>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sing Up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}>
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                rules={{
                  required: "First name is required",
                  minLength: {
                    value: 2,
                    message: "First name must be at least 2 characters",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoComplete="firstName"
                    autoFocus
                    error={Boolean(errors.firstName)}
                    helperText={
                      errors.firstName && String(errors.firstName.message)
                    }
                  />
                )}
              />
              <Controller
                name="lastName"
                control={control}
                defaultValue=""
                rules={{
                  required: "Last name is required",
                  minLength: {
                    value: 2,
                    message: "Last name must be at least 2 characters",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lastName"
                    error={Boolean(errors.lastName)}
                    helperText={
                      errors.lastName && String(errors.lastName.message)
                    }
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={(e) => {
                      field.onChange(e); // Preserve the original onChange behavior
                      setEmailValue(e.target.value); // Update the email value
                    }}
                    error={Boolean(errors.email) || Boolean(emailError)}
                    helperText={
                      (errors.email && String(errors.email.message)) ||
                      emailError
                    }
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 2,
                    message: "Password must be at least 2 characters",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    error={Boolean(errors.password)}
                    helperText={
                      errors.password && String(errors.password.message)
                    }
                  />
                )}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}>
                Sing Up
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/" variant="body2">
                    {"Have an account? Sign In"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
