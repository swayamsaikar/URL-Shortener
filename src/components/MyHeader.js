import React, { Component } from "react";
import { Header } from "react-native-elements";

class MyHeader extends Component {
  render() {
    return (
      <Header
        centerComponent={{
          text: "URL-Shortener",
          style: {
            fontSize: 20,
            color: "#fff",
          },
        }}
      />
    );
  }
}

export default MyHeader;
