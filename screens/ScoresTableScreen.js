import React ,{useState, useEffect} from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  AsyncStorage,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';

import Data from "../Data"


const setScoresData = async (data) => {
   try {
     const scores = await JSON.stringify(data);//merge new score
     console.log("After stringify ", scores);
     await AsyncStorage.setItem(
       "scores",
        scores
     );
   } catch (error) {
     console.log("Error when set scores array", error);
   }
 };

const getScoresData = async () => {
   try {
     let scores = await AsyncStorage.getItem('scores');
     if (scores) {
        console.log(scores);
        const scores = await JSON.parse(scores);
        console.log("scores", scores);
        return scores;
     }
   } catch (error) {
     console.log("Error when get scores array", error);
   }
 };


const renderTextItem = (text) => {
    return <Text style={styles.listItemTextStyle}>{text}</Text>;
}

const renderItem = ({item}) => {
    return <View style={styles.listItemViewStyle}>{renderTextItem(item.name)}{renderTextItem(item.score)}</View>;
}


function ScoresTableScreen({route}) {
    let score;

    if(route && route.params){
        score = route.params.score;
    }

    const [modalVisible, setModalVisible] = useState(score ? true : false);
    const [name, setName] = useState("");
    /*const [data, setData] = useState();
    if(!data){
        setData(getScoresData());
    }*/

    const addScorePress = (score) => {
        if(name && name.length){
            setModalVisible(!modalVisible);
            var newScore = {name: name, score: score};
            Data.push(newScore)
            //setScoresData([...data, newScore]);
        }
    }

  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor : 'white'}}>
        <Modal style={{position: 'absolute'}} animationType="slide" visible={modalVisible} transparent = {true} onRequestClose={() => { setModalVisible(!modalVisible)}}>
            <View style={styles.modalViewStyle}>
                <View View style={{ flex: 1.5, alignItems: 'center', justifyContent: 'flex-start', margin: 15, width: "80%"}}>
                    <Text style={styles.textStyle}>{"Your Score: " + score}</Text>
                    <TextInput style = {styles.textInputStyle}
                        placeholder="Your name..."
                        onChangeText={newName => setName(newName)}
                      />
                </View>
                <View style={{ flex: 1, flexDirection: "row", alignItems: 'center', margin: 15}}>
                    <TouchableOpacity style = {[styles.buttonStyle, styles.textStyle]}
                      onPress={() => setModalVisible(!modalVisible)}>
                      <Text style={styles.textStyle}>{"Cancel"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {[styles.buttonStyle, styles.textStyle]}
                      onPress={() => {addScorePress(score)}}>
                      <Text style={styles.textStyle}>{"Add Score"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        <View style={{flex: 1, margin: 30}}>
            <FlatList
                data={Data}
                renderItem={renderItem}
                keyExtractor={item => item.name}
              />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    listItemTextStyle: {
        fontSize: 20,
        color: 'black',
        flex: 1
    },
    listItemViewStyle: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 8,
        flex: 1,
        width: '100%'
    },
    modalViewStyle: {
         margin: 20,
         backgroundColor: "white",
         borderRadius: 20,
         alignItems: "center",
         justifyContent: 'center',
         shadowColor: "#000",
         shadowOffset: {
           width: 0,
           height: 2
         },
         shadowOpacity: 0.25,
         shadowRadius: 4,
         elevation: 5,
         height: "35%"
   },
   buttonStyle: {
        flex: 1,
       borderWidth: 1,
       borderRadius: 50,
       padding: 15,
       alignItems: 'center',
       justifyContent: 'center',
       backgroundColor : 'white',
       width: "40%",
       margin: 15
     },
    textStyle: {
        flex: 1,
         fontSize: 20,
         fontWeight: 'bold'
    },
    textInputStyle: {
        width: "100%",
        fontSize: 20,
        fontWeight: 'bold',
        borderWidth: 1,
        borderRadius: 50,
        margin: 20,
        flex: 1
    }
  });

export default ScoresTableScreen;
