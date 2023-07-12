import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Checkbox,
  TextField,
  FormControlLabel,
  Box,
  Grid,
  Pagination,
  Typography,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/Store";
import { getAllVacationsAction } from "../redux/VacationReducer";
import { api } from "../utils/dbURL_key";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NotStartedIcon from "@mui/icons-material/NotStarted";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import VacationCard from "./VacationCard";
import { useTheme } from "@mui/material/styles";

interface CheckState {
  favorites: boolean;
  notStarted: boolean;
  inProgress: boolean;
}

const VacationList = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const vacationsState = useSelector(
    (state: RootState) => state.vacations.vacations
  );
  const followers = useSelector((state: RootState) => state.follows.follows);
  const currentUser = useSelector((state: RootState) => state.users.user);
  const user = useSelector((state: RootState) => state.users.user);
  const itemsPerPage = 10;
  const isAdmin = user?.level === 1 ? true : false;

  const sortedVacations = [...vacationsState].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const [checked, setChecked] = useState<CheckState>({
    favorites: false,
    notStarted: false,
    inProgress: false,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked({ ...checked, [event.target.name]: event.target.checked });
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery, checked]);

  const currentDate = new Date().toISOString();

  let filteredVacations = sortedVacations;

  if (checked.favorites || checked.notStarted || checked.inProgress) {
    filteredVacations = sortedVacations.filter((vacation) => {
      const isFavorited = followers.some(
        (follow) =>
          follow.vacationId === vacation.id && follow.userId === currentUser?.id
      );
      const hasNotStarted =
        new Date(vacation.startDate) > new Date(currentDate);
      const isInProgress =
        new Date(vacation.startDate) <= new Date(currentDate) &&
        new Date(vacation.endDate) >= new Date(currentDate);

      return (
        (checked.favorites && isFavorited) ||
        (checked.notStarted && hasNotStarted) ||
        (checked.inProgress && isInProgress)
      );
    });
  }

  const searchedVacations = filteredVacations.filter((vacation) =>
    vacation.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const getVacations = async () => {
      try {
        const response = await api.get("/vacations");
        console.log(response);
        if (response.status === 200) {
          dispatch(getAllVacationsAction(response.data));
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    getVacations();
  }, [dispatch]);

  const paginatedVacations = searchedVacations.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div>
      {!isAdmin && (
        <Box
          component="form"
          sx={{
            mb: 5,
            display: "flex",
            justifyContent: "space-between",
            "& > :not(style)": { m: 1.5 },
          }}>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked.favorites}
                  onChange={handleChange}
                  name="favorites"
                  icon={<FavoriteIcon />}
                  checkedIcon={<FavoriteIcon />}
                  color={checked.favorites ? "warning" : "default"}
                />
              }
              label="Favorites"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked.notStarted}
                  onChange={handleChange}
                  name="notStarted"
                  icon={<NotStartedIcon />}
                  checkedIcon={<NotStartedIcon />}
                  color={checked.notStarted ? "warning" : "default"}
                />
              }
              label="Not Started"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked.inProgress}
                  onChange={handleChange}
                  name="inProgress"
                  icon={<EventAvailableIcon />}
                  checkedIcon={<EventAvailableIcon />}
                  color={checked.inProgress ? "warning" : "default"}
                />
              }
              label="In Progress"
            />
          </Box>
          <TextField
            id="search"
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearch}
            sx={{ background: "whitesmoke" }}
          />
        </Box>
      )}
      <Grid
        container
        sx={{
          display: "flex",
          flexWrap: "wrap",
          mt: 5,
          justifyContent: "center",
          gap: 2,
        }}>
        {paginatedVacations.map((vacation) => (
          <VacationCard key={vacation.id} vacation={vacation} />
        ))}
      </Grid>

      {paginatedVacations.length > 0 ? (
        <Pagination
          sx={{
            mb: 5,
            mr: 8,
            display: "flex",
            justifyContent: "end",
            "& .MuiPaginationItem-root": {
              backgroundColor: "whitesmoke", // change to your preferred color
            },
            "& .Mui-selected": {
              backgroundColor: "blue", // change to your preferred color for the selected item
            },
            "& .MuiPaginationItem-root:hover": {
              backgroundColor: "lightgray", // change to your preferred color for the hovered item
            },
          }}
          className="pagination"
          count={Math.ceil(searchedVacations.length / itemsPerPage)}
          page={page}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
        />
      ) : (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h4" align="center">
            No vacations to show
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default VacationList;
