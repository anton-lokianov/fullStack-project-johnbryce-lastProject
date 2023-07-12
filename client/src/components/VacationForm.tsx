import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import { FormControl } from "@mui/joy";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Vacation } from "../models/Vacation";
import { RootState, store } from "../redux/Store";
import {
  addVacationAction,
  updateVacationAction,
} from "../redux/VacationReducer";
import { api } from "../utils/dbURL_key";

export function VacationForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [vacationValue, setVacationValue] = useState<Vacation | null>(null);
  const [selectedImage, setSelectedImage] = useState(vacationValue?.image);
  const navigate = useNavigate();
  const isUpdate = id ? true : false;
  const vacations = useSelector(
    (state: RootState) => state.vacations.vacations
  );

  const displayImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setSelectedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const dateFormat = (date: string) => {
    return date.split("T")[0];
  };

  useEffect(() => {
    if (vacationValue && vacationValue.image) {
      setSelectedImage(`http://localhost:4000/assets/${vacationValue.image}`);
    }
  }, [vacationValue]);

  useEffect(() => {
    if (!isUpdate) return;
    const vacationToUpdate = vacations.find(
      (vacation: Vacation) => vacation.id === Number(id)
    );

    if (vacationToUpdate) {
      const formattedVacation = {
        ...vacationToUpdate,
        startDate: dateFormat(vacationToUpdate.startDate),
        endDate: dateFormat(vacationToUpdate.endDate),
      };

      Object.entries(formattedVacation).forEach(([key, value]) => {
        setValue(key, value);
      });

      setVacationValue(formattedVacation);
    }
  }, [id, vacations, setValue]);

  const prepareFormData = (data: any) => {
    const formData = new FormData();
    formData.append("destination", data.destination);
    formData.append("description", data.description);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append("price", data.price);
    formData.append(
      "image",
      typeof data.image === "string" ? data.image : data.image[0]
    );
    return formData;
  };

  const onAdd = async (data: any) => {
    try {
      const formData = prepareFormData(data);
      const response = await api.post("/vacations", formData);
      const newVacation = response.data;
      store.dispatch(addVacationAction(newVacation));
      navigate("/home");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async (data: any) => {
    try {
      const formData = prepareFormData(data);
      const response = await api.put(`/vacations/${id}`, formData);
      const newVacation = response.data;
      store.dispatch(updateVacationAction(newVacation));
      navigate("/home");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: any) => {
    setLoading(true);

    if (id) {
      onUpdate(data);
    } else {
      onAdd(data);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center">
      <Container
        maxWidth="xs"
        sx={{
          border: "1px solid #ccc",
          borderRadius: 3,
          padding: 3,
          backgroundColor: "whitesmoke",
          mt: 5,
          mb: 5,
        }}>
        <Box className="VacationForm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl sx={{ width: "100%", gap: 1.3, padding: 1 }}>
              <Typography variant="h5" align="center">
                {id ? "Edit Vacation" : "Add Vacation"}
              </Typography>
              <TextField
                type="text"
                label="destination"
                variant="outlined"
                size="small"
                defaultValue={vacationValue?.destination}
                {...register("destination", {
                  required: "Destination is required",
                })}
                error={Boolean(errors.destination)}
              />
              <label>Start On</label>
              <TextField
                type="date"
                variant="outlined"
                size="small"
                defaultValue={vacationValue?.startDate}
                InputProps={{
                  inputProps: { min: isUpdate ? undefined : today },
                }}
                {...register("startDate", {
                  required: "Start Date is required",
                })}
                error={Boolean(errors.startDate)}
              />

              <label>Ends On</label>
              <TextField
                type="date"
                variant="outlined"
                size="small"
                defaultValue={vacationValue?.endDate}
                InputProps={{
                  inputProps: {
                    min: isUpdate ? undefined : watch("startDate") || today,
                  },
                }}
                {...register("endDate", {
                  required: "End Date is required",
                  validate: (value) =>
                    !watch("startDate") ||
                    new Date(value) >= new Date(watch("startDate")) ||
                    "Ends On must be after Starts On",
                })}
                error={Boolean(errors.endDate)}
              />
              <TextField
                label="description"
                variant="outlined"
                size="small"
                multiline
                minRows={4}
                maxRows={5}
                defaultValue={vacationValue?.description}
                {...register("description", {
                  required: "Description is required",
                })}
                error={Boolean(errors.description)}
              />
              <TextField
                type="number"
                label="price"
                variant="outlined"
                size="small"
                defaultValue={vacationValue?.price}
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price cannot be lower than 0" },
                  max: {
                    value: 10000,
                    message: "Price cannot be greater than 10000",
                  },
                })}
                error={Boolean(errors.price)}
              />
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  margin: 10,
                }}>
                <img
                  src={selectedImage}
                  id="displayUploadingImg"
                  alt=""
                  style={{ borderRadius: "10px", width: "100%" }}
                />
                <input
                  type="file"
                  id="imageUpload"
                  {...register("image", { required: !isUpdate })}
                  onChange={displayImg}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    opacity: 0,
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                    border: "2px dotted #000",
                  }}
                />
                <label
                  htmlFor="imageUpload"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "#000",
                    backgroundColor: "rgba(255, 255, 255, 0.8)", // Adjust the alpha value (0.8) for the desired transparency
                    padding: "10px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    border: "2px dotted #000",
                  }}>
                  {isUpdate ? "Change Image" : "Select Image"}
                </label>
              </div>
              {errors.file && (
                <span style={{ color: "red" }}>This field is required</span>
              )}
              <Button type="submit" variant="contained">
                {id ? "Edit" : "Add"}
              </Button>
              <Button
                onClick={() => navigate("/home")}
                variant="contained"
                color="secondary">
                Cancel
              </Button>
            </FormControl>
          </form>
        </Box>
      </Container>
    </Box>
  );
}
