import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Badge } from "@mui/joy";
import { Checkbox } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Vacation } from "../models/Vacation";
import { RootState, store } from "../redux/Store";
import { deleteVacationAction } from "../redux/VacationReducer";
import { api } from "../utils/dbURL_key";
import DeleteVacation from "./DeleteVacation";
import { FollowVacation } from "../hooks/followVacation";

type VacationCardProps = {
  vacation: Vacation;
};

function VacationCard(props: VacationCardProps): JSX.Element {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const user = useSelector((state: RootState) => state.users.user);
  const isAdmin = user?.level === 1 ? true : false;
  const followers = useSelector((state: RootState) => state.follows.follows);
  const {
    addFollow,
    removeFollow,
    getAllFollowers,
    removeAllVacationFollowers,
  } = FollowVacation();
  const currentUserId = user?.id || 0;

  const dateFormat = (date: string) => {
    const [year, month, day] = date.split("T")[0].split("-");
    return `${day}-${month}-${year}`;
  };

  const isVacationFollowed = followers.some(
    (follow) =>
      follow.vacationId === props.vacation.id && follow.userId === currentUserId
  );

  const [isFollowing, setIsFollowing] = useState(isVacationFollowed);

  const followCount = followers.filter(
    (f) => f.vacationId === props.vacation.id
  ).length;

  useEffect(() => {
    getAllFollowers();
  }, []);

  const handleEditClick = () => {
    navigate(`/EditVacation/${props.vacation.id}`);
  };

  const handleDeleteOpen = () => {
    setOpen(true);
  };

  const handleDeleteClose = () => {
    setOpen(false);
    console.log("close");
  };

  const handleDelete = async () => {
    try {
      await removeAllVacationFollowers(props.vacation.id);
      const response = await api.delete(`/vacations/${props.vacation.id}`);

      if (response.status === 200) {
        store.dispatch(deleteVacationAction(props.vacation.id));
        setOpen(false);
      } else {
        throw new Error("Failed to delete vacation");
      }
    } catch (error: any) {
      console.log(error);
      throw new Error("Failed to delete vacation");
    }
  };

  return (
    <div className="VacationCard">
      <Card variant="outlined" sx={{ width: 330, minHeight: "450px" }}>
        <Typography level="h2" fontSize="lg" sx={{ mb: 0.2 }}>
          {props.vacation.destination}
        </Typography>
        <Typography level="body2">
          from <b>{dateFormat(props.vacation.startDate)}</b> to{" "}
          <b>{dateFormat(props.vacation.endDate)}</b>
        </Typography>
        <IconButton
          aria-label="bookmark Bahamas Islands"
          variant="plain"
          size="md"
          sx={{ position: "absolute", top: "0.8rem", right: "0.8rem" }}>
          {!isAdmin && (
            <Badge badgeContent={followCount} color="neutral" size="sm">
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                color="warning"
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: "2rem", // Adjust the size of the heart icon
                  },
                }}
                checked={isFollowing}
                onChange={async () => {
                  if (isFollowing) {
                    await removeFollow(currentUserId, props.vacation.id);
                  } else {
                    await addFollow(currentUserId, props.vacation.id);
                  }
                  setIsFollowing(!isFollowing);
                }}
              />
            </Badge>
          )}
        </IconButton>
        {isAdmin && (
          <IconButton
            aria-label="bookmark Bahamas Islands"
            variant="plain"
            size="md"
            sx={{ position: "absolute", top: "0.8rem", right: "0.6rem" }}
            onClick={handleDeleteOpen}>
            <DeleteIcon />
          </IconButton>
        )}
        <DeleteVacation
          open={open}
          handleClose={handleDeleteClose}
          handleDelete={handleDelete}
        />
        {isAdmin && (
          <IconButton
            aria-label="edit vacation"
            variant="plain"
            size="md"
            sx={{ position: "absolute", top: "0.8rem", right: "3rem" }}
            onClick={handleEditClick}>
            <EditIcon />
          </IconButton>
        )}
        <AspectRatio minHeight="200px" maxHeight="240px" sx={{ my: 1 }}>
          <img
            src={`http://localhost:4000/assets/${props.vacation.image}`}
            loading="lazy"
          />
        </AspectRatio>
        <Typography level="body1" sx={{ mb: 2 }}>
          {props.vacation.description}
        </Typography>
        <Box sx={{ display: "flex" }}>
          <div>
            <Typography level="body2">Total price:</Typography>
            <Typography fontSize="lg" fontWeight="lg">
              ${props.vacation.price}
            </Typography>
          </div>
          <Button
            variant="solid"
            size="sm"
            color="primary"
            aria-label="Explore Bahamas Islands"
            sx={{ ml: "auto", mr: 1, fontWeight: 600 }}>
            purchase
          </Button>
        </Box>
      </Card>
    </div>
  );
}

export default VacationCard;
