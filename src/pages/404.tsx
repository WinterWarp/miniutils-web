import * as React from "react";
import {Helmet} from "react-helmet"
import {Typography} from "@material-ui/core";
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
export default () =>{
    return(<React.StrictMode>
        <Helmet title="404 Not Found" meta={[{name: "description", content: "Not Found"}]}><style>{"body{background-color: #2E3440}"}</style></Helmet>
        <ThemeProvider theme={theme}>
       <Typography variant="h1" color="textPrimary">404 Not found</Typography>
       <Typography variant="subtitle1" color="secondary"><i>"What do you want from me?"</i></Typography> 
       </ThemeProvider></React.StrictMode>)
}