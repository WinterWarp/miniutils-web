import * as React from "react";
import Helmet from "react-helmet"
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Tooltip,
} from "@material-ui/core";
// Begin Nord Material-UI theme
import { ThemeOptions, createMuiTheme, ThemeProvider } from '@material-ui/core';

const themeOptions: ThemeOptions = {
  palette: {
    type: 'dark',
    primary: {
      main: '#81a1c1',
    },
    secondary: {
      main: '#88c0d0',
    },
    background: {
      default: '#2e3440',
      paper: '#3b4252',
    },
    text: {
      primary: '#eceff4',
      secondary: '#e5e9f0',
      disabled: '#d8dee9',
      hint: '#d8dee9',
    },
    error: {
      main: '#bf616a',
    },
    warning: {
      main: '#d08770',
    },
    info: {
      main: '#5e81ac',
    },
    success: {
      main: '#a3be8c',
    },
  },
};
const theme = createMuiTheme(themeOptions)
// End Nord Material-UI theme
export default () => {
  return (
    <React.StrictMode>
        <Helmet title="MiniUtils" meta={[{name: "description", content: "MiniUtils by Adam Cole"}]}><style>{"body{position: \"relative\";background-color: #2E3440}"}</style></Helmet>
        <ThemeProvider theme={theme}>
      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="center"
        style={{position: "absolute", top: "50%", transform: "translateY(-50%)"}}
      >
        <Card>
          <CardActionArea onClick={() => window.open("/dayending", "_self")}>
            <CardMedia image="/dayending.png" title="DayEnding" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                DayEnding
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Shows you how much time is left in the day.
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button color="primary" onClick={() => window.open("/dayending", "_self")}>TAKE ME THERE</Button>
          </CardActions>
        </Card>
        <Card>
          <CardActionArea onClick={() => window.open("/pomodoro", "_self")}>
            <CardMedia image="/pomodoro.png" title="Thorough Pomodoro" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Thorough Pomodoro
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Simple Pomodoro Timer
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button color="primary" onClick={() => window.open("/pomodoro", "_self")}>TAKE ME THERE</Button>
          </CardActions>
        </Card>
      </Grid>
      <Typography
        style={{ position: "absolute", bottom: "16px", fontWeight: 400 }}
        variant="subtitle2"
        color="textSecondary"
      >
        Copyright Adam Cole 2021 <br />
        By using this website, you automatically aggree to the{" "}
        <a href="https://www.gnu.org/licenses/agpl-3.0.en.html" style={{"color": "#88c0d0","color:visited": "#88c0d0"}}>
          terms and conditions (GNU AGPL-3.0)
        </a><br />
        Source availible <a href="https://github.com/WinterWarp/miniutils" style={{"color": "#88c0d0","color:visited": "#88c0d0"}}>here</a>
      </Typography>
      </ThemeProvider> 
    </React.StrictMode>
  );
};
