import React from 'react';

import {
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor : 'white', alignItems: 'center'}}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: "70%"}}>
          <TouchableOpacity style = {[styles.buttonStyle, styles.textStyle]}
            onPress={() => navigation.navigate('NewGame')}>
            <Text style={styles.textStyle}>{"New Game"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style = {[styles.buttonStyle, styles.textStyle]}
              onPress={() =>  navigation.navigate('ScoresTable')}>
              <Text style={styles.textStyle}>{"Scores Table"}</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black'
  },
  buttonStyle: {
    borderWidth: 1,
    borderRadius: 50,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor : 'white',
    width: "100%",
    margin: 20
  }
  });

export default HomeScreen;