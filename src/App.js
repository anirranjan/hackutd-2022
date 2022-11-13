import "./App.css";
import { useState } from "react";
import Axios from "axios";
import ratings from "@mtucourses/rate-my-professors";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { VictoryBar, VictoryChart, VictoryTheme } from "victory";

function App() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [difficulty, setDifficulty] = useState(0);
  const [department, setDepartment] = useState("");
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [numRatings, setNumRating] = useState(0);
  const [gradesURL, setGradesURL] = useState("");
  const [id, setID] = useState(0);
  const [professorEmail, setProfessorEmail] = useState("");
  const [professorImg, setProfessorImg] = useState("");
  const [professorOfficeBuilding, setProfessorOfficeBuilding] = useState("");
  const [professorOfficeRoom, setProfessorOfficeRoom] = useState("");
  const rmpData = [
    { average: "Avg Difficulty", metric: difficulty },
    { average: "Avg Rating", metric: rating },
  ];

  const getProfessor = () => {
    const myName = name.split(" ");
    let fNameParam = myName[0];
    let lNameParam = myName[1];
    Axios.get(
      "https://api.utdnebula.com/professor?first_name=" +
        fNameParam +
        "&last_name=" +
        lNameParam,
      {
        headers: {
          "x-api-key": "AIzaSyDQZrVIQKM-WMwdRQkaqoidZFPiZIfDe_Q",
          Accept: "application/json",
        },
      }
    ).then((response) => {
      setProfessorEmail(response.data.data[0].email);
      setProfessorImg(response.data.data[0].image_uri);
      setProfessorOfficeBuilding(response.data.data[0].office.building);
      setProfessorOfficeRoom(response.data.data[0].office.room);
    });
  };

  const getRating = async (event) => {
    event.preventDefault();
    const teachers = await ratings.searchTeacher(name, "U2Nob29sLTEyNzM=");
    const teacher = await ratings.getTeacher(teachers[0].id);
    setRating(teacher.avgRating);
    setDifficulty(teacher.avgDifficulty);
    setDepartment(teacher.department);
    setFName(teacher.firstName);
    setLName(teacher.lastName);
    setNumRating(teacher.numRatings);
    setID(teacher.legacyId);
    getProfessor();
  };

  const getGrades = () => {
    if (fName != null && lName != null) {
      const url = "https://utdgrades.com/results?search=" + fName + "+" + lName;
      setGradesURL(url);
    }
  };

  const viewRMP = () => {
    if (id != null) {
      const rmpURL = "https://www.ratemyprofessors.com/professor?tid=" + id;
      window.open(rmpURL);
    }
  };

  return (
    <div className="App">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Grid item>
          <Avatar
            alt="logo"
            src="./knowyourprofessor.jpg"
            sx={{ width: 350, height: 250, borderRadius: 10 }}
          />
        </Grid>

        <Grid item>
          <form onSubmit={getRating}>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Professor Name"
              variant="outlined"
              required
            />
          </form>
        </Grid>
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={5}
        padding={3}
      >
        <Grid item>
          <Card sx={{ width: 345 }}>
            <CardMedia
              component="img"
              height="250"
              image={professorImg}
              alt="Professor Image"
            />
            <CardContent>
              <Typography variant="h5">
                {fName} {lName}
              </Typography>
              <Typography variant="body2">Average Rating: {rating}</Typography>
              <Typography variant="body2">
                Average Difficulty: {difficulty}
              </Typography>
              <Typography variant="body2">Department: {department}</Typography>
              <Typography variant="body2">
                Number of Ratings: {numRatings}
              </Typography>
              <Typography variant="body2">Email: {professorEmail}</Typography>
              <Typography variant="body2">
                Office Location: {professorOfficeBuilding} {professorOfficeRoom}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={viewRMP} variant="contained" style={{ backgroundColor: "#154734" }}>
                View Rate My Professor
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item>
          <VictoryChart theme={VictoryTheme.material} domainPadding={25}>
            <VictoryBar
              barRatio={0.8}
              style={{ data: { fill: "#e87500" } }}
              data={rmpData}
              x="average"
              y="metric"
            />
          </VictoryChart>
        </Grid>
      </Grid>

      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={5}
      >
        <Grid item>
          <Button
            style={{ backgroundColor: "#154734" }}
            onClick={getGrades}
            variant="contained"
          >
            Get UTD Grades
          </Button>
        </Grid>

        <Grid item>
          <iframe
            title="utd-grades"
            width="1000"
            height="500"
            src={gradesURL}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
