import React from 'react';
import {
  View,
  Text,
  Button,
  Image,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import Toast from 'react-native-easy-toast';
import DialogInput from 'react-native-dialog-input';
import ProfileScreen from './Profile';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome to ML_ITSM!',
  };
  constructor(props) {
    super(props);
    this.state = {
      Mail_id: 'shivampnd089@gmail.com',
      Password: '12345678',
      isDialogVisible: false,
      update: false,
      inputText: '',
    };
  }

  componentDidUpdate() {
    if (this.state.update == true) {
      return fetch('http://54.89.43.223:3000/api/user/reset_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.inputText,
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

  render() {
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={{ flex: 1 }}>
          <View style={{ flex: 3, alignItems: 'center' }}>
            <Text />
            <Text />
            <Image
              source={require('../assets/Home.png')}
              style={{ width: 330, height: 42 }}
            />
          </View>
          <View style={{ flex: 4, padding: 30 }}>
            <View style={{ flex: 3 }}>
              <TextInput
                onChangeText={text => {
                  this.setState({ Mail_id: text });
                }}
                style={{
                  height: 25,
                  paddingLeft: 6,
                  fontSize: 20,
                  borderBottomWidth: 1,
                }}
                placeholder="email"
                value={this.state.Mail_id}
                keyboardType="email-address"
                clearButtonMode="always"
                onSubmitEditing={() => {
                  this.PasswordInput.focus();
                }}
                blurOnSubmit={false}
              />
              <TextInput
                onChangeText={text => {
                  this.setState({ Password: text });
                }}
                style={{
                  height: 25,
                  paddingLeft: 6,
                  fontSize: 20,
                  borderBottomWidth: 1,
                }}
                ref={input => {
                  this.PasswordInput = input;
                }}
                placeholder="Password"
                value={this.state.Password}
                clearButtonMode="always"
                secureTextEntry={true}
              />
              <Text />
              <Button
                title="Login"
                onPress={() => {
                  fetch('http://54.89.43.223:3000/api/user/login', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email: this.state.Mail_id,
                      password: this.state.Password,
                    }),
                  })
                    .then(response => {
                      const obj = JSON.parse(response._bodyInit);
                      if (obj.statusCode == 200) {
                        if (obj.isAdmin == false) {
                          navigate('Profile', {
                            token: obj.token,
                            email: this.state.Mail_id,
                            company: obj.company,
                            designation: obj.designation,
                          });
                          navigate('Plot', {
                            token: obj.token,
                          });
                          navigate('Report', {
                            token: obj.token,
                          });
                        } else {
                          navigate('Notification', {
                            token: obj.token,
                            update: false,
                          });
                          navigate('Config', {
                            token: obj.token,
                            update: false,
                          });
                        }
                        this.setState({ Mail_id: '', Password: '' });
                      } else {
                        this.refs.toast.show(obj.statusMessage);
                      }
                    })
                    .catch(error => {
                      console.error('err..', error);
                    });
                }}
              />
              <Toast
                ref="toast"
                position="top"
                style={{ backgroundColor: 'red' }}
              />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: 'brown',
                  fontWeight: 'bold',
                }}>
                Forgot password?
              </Text>
              <Button
                title="Click here"
                onPress={() => {
                  this.setState({ isDialogVisible: true });
                }}
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            
          </View>
        </View>
        <DialogInput
              isDialogVisible={this.state.isDialogVisible}
              title={'Reset Password'}
              message={'Enter your email'}
              hintInput={'example@gmail.com'}
              submitInput={inputText => {
                this.setState({
                  inputText: inputText,
                  isDialogVisible: false,
                  update: true,
                });
              }}
              closeDialog={() => {
                this.setState({ isDialogVisible: false });
              }}
            />
      </KeyboardAvoidingView>
    );
  }
}
