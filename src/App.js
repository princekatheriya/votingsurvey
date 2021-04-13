import React, { Component } from "react";
import {
  database,
  auth,
  googleAuthProvider,
  // facebookProvider,
  storage,
} from "./firebase";
import registerMessaging from "./request-messaging-permission";

// import FileInput from "react-file-input";

// import reactLogo from "./react-logo.svg";
// import firebaseLogo from "./firebase-logo.svg";
import "./App.css";
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      guides: null,
      newData: "",
      vil: "",
      radio: "",
      currentUser: {},
      userImages: null,
      checkUser: null,
    };

    this.userRef = database.ref("/users").child("Anonymous");
    this.guidesRef = database.ref("/guides");
    this.userStorageRef = storage.ref("/user-files").child("Anonymous");

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeOption = this.handleChangeOption.bind(this);
    this.handleChangeRadio = this.handleChangeRadio.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileSubmit = this.handleFileSubmit.bind(this);
    this.displayCurrentUser = this.displayCurrentUser.bind(this);
  }

  componentDidMount() {
    auth.onAuthStateChanged((currentUser) => {
      this.setState({ currentUser: currentUser || {} });
      this.setState({ checkUser: currentUser });
      console.log("c :- ", this.state.checkUser);
      if (this.state.currentUser) {
        // Init current user Refs
        this.userRef = database.ref("/users").child(currentUser.uid);
        this.userStorageRef = storage.ref("/user-files").child(currentUser.uid);

        this.guidesRef.on("value", (snapshot) => {
          const guides = snapshot.val();
          this.setState({ guides });
        });

        this.userRef.child("images").on("value", (snapshot) => {
          const userImages = snapshot.val();
          if (userImages) {
            this.setState({ userImages });
          }
        });
        // register function messaging alert for this user
        registerMessaging(currentUser);
        // Add user to users database if not exist
        this.userRef.once("value", (snapshot) => {
          const userData = snapshot.val();
          if (!userData) {
            this.userRef.set({ name: currentUser.displayName });
          }
        });
      } else {
        this.setState({ guides: null, userImages: null });
      }
    });
  }

  // Form Events
  handleChange(event) {
    const newData = event.target.value;
    this.setState({ newData });
  }

  handleChangeOption(event) {
    const vil = event.target.value;
    this.setState({ vil });
  }

  handleChangeRadio(event) {
    const radio = event.target.value;
    this.setState({ radio });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { newData, currentUser, vil, radio } = this.state;
    console.log("data:- ", this.state);
    this.guidesRef.push({
      uid: currentUser.uid,
      name: currentUser.displayName,
      // content: newData,
      vil: vil,
      radio: radio,
    });
    setTimeout(function () {
      alert("Thank you for participating");
    }, 3000);
  }

  handleFileSubmit(event) {
    const file = event.target.files[0];
    const uploadTask = this.userStorageRef
      .child(file.name)
      .put(file, { contentType: file.type });

    uploadTask.on("state_changed", (snapshot) => {
      console.log(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100 + "%"
      );
    });

    uploadTask.then((snapshot) => {
      this.userRef.child("images").push(snapshot.downloadURL);
    });
  }

  // Auth Events
  signIn() {
    // auth.signInWithPopup(facebookProvider);
    auth.signInWithPopup(googleAuthProvider);
  }

  signOut() {
    auth.signOut();
  }

  displayCurrentUser() {
    return (
      <img
        className="App-nav-img"
        onClick={this.signOut}
        src={this.state.currentUser.photoURL}
        alt={this.state.currentUser.displayName}
      />
    );
  }

  displayUserImages() {
    const { userImages } = this.state;
    if (userImages) {
      const imageIds = Object.keys(userImages);
      return imageIds.map((id) => (
        <img key={id} className="App-image" src={userImages[id]} />
      ));
    }
  }

  render() {
    const car = require("./assets/images/car.jpeg");
    const imli = require("./assets/images/imli.jpeg");
    const camera = require("./assets/images/camera.png");
    const carrom = require("./assets/images/carrom.jpeg");
    const kitab = require("./assets/images/kitab.png");
    const anaj = require("./assets/images/kisaan.jpeg");
    const kanni = require("./assets/images/kanni.jpeg");
    const coat = require("./assets/images/coat.png");
    return (
      <div className="App">
        <div className="App-nav">
          <span className="App-nav-title">मतदान सर्वेक्षण / Voting Survey</span>
          <span className="App-nav-button">
            {this.state.currentUser.email ? (
              this.displayCurrentUser()
            ) : (
              <a href="#" onClick={this.signIn}>
                Sign In
              </a>
            )}
          </span>
        </div>
        {/* <div className="App-header">
          <img src={reactLogo} className="main-logo" alt="logo" />
          <img src={firebaseLogo} className="main-logo" alt="logo" />
          <h2>Welcome to React and Firebase</h2>
        </div> */}

        <p className="App-intro">
          <code>
            <b>मतदान सर्वेक्षण / Voting Survey</b>
          </code>
        </p>
        {this.state.checkUser === null ? (
          <div style={{ textAlign: "center" }}>
            <code>
              <div className="AppBody-fb-db1">
                <h2 style={{ color: "Red" }}>
                  कृपया पहले साइन इन करें / Please Sign In First{" "}
                </h2>
              </div>
            </code>
          </div>
        ) : null}
        {this.state.guides === null ? (
          <div className="AppBody">
            <form className="App-form" onSubmit={this.handleSubmit}>
              <label for="cars">एक गाँव चुनें / Choose a Village:</label>
              
                <select
                  name="cars"
                  id="cars"
                  onChange={this.handleChangeOption}
                  style={{marginTop:20}}
                  required
                >
                  <option value="">कृप्या चुनें / None</option>
                  <option value="kasumara">कसुमरा-टहा / Kasumara-Taha</option>
                  <option value="manona">मनोना / Manona</option>
                  <option value="others">अन्य / others</option>
                </select>
              
              {/* <input
              className="text"
              name="name"
              placeholder="New data"
              type="text"
              onChange={this.handleChange}
            /> */}

              <p>कृपया अपना विकल्प चुनें / Please select your option:-</p>
              <div style={{}} onChange={this.handleChangeRadio}>
                <div style={{ display: "inline" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  >
                    <span style={{ margin: 20 }}>1. </span>{" "}
                    <img src={anaj} width="100" height="50" />
                  </div>
                  <div style={{ display: "inline" }}>
                    <input type="radio" value="ANAJ" name="gender" required />{" "}
                  </div>
                </div>

                <div style={{}}>
                  <div
                    style={{
                      display: "inline-flex",
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  >
                    <span style={{ margin: 20 }}>2.</span>
                    <img src={imli} width="100" height="50" />
                  </div>
                  <div style={{ display: "inline" }}>
                    <input type="radio" value="IMLI" name="gender" required />{" "}
                  </div>
                </div>

                <div style={{}}>
                  <div
                    style={{
                      display: "inline-flex",
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  >
                    <span style={{ margin: 20 }}>3. </span>{" "}
                    <img src={kanni} width="100" height="50" />
                  </div>
                  <div style={{ display: "inline" }}>
                    <input type="radio" value="KANNI" name="gender" required />{" "}
                  </div>
                </div>

                <div style={{}}>
                  <div
                    style={{
                      display: "inline-flex",
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  >
                    <span style={{ margin: 20 }}>4. </span>
                    <img src={car} width="100" height="50" />
                  </div>
                  <div style={{ display: "inline" }}>
                    <input type="radio" value="CAR  " name="gender" required />{" "}
                  </div>
                </div>

                <div style={{}}>
                  <div
                    style={{
                      display: "inline-flex",
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  >
                    <span style={{ margin: 20 }}>5. </span>{" "}
                    <img src={kitab} width="100" height="50" />
                  </div>
                  <div style={{ display: "inline" }}>
                    <input type="radio" value="KITAB" name="gender" required />{" "}
                  </div>
                </div>

                <div style={{}}>
                  <div style={{ display: "inline-flex" }}>
                    <span style={{ margin: 20 }}>6. </span>{" "}
                    <img src={camera} width="100" height="50" />
                  </div>
                  <div style={{ display: "inline" }}>
                    <input type="radio" value="CAMERA" name="gender" required />{" "}
                  </div>
                </div>

                <div style={{}}>
                  <div
                    style={{
                      display: "inline-flex",
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  >
                    <span style={{ margin: 20 }}>7. </span>
                    <img src={carrom} width="100" height="50" />
                  </div>
                  <div style={{ display: "inline" }}>
                    <input type="radio" value="CARROM" name="gender" required />{" "}
                  </div>
                </div>

                <div style={{}}>
                  <div
                    style={{
                      display: "inline-flex",
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  >
                    <span style={{ margin: 20 }}>8. </span>{" "}
                    <img style={{}} src={coat} width="100" height="50" />
                  </div>
                  <div style={{ display: "inline" }}>
                    <input type="radio" value="COAT" name="gender" required />
                  </div>
                </div>
              </div>

              {this.state.checkUser === null ? (
                <div style={{ marginBottom: 20 }}>
                  <input
                    className="button1"
                    type="submit"
                    value="Submit"
                    disabled
                  />
                </div>
              ) : (
                <div style={{ marginBottom: 20 }}>
                  <input className="button" type="submit" value="Submit" />
                </div>
              )}
            </form>
            {/* <pre className="AppBody-fb-db">
            {JSON.stringify(this.state.guides, null, 2)}
          </pre> */}
          </div>
        ) : (
          <pre className="AppBody-fb-db">
            <p style={{ color: "green" }}>
              Thank You for taking part in the Survey
            </p>
          </pre>
        )}

        {/* <p className="App-intro">
          <code>
            <b>Cloud Storage</b>
          </code>
        </p>
        <div className="AppBody">
          <FileInput
            className="file"
            accept=".png,.gif,.jpg"
            placeholder="Select an image"
            onChange={this.handleFileSubmit}
          />

          <div className="App-images">{this.displayUserImages()}</div>
        </div> */}
      </div>
    );
  }
}

export default App;
