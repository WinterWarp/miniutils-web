/*
* DayEnding
* Copyright (C) 2021 Adam Cole
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or any later version.
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import * as React from "react";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Tooltip,
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import * as dayjs from "dayjs";
import { Dayjs } from "dayjs";
import DayJsUtils from "@date-io/dayjs";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Helmet from "react-helmet";
type buttonsProps = {
  startTime: Dayjs;
  onStartTimeChange: (time: any) => void;
  endTime: Dayjs;
  onEndTimeChange: (time: any) => void;
};
type buttonsState = {
  aboutOpen: boolean;
  settingsOpen: boolean;
};
class Buttons extends React.Component<buttonsProps, buttonsState> {
  constructor(props: buttonsProps) {
    super(props);
    this.state = { aboutOpen: false, settingsOpen: false };
  }
  about(state: boolean) {
    this.setState({
      aboutOpen: state,
    });
  }
  settings(state: boolean) {
    this.setState({
      settingsOpen: state,
    });
  }
  render() {
    return (
      <>
        <div style={{"color": "#88c0d0",
    "position": "absolute",
    "top": "0",
    "left": "0"}}>
          <Tooltip title="What's this?" arrow>
            <IconButton aria-label="about" onClick={() => this.about(true)}>
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
        </div>
        <Dialog
          open={this.state.aboutOpen}
          keepMounted
          onClose={() => this.about(false)}
        >
          <DialogTitle>{"What's this?"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              DayEnding is a website that displays how much of the day is left.
              Use the settings button to change when the day starts and ends for
              you.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.about(false)}>OK</Button>
          </DialogActions>
        </Dialog>

        <div style={{"color": "#88c0d0",
    "position": "absolute",
    "top": "0",
    "right": "0"}}>
          <Tooltip title="Settings" arrow>
            <IconButton
              aria-label="settings"
              onClick={() => this.settings(true)}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </div>
        <Dialog
          open={this.state.settingsOpen}
          keepMounted
          onClose={() => this.settings(false)}
        >
          <DialogTitle>{"Settings"}</DialogTitle>
          <DialogContent>
            <MuiPickersUtilsProvider utils={DayJsUtils}>
              <TimePicker
                value={this.props.startTime}
                label="Start Time"
                onChange={this.props.onStartTimeChange}
              />
              <TimePicker
                value={this.props.endTime}
                label="End Time"
                onChange={this.props.onEndTimeChange}
              />
            </MuiPickersUtilsProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.settings(false)}>OK</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
type percentageProps = {
  date: Dayjs;
  startTime: Dayjs;
  endTime: Dayjs;
};
class Percentage extends React.Component<percentageProps, {}> {
  render() {
    let dayStart =
      this.props.startTime.hour() * 60 + this.props.startTime.minute();
    let dayEnd = this.props.endTime.hour() * 60 + this.props.endTime.minute();
    let hour = this.props.date.hour();
    let second = this.props.date.second();
    let minute = this.props.date.minute();
    let current = hour * 60 + minute + second / 60;
    var percent =
      Math.round(
        (100 - ((current - dayStart) / (dayEnd - dayStart)) * 100) * 100
      ) / 100;
    percent = percent <= 0 || percent > 100 ? 0 : percent;
    let percent_right = Math.round((percent % 1) * 100) / 100; // isolate decimal from number
    let percent_left = Math.floor(percent); // isolate number from decimal
    return (
      <>
        <span style={{"color": "#88c0d0",
    "position": "absolute",
    "top": "50%",
    "left": "50%",
    "transform": "translate(-50%, -50%)",
    "fontFamily": "\"Roboto\", sans-serif",
    "fontSize": "350%"}}>
          {percent != 0 ? percent_left : 0}
          {percent_right == 0 && percent != 0
            ? ".00"
            : percent != 0 &&
              percent_right.toString().substring(1).padEnd(3, "0")}
          %
        </span>
        <span style={{"color": "#81a1c1",
    "fontFamily": "\"Roboto\", sans-serif",
    "position": "absolute",
    "top": "50%",
    "left": "50%",
    "transform": "translate(-50%, -50%)",
    "paddingTop": "70px"}}>remaining</span>
      </>
    );
  }
}
type timeProps = {
  date: Dayjs;
  startTime: Dayjs;
  endTime: Dayjs;
};
class Time extends React.Component<timeProps, {}> {
  render() {
    return (
      <>
        <span style={{"color": "#81a1c1",
    "fontFamily": "\"Roboto\", sans-serif",
    "position": "absolute",
    "top": "50%",
    "left": "50%",
    "transform": "translate(-50%, -50%)",
    "paddingTop": "140px",
    "fontSize": "110%",
    "fontWeight": 400}}>
          It's currently {this.props.date.format("hh:mm:ss A")}
        </span>
        <span style={{"color": "#81a1c1",
    "fontFamily": "\"Roboto\", sans-serif",
    "position": "absolute",
    "top": "50%",
    "left": "50%",
    "transform": "translate(-50%, -50%)",
    "paddingTop": "210px",
    "fontSize": "70%"}}>
          {this.props.startTime.format("hh:mm A")} -{" "}
          {this.props.endTime.format("hh:mm A")}
        </span>
      </>
    );
  }
}
type dayEndingState = {
  date: Dayjs;
  startTime: Dayjs;
  endTime: Dayjs;
  loadedYet: boolean;
};
class DayEnding extends React.Component<{}, dayEndingState> {
  timeId: ReturnType<typeof setInterval>;
  constructor(props: {}) {
    super(props);
    this.state = {
      date: dayjs(),
      startTime: dayjs(),
      endTime: dayjs(),
      loadedYet: false
    };
    this.timeId = setInterval(() => {}, 1000000);
  }
  componentDidMount = () => {
    this.timeId = setInterval(() => this.tick(), 500);
    if (!window.localStorage.getItem("startTimeHour")) {
      this.setState({
        startTime: dayjs().hour(8).minute(0).second(0),
      });
    } else {
      this.setState({
        startTime: dayjs()
          .hour(parseInt(window.localStorage.getItem("startTimeHour")!))
          .minute(parseInt(window.localStorage.getItem("startTimeMinute")!))
          .second(0),
      });
    }
    if (!window.localStorage.getItem("endTimeHour")) {
      this.setState({
        endTime: dayjs().hour(22).minute(0).second(0),
      });
    } else {
      this.setState({
        endTime: dayjs()
          .hour(parseInt(window.localStorage.getItem("endTimeHour")!))
          .minute(parseInt(window.localStorage.getItem("endTimeMinute")!))
          .second(0),
      });
    }
    this.setState({
        loadedYet: true
    });
  };
  componentWillUnmount() {
    clearInterval(this.timeId);
  }
  tick() {
    this.setState({
      date: dayjs(),
    });
  }
  onStartTimeChange = (time: any) => {
    this.setState({
      startTime: time,
    });
    window.localStorage.setItem("startTimeHour", time.hour().toString());
    window.localStorage.setItem("startTimeMinute", time.minute().toString());
  };
  onEndTimeChange = (time: any) => {
    this.setState({
      endTime: time,
    });
    window.localStorage.setItem("endTimeHour", time.hour().toString());
    window.localStorage.setItem("endTimeMinute", time.minute().toString());
  };
  render() {
    return (
        <React.StrictMode>
           <Helmet title="DayEnding" meta={[{name: "description", content: "Shows you precentage until the day ends. Copyright Adam Cole 2021, licensed under GNU AGPL-3.0"}]}><style>{"body{background-color: #D8DEE9;}"}</style></Helmet>
      <div style={{"margin": "auto",
    "backgroundColor": "#2e3440",
    "width": "500px",
    "height": "500px",
    "borderRadius": "50%",
    "position": "relative",
    "fontWeight": 500}}>
         <noscript><h1>Uh-Oh Spaghettio!</h1><p>I don't know how you expect to browse the web without JavaScript enabled, but you need it for this page.</p></noscript>
        <Buttons
          onStartTimeChange={this.onStartTimeChange}
          onEndTimeChange={this.onEndTimeChange}
          startTime={this.state.startTime}
          endTime={this.state.endTime}
        />
        <Percentage
          date={this.state.date}
          startTime={this.state.startTime}
          endTime={this.state.endTime}
        />
        <Time
          date={this.state.date}
          startTime={this.state.startTime}
          endTime={this.state.endTime}
        />
      </div></React.StrictMode>
    );
  }
}

export default DayEnding