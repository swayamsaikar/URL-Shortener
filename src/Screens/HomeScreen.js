import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  // Linking,
  // TouchableOpacity,
  Clipboard,
  ToastAndroid,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import MyHeader from "../components/MyHeader";
import { Input, Button } from "react-native-elements";
import { Entypo } from "@expo/vector-icons";
import db from "../config/firebase_config";
import firebase from "firebase";
import { PacmanIndicator } from "react-native-indicators";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "https://github.com/swayamsaikar",
      shortened_url: null,
      URL_List_Data: [],
      error: "",
      buttonPressed: false,
      loading: true,
    };
  }
  getData = async () => {
    var req = await fetch(
      `https://api.shrtco.de/v2/shorten?url=${this.state.url}`
    );
    var res = await req.json();
    this.setState({
      shortened_url: res.result.full_short_link
        ? res.result.full_short_link
        : null,
    });
  };

  UploadDocumentToDB = () => {
    var currentDate = firebase.firestore.Timestamp.now().toDate().toString();
    db.collection("URLS").add({
      email: firebase.auth().currentUser.email,
      original_url: this.state.url,
      shortened_url: this.state.shortened_url,
      current_date: currentDate,
    });

    this.setState({
      url: "",
      shortened_url: null,
    });
  };

  getURLDataFromDB = async () => {
    await db
      .collection("URLS")
      .where("email", "==", await AsyncStorage.getItem("currentUserEmail"))
      .get()
      .then((collection) => {
        var URL_Data_List = [];
        collection.docs.map((doc) => {
          URL_Data_List.push(doc.data());
        });
        this.setState({ URL_List_Data: URL_Data_List, loading: false });
      });
  };

  componentDidMount = () => {
    this.getURLDataFromDB();
  };
  render() {
    return (
      <View style={{ backgroundColor: "#fff" }}>
        <MyHeader />
        {/* Text Input */}
        <View style={styles.InputBox}>
          <Input
            placeholder="Enter the Full and valid https URL here"
            value={this.state.url}
            onChangeText={(url) => {
              this.setState({ url: url });
            }}
            rightIcon={
              <Entypo
                name="clipboard"
                size={24}
                color="black"
                onPress={async () => {
                  var clipBoard = await Clipboard.getString();
                  clipBoard === ""
                    ? ToastAndroid.show(
                        "Clipboard is Empty!!",
                        ToastAndroid.SHORT
                      )
                    : this.setState({ url: clipBoard.trim() });
                  ToastAndroid.show("Pasted !!!!", ToastAndroid.SHORT);
                }}
              />
            }
          />
          <Button
            title="Create Short URL"
            buttonStyle={{ marginHorizontal: 50 }}
            onPress={() => {
              this.state.url
                ? this.getData()
                    .then(() => {
                      if (this.state.shortened_url !== null) {
                        this.UploadDocumentToDB();
                      } else {
                        alert(this.state.error);
                      }
                    })
                    .then(() => {
                      this.getURLDataFromDB();
                    })
                : alert("Pls Fill The Input Field First!!");
            }}
          />
        </View>

        <View style={styles.URL_List}>
          {this.state.URL_List_Data.length > 0 ? (
            <FlatList
              data={this.state.URL_List_Data}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                    borderRadius: 1,
                    padding: 10,
                    alignSelf: "center",
                    elevation: 0.2,
                  }}
                >
                  <View>
                    <TouchableOpacity
                      onPress={async () => {
                        var ClipBoard = await Clipboard.setString(
                          item.shortened_url
                        );
                        alert("Shortened Link Copied to your clipboard!!");
                      }}
                    >
                      <Image
                        source={require("../../images/LinkImage.png")}
                        style={{ margin: 10, height: 50, width: 50 }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        marginBottom: 3,
                      }}
                    >
                      {item.shortened_url}
                    </Text>
                    <Text style={{ fontSize: 15 }}>{item.original_url}</Text>
                    <Text style={{ fontSize: 20 }}>
                      ..................................................
                    </Text>
                    <Text>{item.current_date}</Text>
                  </View>
                </View>
              )}
            />
          ) : this.state.loading === true &&
            this.state.URL_List_Data.length === 0 ? (
            <View>
              <PacmanIndicator size={100} color="#0B5798" />
            </View>
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 50,
              }}
            >
              <Image
                source={require("../../images/NoDataImage.png")}
                style={{ height: 300, width: 300 }}
              />
              <Text style={{ fontSize: 30, fontWeight: "bold" }}>No Data</Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  InputBox: {
    marginHorizontal: 10,
  },
  URL_List: {
    height: "80%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
