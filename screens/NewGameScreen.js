import React, {useState, useEffect} from 'react';

import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Animated,
  Modal
} from 'react-native';

import Blink from '../components/Blink';

var Sound = require('react-native-sound');

const  NewGameScreen = ({navigation}) => {
    const [round, setRound] = useState(0);
    const [isUserTurn, setIsUserTurn] = useState(false);
    const [clickedTile, setClickedTile] = useState();
    const [userMessage, setUserMessage] = useState();
    const [generatedSequence, setGeneratedSequence] = useState([]);
    const [userSequence, setUserSequence] = useState([]);
    const [animatedOpacity, setAnimatedOpacity] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const tiles = ['yellow', 'green', 'blue', 'red'];
    const startGameText = "Start Game";
    const [soundsArr, setSoundsArr] = useState([]);
    const tileNameToColor = {'yellow' : '#FFE001', 'green' : "#89B524", 'blue' : "#1D57E9", 'red' : "#DD3F4D"};

      useEffect(() => {
        const arr = []
        if(!soundsArr.length){
        for (var i = 0; i < tiles.length; i++) {
          let soundName = tiles[i];
          arr[soundName] = new Sound(soundName + '.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
              console.log('failed to load sound for ' + soundName + '.mp3' + ' tile', error);
            } else {
              console.log('Sound for ' + soundName + ' tile was successfully load');
            }
          });
        }
        setSoundsArr(arr);
        }
      }, []);

    playSound = (color) => {
        soundsArr[color].play((success) => {
          !success ? console.log('Failed to play ' + color + ' sound') : null;
        });
      }

    const generateRandomStep = () => {
        return tiles[Math.floor(Math.random() * tiles.length)];
    }

    const nextRound = () => {
        var newGeneratedArray = [...generatedSequence, generateRandomStep()];
        setGeneratedSequence(generatedSequence => newGeneratedArray);
        setUserSequence([]);
        var newRound = round + 1;
        setRound(round + 1);
        setUserMessage("Remember Sequence");
        console.log("Round " + newRound + " Sequence ", newGeneratedArray);
        playRound(newRound, newGeneratedArray);
    }

    useEffect(() => {
     if(clickedTile){
        console.log("clickedTile " + clickedTile.color);
        setTimeout(() => {
          setClickedTile();
        }, (clickedTile.index + 1) * 600);
     }
    }, [clickedTile]);

    const playRound = (newRound, newGeneratedArray) => {
        newGeneratedArray.forEach((color, index) => {
            setTimeout(() => {
              setClickedTile({"color" : color, "index" : index});
              playSound(color);
            }, (index + 1) * 600);
      });

        setTimeout(() => {
              setUserMessage("Your turn. Tap " + newRound + (newRound == 1 ? " time" : " times"));
              setIsUserTurn(true);
          }, 2000);
    }

    const startGame = () => {
        setRound(0);
        setUserSequence([]);
        setGeneratedSequence([]);
        nextRound();
    }

    const onTilePress = (color) => {
        if(color == generatedSequence[userSequence.length]){
            if(userSequence.length + 1 == generatedSequence.length){
                Alert.alert(
                  "",
                  "Success",
                  [
                    {
                      text: "Cancel",
                      style: "cancel"
                    },
                    { text: "OK", onPress: () => nextRound() }
                  ]
              )
            }
            setUserSequence(userSequence => [...userSequence, color]);
        }else{
            setIsUserTurn(false);
            setModalVisible(true);
        }
    }

    const renderTile = (color) => {
        var opacity = (clickedTile && color == clickedTile.color) ? 0.2 : 1;
        var backgroundColor = tileNameToColor[color];
        var elem = <TouchableOpacity onPress={() => {onTilePress(color)}} ><Animated.View style={[styles.tileStyle, {backgroundColor:backgroundColor, opacity: opacity}]}></Animated.View></TouchableOpacity>;
        return elem;
    }

  return (
    <View style={{ flex: 1, backgroundColor : 'white'}}>
        <Modal animationType="slide" visible={modalVisible} transparent = {true} onRequestClose={() => { setModalVisible(!modalVisible); }}>
            <View style={styles.modalViewStyle}>
                <Text style={styles.textStyle}>Game Over</Text>
                <Text style={styles.textStyle}>Your score is {round}</Text>
                <TouchableOpacity style = {[styles.buttonStyle, styles.textStyle]}
                  onPress={() => {setModalVisible(!modalVisible); startGame()}}>
                  <Text style={styles.textStyle}>{"New Game"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {[styles.buttonStyle, styles.textStyle]}
                  onPress={() => navigation.navigate('ScoresTable', { score: round })}>
                  <Text style={styles.textStyle}>{"Share Score"}</Text>
                </TouchableOpacity>
            </View>
        </Modal>
        <View style={{ height: '20%', alignItems: 'center', justifyContent: 'center'}}>
            {!round && <TouchableOpacity style = {styles.buttonStyle} onPress={startGame}><Blink><Text style={styles.textStyle}>{startGameText}</Text></Blink></TouchableOpacity>}
            {isUserTurn && <Text style={styles.textStyle}>{userMessage}</Text>}
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'flex-start',height: '100%'}}>
          <View style={{ flexDirection: 'row'}}>
            {renderTile('yellow')}
            {renderTile('green')}
          </View>
          <View style={{ flexDirection: 'row'}}>
             {renderTile('blue')}
             {renderTile('red')}
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tileStyle: {
    width: 150,
    height: 150,
    borderRadius: 20,
    margin: 15
  },
  textStyle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  buttonStyle: {
    borderWidth: 1,
    borderRadius: 50,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor : 'white',
    width: "50%",
    margin: 20
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
    height: "70%"
  }
  });

export default NewGameScreen;
