import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement } from "chart.js";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import { RootState } from "../redux/Store";

Chart.register(CategoryScale, LinearScale, BarElement);

export default function FollowersGraph() {
  const vacations = useSelector(
    (state: RootState) => state.vacations.vacations
  );
  const followers = useSelector((state: RootState) => state.follows.follows);

  const vacationsWithFollowersCount = vacations.map((vacation) => {
    const followersCount = followers.filter(
      (follow) => follow.vacationId === vacation.id
    ).length;
    return { ...vacation, followersCount };
  });

  const filteredVacations = vacationsWithFollowersCount.filter(
    (vacation) => vacation.followersCount > 0
  );

  const data = {
    labels: filteredVacations.map((vacation) => vacation.destination),
    datasets: [
      {
        label: "# of Followers",
        data: filteredVacations.map((vacation) => vacation.followersCount),
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const options: any = {
    scales: {
      x: {
        type: "category",
        labels: filteredVacations.map((vacation) => vacation.destination),
        color: "#333", // color of the labels
      },
      y: {
        type: "linear",
        beginAtZero: true,
        color: "#333", // color of the labels
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend on small screens
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const handleDownloadCSV = () => {
    let csvContent = "";
    csvContent += "Destination,FollowersCount\n";

    filteredVacations.forEach((vacation) => {
      csvContent += `${vacation.destination.split(",")[0]}, ${
        vacation.followersCount
      }\n`;
    });

    const csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

    saveAs(csvBlob, "vacation_followers.csv");
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: 2,
        }}>
        <Button variant="contained" color="success" onClick={handleDownloadCSV}>
          Download CSV
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "whitesmoke",
          color: "#333",
          paddingBottom: "1rem",
          width: "90%",
          height: "80vh", // Adjust the height as desired
          margin: "auto",
          marginTop: "1rem",
          overflow: "auto", // Add scrollbars when necessary
        }}>
        {filteredVacations.length > 0 ? (
          <div style={{ width: "100%", height: "100%" }}>
            <Bar data={data} options={options} />
          </div>
        ) : (
          <h5>No vacations with followers to display.</h5>
        )}
      </Box>
    </div>
  );
}
