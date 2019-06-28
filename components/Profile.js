import React from 'react';
import {
  View,
  FlatList,
  Button,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import LoginScreen from './Login';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-easy-toast';
import { Icon } from 'react-native-elements';
import DialogInput from 'react-native-dialog-input';
var _ = require('lodash');

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      isDialogVisible1: false,
      isDialogVisible2: false,
      inputText1: '',
      inputText2: '',
      update: false
    };
  }

  componentDidUpdate() {
    if (this.state.update == true) {
      return fetch('http://54.89.43.223:3000/api/user/change_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.props.navigation.getParam('token'),
        },
        body: JSON.stringify({
          email: this.props.navigation.getParam('email'),
          old: this.state.inputText1,
          new: this.state.inputText2,
        }),
      })
        .then(response => {
          const result = JSON.parse(response._bodyInit);
          this.setState({ update: false });
          if (result.statusCode == 200) {
            this.refs.toast.show(result.statusMessage);
          } else {
            this.refs.toast.show(result.statusMessage);
          }
        })
        .catch(err => console.error(err));
    }
  }

  componentDidMount() {
    return fetch('http://54.89.43.223:3000/api/core/data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.props.navigation.getParam('token'),
      },
    })
      .then(response => {
        const result = JSON.parse(response._bodyInit);
        if (result.statusCode == 200) {
          if (this.state.data == '') {
            this.setState({ data: result.globalTickets });
          }
        } else {
          this.refs.toast.show(result.statusMessage);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    if (this.state.data == '') {
      return <ActivityIndicator />;
    } else {
      const val1 = this.state.data;
      var tp1 = [];
      _.forEach(val1, function(val2, index) {
        _.forEach(val2, function(val3, key1) {
          tp1.push(key1);
        });
      });
      var p = [
        {
          key: 'Mail_id',
          value: this.props.navigation.getParam('email').split(','),
        },
        {
          key: 'Company',
          value: this.props.navigation.getParam('company').split(','),
        },
        {
          key: 'Designation',
          value: this.props.navigation.getParam('designation').split(','),
        },
        {
          key: 'Fields',
          value: tp1,
        },
      ];
      const { navigate } = this.props.navigation;
      return (
        <View style={{ flex: 1 }}>
        <DialogInput
              isDialogVisible={this.state.isDialogVisible1}
              title={'Old Password'}
              secureTextEntry={true}
              message={'Enter your old password'}
              hintInput={'old password'}
              submitInput={inputText => {
                this.setState({
                  inputText1: inputText,
                  isDialogVisible1: false,
                  isDialogVisible2:true
                });
              }}
              closeDialog={() => {
                this.setState({ isDialogVisible1: false });
              }}
            />
            <DialogInput
              isDialogVisible={this.state.isDialogVisible2}
              secureTextEntry={true}
              title={'New Password'}
              message={'Enter your new password'}
              hintInput={'new password'}
              submitInput={inputText => {
                this.setState({
                  inputText2: inputText,
                  isDialogVisible2: false,
                  update: true,
                });
              }}
              closeDialog={() => {
                this.setState({ isDialogVisible2: false });
              }}
            />
          <View style={{ alignItems: 'flex-end', flex: 1 }}>
            <Icon
              reverse
              raised
              name="logout"
              type="simple-line-icon"
              size={20}
              color="blue"
              underlayColor="red"
              containerStyle={{ color: 'black' }}
              onPress={() => {
                Alert.alert('Do you want to signout?', '', [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Signout',
                    style: 'default',
                    onPress: () => this.props.navigation.navigate('Login'),
                  },
                ]);
              }}
            />
          </View>
          <View style={{ flex: 8 }}>
            <FlatList
              data={p}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      paddingLeft: 10,
                    }}>
                    <Text style={{ fontSize: 20 }}>{item.key}</Text>
                  </View>
                  <View
                    style={{
                      flex: 2,
                      paddingLeft: 10,
                    }}>
                    <FlatList
                      data={item.value}
                      renderItem={({ item }) => (
                        <Text style={{ fontSize: 20 }}>{item}</Text>
                      )}
                      keyExtractor={({ item }, index) => item}
                    />
                  </View>
                </View>
              )}
              keyExtractor={({ key }, index) => key}
            />
            <Toast
              ref="toast"
              position="top"
              style={{ backgroundColor: 'red' }}
            />
          </View>
          <View style={{ flex: 3, padding: 30 }}>
            <Button
              title="Request new field(s)"
              onPress={() => {
                this.props.navigation.navigate('Request', {
                  token: this.props.navigation.getParam('token'),
                  fields: tp1,
                  designation: this.props.navigation.getParam('designation'),
                  update: true,
                });
              }}
            />
            <Text />
            <Button
              title="Change Password"
              onPress={() => {
                this.setState({isDialogVisible1:true});
              }}
            />
          </View>
        </View>
      );
    }
  }
}
