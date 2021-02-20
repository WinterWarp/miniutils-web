/*
* Thorough Pomodoro
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

// This `window` import is pointless, it's just so that during SSR, we make sure that `window` is defined
import {window} from "browser-monads"
// Material-UI!!!111
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { NotificationsActive, TimerOutlined } from "@material-ui/icons";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import SettingsIcon from "@material-ui/icons/Settings";
import * as React from "react";
import {Helmet} from "react-helmet";
// Possible states of pomodoro
enum pomodoroStates {
  // All play and no work makes Jack a mere toy
  Work,
  // All work and no play makes Jack a dull boy
  ShortBreak,
  LongBreak,
}
class Pomodoro {
  // State
  state: pomodoroStates;
  // Time remaining in seconds
  timeRemaining: number;
  // Time that we started at (used for percent)
  timeStartedAt: number;
  // Percent until finished with state
  percentUntilEnd: number;
  // Color that should be displayed in Timer
  themeColor: string;
  // Whether we are paused (true makes tick() a no-op)
  isPaused: boolean;
  // How many breaks have been taken (used to figure out when to take a LongBreak)
  breaksTaken: number;
  // What we are timing
  currentlyTiming: string;
  // What to display that we are timing
  displayText: string;
  // Length of pomodoro
  workLength: number;
  // Length of short break
  shortBreakLength: number;
  // Length of long break
  longBreakLength: number;
  constructor() {
    this.state = pomodoroStates.Work;
    this.timeRemaining = 25 * 60;
    this.timeStartedAt = 25 * 60;
    this.percentUntilEnd = 100;
    this.themeColor = "#81A1C1";
    this.isPaused = true;
    this.breaksTaken = 0;
    this.currentlyTiming = "Please enter thing to time (use button below)";
    this.displayText = "Please enter thing to time (use button below)";
    this.workLength = 25;
    this.shortBreakLength = 5;
    this.longBreakLength = 10;
  }
  // Goes to next pomodoro state, and its attributes
  _nextState() {
    switch (this.state) {
      case pomodoroStates.Work:
        if (this.breaksTaken >= 4) {
          this.timeRemaining = this.longBreakLength * 60;
          this.state = pomodoroStates.LongBreak;
          this.timeStartedAt = this.longBreakLength * 60;
          this.themeColor = "#BF616A";
          this.displayText = "Take a nice long(er) break!";
          var notifString = "Take a nice, long(er) break of " + this.longBreakLength + " minutes."
          var notification = new Notification("Thorough Pomodoro", {body: notifString});
          notification.onclick = () => window.focus();
          return this;
        } else {
          this.timeRemaining = this.shortBreakLength * 60;
          this.state = pomodoroStates.ShortBreak;
          this.timeStartedAt = this.shortBreakLength * 60;
          this.themeColor = "#EBCB8B";
          this.displayText = "Take a little break!";
          var notifString = "Take a little " + this.shortBreakLength + " minute break."
          var notification = new Notification("Thorough Pomodoro", {body: notifString});
          notification.onclick = () => window.focus();
          return this;
        }
      case pomodoroStates.ShortBreak:
        this.timeRemaining = this.workLength * 60;
        this.state = pomodoroStates.Work;
        this.timeStartedAt = this.workLength * 60;
        this.breaksTaken += 1;
        this.themeColor = "#81A1C1";
        this.displayText = this.currentlyTiming;
        var notifString = "Time to work on " + this.currentlyTiming + " for " + this.workLength + " minutes."
        var notification = new Notification("Thorough Pomodoro", {body: notifString});
        notification.onclick = () => window.focus();
        return this;
      case pomodoroStates.LongBreak:
        this.timeRemaining = this.workLength * 60;
        this.state = pomodoroStates.Work;
        this.timeStartedAt = this.workLength * 60;
        this.breaksTaken = 0;
        this.themeColor = "#81A1C1";
        this.displayText = this.currentlyTiming;
        var notifString = "Time to work on " + this.currentlyTiming + " for " + this.workLength + " minutes."
        var notification = new Notification("Thorough Pomodoro", {body: notifString});
        notification.onclick = () => window.focus();
        return this;
    }
  }
  // Toggle if pomodoro is paused or not
  togglePause() {
    if (
      this.currentlyTiming != "Please enter thing to time (use button below)"
    ) {
      this.isPaused = !this.isPaused;
      return this;
    } else {
      return this;
    }
  }
  // Manually set pause state
  setPauseState(setTo: boolean) {
    if (
      this.currentlyTiming != "Please enter thing to time (use button below)"
    ) {
      this.isPaused = setTo;
      return this;
    } else {
      return this;
    }
  }
  // Change what we are timing
  changeTiming(nowTiming: string) {
    this.currentlyTiming = nowTiming;
    if (this.state == pomodoroStates.Work) {
      this.displayText = nowTiming;
    }
    return this;
  }
  // Function to go to next second of pomodoro
  tick() {
    if (!this.isPaused) {
      this.timeRemaining -= 1;
      if (this.timeRemaining <= 0) {
        this._nextState();
        return this;
      }
      this.percentUntilEnd = (this.timeRemaining / this.timeStartedAt) * 100;
      return this;
    } else {
      return this;
    }
  }
  // Zero pads numbers
  _zeroPad(unpadded: number) {
    if (unpadded < 10) {
      return unpadded.toString().padStart(2, "0");
    } else {
      return unpadded.toString().padEnd(2, "0");
    }
  }
  // Get zero-padded formatted time
  getTime() {
    var minute = this._zeroPad(Math.floor(this.timeRemaining / 60));
    var second = this._zeroPad(this.timeRemaining % 60);
    return minute + ":" + second;
  }
  // Changes lengths of Pomodoro intervals
  changeIntervals(
    workLength: number,
    shortBreakLength: number,
    longBreakLength: number
  ) {
    this.workLength = workLength;
    this.shortBreakLength = shortBreakLength;
    this.longBreakLength = longBreakLength;
    switch (this.state) {
      case pomodoroStates.Work:
        this.timeStartedAt = this.workLength * 60;
        break;
      case pomodoroStates.ShortBreak:
        this.timeStartedAt = this.shortBreakLength * 60;
        break;
      case pomodoroStates.LongBreak:
        this.timeStartedAt = this.longBreakLength * 60;
        break;
    }
    this.timeRemaining = this.timeStartedAt;
    return this;
  }
}
type MainTimerProps = {
  pomodoro: Pomodoro;
  togglePause: () => void;
};
// Text for timing information, and button to pause/resume
class MainTimer extends React.Component<MainTimerProps> {
  // I know using a Fab here is not proper Material Design, but
  // Fabs look and work way better than normal and Material buttons here,
  // and since this one is so big, it doesn't even look like a Fab.
  render() {
    return (
      <Tooltip title="Pause/Resume Timer" arrow>
        <Fab
          style={{
            backgroundColor: this.props.pomodoro.themeColor,
            height: 400,
            width: 400,
            lineHeight: "400px",
            textAlign: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            margin: "-200px 0 0 -200px",
          }}
          aria-label="Pause/Resume Timer"
          onClick={this.props.togglePause}
        >
          <span
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              lineHeight: "normal",
              textAlign: "center",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "400",
            }}
          >
            {this.props.pomodoro.getTime()}
            <br />
            {this.props.pomodoro.displayText}
            <br />
            {Math.round(this.props.pomodoro.percentUntilEnd)}% left
            {this.props.pomodoro.isPaused && (
              <>
                <br />
                Paused.
              </>
            )}
          </span>
        </Fab>
      </Tooltip>
    );
  }
}
type ChangeTimingProps = {
  name: string;
  onTimingChange: (x: React.ChangeEvent<HTMLInputElement>) => void;
  setPause: (y: boolean) => void;
};
type ChangeTimingState = {
  changeTimingDialogShown: boolean;
};
// Change what you are using the timer for.
class ChangeTiming extends React.Component<
  ChangeTimingProps,
  ChangeTimingState
> {
  constructor(props: ChangeTimingProps) {
    super(props);
    this.state = { changeTimingDialogShown: true };
  }
  closeChangeTimingDialog = () => {
    this.setState({ changeTimingDialogShown: false });
    this.props.setPause(false);
  };
  openChangeTimingDialog = () => {
    this.setState({ changeTimingDialogShown: true });
    this.props.setPause(true);
  };
  render() {
    return (
      <>
        {!this.state.changeTimingDialogShown && (
          <Tooltip title="Change what you're doing" arrow>
            <Fab
              style={{
                backgroundColor: "#8FBCBB",
                color: "#ECEFF4",
                position: "absolute",
                top: "50%",
                left: "50%",
                margin: "280px 0 0 -26px",
              }}
              aria-label="Change what you're doing"
              onClick={this.openChangeTimingDialog}
            >
              <TimerOutlined />
            </Fab>
          </Tooltip>
        )}
        <Dialog
          open={this.state.changeTimingDialogShown}
          onClose={this.closeChangeTimingDialog}
          scroll="body"
        >
          <DialogTitle>Change timing</DialogTitle>
          <DialogContent>
            <TextField
              variant="outlined"
              autoFocus
              label="What do you want to do?"
              placeholder="Write page 4 of story"
              onChange={this.props.onTimingChange}
              id="todo-input"
            ></TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeChangeTimingDialog}>Done</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
// Edit length of pomodoro and length of breaks
type IntervalEditorProps = {
  onIntervalChange: (x: number, y: number, z: number) => void;
  pomodoro: Pomodoro;
  setPause: (x: boolean) => void;
};
type IntervalEditorState = {
  intervalEditorDialogShown: boolean;
  workIntervalError: string;
  shortBreakIntervalError: string;
  longBreakIntervalError: string;
};

class IntervalEditor extends React.Component<
  IntervalEditorProps,
  IntervalEditorState
> {
  constructor(props: IntervalEditorProps) {
    super(props);
    this.state = { intervalEditorDialogShown: false, workIntervalError: "", shortBreakIntervalError: "", longBreakIntervalError: "" };
  }
  closeIntervalEditorDialog = () => {
    this.setState({ intervalEditorDialogShown: false });
    this.props.setPause(false);
  };
  openIntervalEditorDialog = () => {
    this.setState({ intervalEditorDialogShown: true });
    this.props.setPause(true);
  };
  _isInteger = (text: React.ChangeEvent<HTMLInputElement>) => {
    const isNumber = /^[0-9\b]+$/;
    return isNumber.test(text.target.value);
  };
  // The following three functions are disgusting, but this is the only way I could think of to do this
  changeWorkLength = (text: React.ChangeEvent<HTMLInputElement>) => {
    if (this._isInteger(text)) {
      this.props.onIntervalChange(
        parseInt(text.target.value),
        this.props.pomodoro.shortBreakLength,
        this.props.pomodoro.longBreakLength
      ); this.setState({
        workIntervalError: ""
      })
      
    } else {
      this.setState({
        workIntervalError: "Not a number"
      })
    }
  };
  changeShortBreakLength = (text: React.ChangeEvent<HTMLInputElement>) => {
    if (this._isInteger(text)) {
      this.props.onIntervalChange(
        this.props.pomodoro.workLength,
        parseInt(text.target.value),
        this.props.pomodoro.longBreakLength
      );
      this.setState({
        shortBreakIntervalError: ""
      })
    } else {
      this.setState({
        shortBreakIntervalError: "Not a number"
      })
    }
  };
  changeLongBreakLength = (text: React.ChangeEvent<HTMLInputElement>) => {
    if (this._isInteger(text)) {
      this.props.onIntervalChange(
        this.props.pomodoro.workLength,
        this.props.pomodoro.shortBreakLength,
        parseInt(text.target.value)
      );
      this.setState({
        longBreakIntervalError: ""
      })
    }  else {
      this.setState({
        longBreakIntervalError: "Not a number"
      })
    }
  };
  resetToDefaultValues = () => {
    this.props.onIntervalChange(25, 5, 10);
  };
  render() {
    return (
      <>
        <Tooltip title="Timer Settings" arrow>
          <IconButton
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              margin: "-250px 0 0 200px",
              color: "#ECEFF4",
            }}
            aria-label="Timer Settings"
            onClick={this.openIntervalEditorDialog}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <Dialog
          open={this.state.intervalEditorDialogShown}
          onClose={this.closeIntervalEditorDialog}
        >
          <DialogTitle>Change intervals</DialogTitle>
          <DialogContent>
            <form noValidate style={{ display: "grid", gap: 15 }}>
              <TextField
                variant="outlined"
                label="Length of work interval"
                onChange={this.changeWorkLength}
                defaultValue={this.props.pomodoro.workLength.toString()}
                id="work-interval-input"
                error = {this.state.workIntervalError.length === 0 ? false : true}
                helperText = {this.state.workIntervalError}
                InputProps={{
                  inputMode: "numeric",
                  endAdornment: (
                    <InputAdornment position="end">min</InputAdornment>
                  ),
                }}
              ></TextField>
              <TextField
                variant="outlined"
                label="Length of short break"
                onChange={this.changeShortBreakLength}
                defaultValue={this.props.pomodoro.shortBreakLength.toString()}
                id="short-break-interval-input"
                error = {this.state.shortBreakIntervalError.length === 0 ? false : true}
                helperText = {this.state.shortBreakIntervalError}
                InputProps={{
                  inputMode: "numeric",
                  endAdornment: (
                    <InputAdornment position="end">min</InputAdornment>
                  ),
                }}
              ></TextField>
              <TextField
                variant="outlined"
                label="Length of long break"
                onChange={this.changeLongBreakLength}
                defaultValue={this.props.pomodoro.longBreakLength.toString()}
                id="long-break-interval-input"
                error = {this.state.longBreakIntervalError.length === 0 ? false : true}
                helperText = {this.state.longBreakIntervalError}
                InputProps={{
                  inputMode: "numeric",
                  endAdornment: (
                    <InputAdornment position="end">min</InputAdornment>
                  ),
                }}
              ></TextField>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.resetToDefaultValues}>Reset</Button>
            <Button onClick={this.closeIntervalEditorDialog}>Done</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
type AboutState = {
  AboutDialogShown: boolean;
};
class About extends React.Component<{}, AboutState> {
  constructor(props: {}) {
    super(props);
    this.state = { AboutDialogShown: false };
  }
  openAboutDialog = () => {
    this.setState({
      AboutDialogShown: true,
    });
  };
  closeAboutDialog = () => {
    this.setState({
      AboutDialogShown: false,
    });
  };
  render() {
    return (
      <><Tooltip title="What's this?" arrow>
        <IconButton
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            margin: "-250px 0 0 -250px",
            color: "#ECEFF4",
          }}
          onClick={this.openAboutDialog}
        >
          <HelpOutlineIcon />
        </IconButton></Tooltip>
        <Dialog
          open={this.state.AboutDialogShown}
          onClose={this.closeAboutDialog}
        >
          <DialogTitle>What's this?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              The{" "}
              <a href="https://en.wikipedia.org/wiki/Pomodoro_Technique">
                Pomodoro technique
              </a>{" "}
              divides work into 25 minute intervals with 5-10 minute breaks in between. <br />
              Click the button in the middle to pause/resume ther timer, use the
              settings button to change interval lengths, and use the timer
              button to change what you are timing.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeAboutDialog}>OK</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
type ProgressProps = {
  // Percentage to display
  percentToEnd: number;
};
// Renders ring that represents percentage until next step
class Progress extends React.Component<ProgressProps, {}> {
  render() {
    return (
      <CircularProgress
        style={{
          color: "#88C0D0",
          position: "absolute",
          top: "50%",
          left: "50%",
          margin: "-250px 0 0 -250px",
        }}
        size={500}
        value={this.props.percentToEnd}
        variant="determinate"
        thickness={10}
      />
    );
  }
}
class NotificationButton extends React.Component {
  render() {
    return (<div id="ninja">
      {"Notification" in window && Notification.permission === "default"&& <Tooltip title="Allow notifications" arrow><IconButton style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        marginTop: "-300px",
        color: "#ECEFF4",
        
      }}
      onClick={() => Notification.requestPermission().then()}
      ><NotificationsActive/></IconButton></Tooltip>
      }</div>)
  }
}
type ThoroughPomodoroState = {
  // Current state of pomodoro
  pomodoro: Pomodoro;
};
// Main app
class ThoroughPomodoro extends React.Component<{}, ThoroughPomodoroState> {
  // typeof setInterval
  tickPomodoro: NodeJS.Timeout | null;
  constructor(props: {}) {
    super(props);
    this.state = { pomodoro: new Pomodoro() };
    this.tickPomodoro = null;
  }
  // These four functions are here, because we can't inline these into JSX props (sadly)
  togglePause = () => {
    this.setState({
      pomodoro: this.state.pomodoro.togglePause(),
    });
  };
  setPause = (x: boolean) => {
    this.setState({
      pomodoro: this.state.pomodoro.setPauseState(x),
    });
  };
  changeTiming = (to: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      pomodoro: this.state.pomodoro.changeTiming(to.target.value),
    });
  };
  onIntervalChange = (
    pomodoro: number,
    shortBreak: number,
    longBreak: number
  ) => {
    this.setState({
      pomodoro: this.state.pomodoro.changeIntervals(
        pomodoro,
        shortBreak,
        longBreak
      ),
    });
    // Save intervals for next page load
    window.localStorage.setItem("work", pomodoro.toString());
    window.localStorage.setItem("shortBreak", shortBreak.toString());
    window.localStorage.setItem("longBreak", longBreak.toString());
  };
  componentDidMount = () => {
    this.tickPomodoro = setInterval(
      () =>
        this.setState({
          pomodoro: this.state.pomodoro.tick(),
        }),
      1000
    );
    // If *all* saved intervals exist, then load them into pomodoro, else reset all of them to the default values
    if (
      window.localStorage.getItem("work") &&
      window.localStorage.getItem("shortBreak") &&
      window.localStorage.getItem("longBreak")
    ) {
      this.setState({
        pomodoro: this.state.pomodoro.changeIntervals(
          parseInt(window.localStorage.getItem("work")!),
          parseInt(window.localStorage.getItem("shortBreak")!),
          parseInt(window.localStorage.getItem("longBreak")!)
        ),
      });
    } else {
      window.localStorage.setItem("work", "25");
      window.localStorage.setItem("shortBreak", "5");
      window.localStorage.setItem("longBreak", "10");
    }
    
  };
  render() {
    return (
      <React.StrictMode>
        
        <Helmet title="Thorough Pomodoro" meta={[{name: "description", content: "Simple Pomodoro timer. Copyright Adam Cole 2021, licensed under GNU AGPL-3.0"}]}><style>{"body{background-color: #2E3440;}"}</style></Helmet>
        <main>
        <noscript><h1>Uh-Oh Spaghettio!</h1><p>I don't know how you expect to browse the web without JavaScript enabled, but you need it for this page.</p></noscript>
        <div>
          <Progress percentToEnd={this.state.pomodoro.percentUntilEnd} />
          <About />
          <NotificationButton />
          <MainTimer
            pomodoro={this.state.pomodoro}
            togglePause={this.togglePause}
          />
          <IntervalEditor
            onIntervalChange={this.onIntervalChange}
            setPause={this.setPause}
            pomodoro={this.state.pomodoro}
          />
          <ChangeTiming
            name=""
            onTimingChange={this.changeTiming}
            setPause={this.setPause}
          />
        </div>
        </main>
      </React.StrictMode>
    );
  }
}

export default ThoroughPomodoro;