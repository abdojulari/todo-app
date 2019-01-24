import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import Note from './Note';
import firebase from 'firebase';

// Initialize Firebase
    const config = {
        apiKey: "AIzaSyAB3bO5C7pcLYv745DwwPqUicAshRTdzYk",
        authDomain: "mytodo-6b198.firebaseapp.com",
        databaseURL: "https://mytodo-6b198.firebaseio.com",
        projectId: "mytodo-6b198",
        storageBucket: "",
        messagingSenderId: "314761285731"
    };
 
  firebase.initializeApp(config);
export default class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            noteArray: [],
            noteText: '',
        };
        this.addNote = this.addNote.bind(this);
        this.deleteNote = this.deleteNote.bind(this);
    }
    componentDidMount(){

        firebase.database()
        .ref()
        .child("todo")
        .once("value", snapshot => {
            const data = snapshot.val()
            if (snapshot.val()){
                const initNoteArray = [];
                Object
                .keys(data)
                .forEach(noteText => initNoteArray.push(data[noteText]));
                this.setState({
                    noteArray: initNoteArray
                });
            }
        });
        firebase.database()
        .ref()
        .child("todo")
        .on("child_added", snapshot => {
            const data = snapshot.val();
            if (data){
                this.setState(prevState => ({
                    noteArray: [data, ...prevState.noteArray]
                }))
                console.log(this.state.noteArray);
            }
        })
    }
    addNote(){
        // firebase function here to send to the database
        if (!this.state.noteText) return;
        var d = new Date();
        const newNote =  firebase.database().ref()
                              .child("todo")
                              .push ();
        newNote.set({
            'date':d.getFullYear()+
            "/"+(d.getMonth()+1) +
            "/"+ d.getDate(),
            'note': this.state.noteText
        });
        this.setState({noteText:''});
    }
       
    render() {
        let notes = this.state.noteArray.map((val, key)=>{
            return <Note key={key} keyval={key} val={val}
                    deleteMethod={()=>this.deleteNote(key)}/>
        });
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Todo App</Text>
                </View>
                <ScrollView style={styles.scrollContainer}>
                 {notes}
                </ScrollView>
                <View style={styles.footer}>
                    <TextInput 
                        style={styles.textInput}
                        placeholder='>note'
                        onChangeText={(noteText)=> this.setState({noteText})}
                        value={this.state.noteText}
                        placeholderTextColor='white'
                        underlineColorAndroid='transparent'>
                    </TextInput>
                </View>
                <TouchableOpacity onPress={ this.addNote } style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add Note</Text>
                </TouchableOpacity>
            </View>
        );
    }
    deleteNote(key){
       // var db = this.fdb.database.ref();
        var query = firebase.database().ref('todo').orderByKey();
        query.once("value")
          .then(function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var pkey = childSnapshot.key; 
            var chval = childSnapshot.val;
            //check if remove this child
            if(chval.note == key.note && chval.date == key.date){
                firebase.database().ref().child("todo/"+pkey).remove();
              return true;
            }
    
          });
        });
        this.state.noteArray.splice(key, 1);
        this.setState({noteArray: this.state.noteArray});
    } 

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: '#E91E63',
        alignItems: 'center',
        justifyContent:'center',
        borderBottomWidth: 10,
        borderBottomColor: '#ddd'
    },
    headerText: {
        color: 'white',
        fontSize: 18,
        padding: 26
    },
    scrollContainer: {
        flex: 1,
        marginBottom: 100
    },
    footer: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10
    },
    textInput: {
        alignSelf: 'stretch',
        color: '#fff',
        padding: 20,
        backgroundColor: '#252525',
        borderTopWidth:2,
        borderTopColor: '#ededed',
        marginBottom: 30
    },
    addButton: {
        position: 'absolute',
        zIndex: 11,
        right: 20,
        bottom: 90,
        backgroundColor: '#E91E63',
        width: 70,
        height: 40,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8
    },
    addButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
    }
});