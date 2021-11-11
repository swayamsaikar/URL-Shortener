import React, { Component } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PacmanIndicator } from "react-native-indicators";

class LoadingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  CheckIfLoggedIn = async () => {
    isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
    isLoggedIn !== "1"
      ? this.props.navigation.replace("Login")
      : this.props.navigation.replace("Home");
  };

  componentDidMount() {
    this.CheckIfLoggedIn();
  }

  render() {
    return <PacmanIndicator size={100} color="#0B5798" />;
  }
}

export default LoadingScreen;
