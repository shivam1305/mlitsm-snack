import React from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  KeyboardAvoidingView,
  Picker,
  Platform,
  PickerIOS,
  ActionSheetIOS,
} from 'react-native';
import Toast from 'react-native-easy-toast';
import { Icon } from 'react-native-elements';
import { TabScene } from 'react-navigation';

export default class SignupScreen extends React.Component {
  static navigationOptions = {
    title: 'Signup',
  };

  constructor(props) {
    super(props);
    this.state = {
      Mail_id: '',
      Password: '',
      Password_correctness: true,
      Validate_Password: true,
      Confirm_Password: '',
      Company_Name: '',
      Designation: 'Select',
      Tier: '',
    };
  }

  validate(text) {
    if (this.state.Password == text) {
      this.setState({ Validate_Password: true });
    } else {
      this.setState({ Validate_Password: false });
    }
    this.setState({ Confirm_Password: text });
  }
  correctness(text) {
    if (text.length.toString() >= 8) {
      this.setState({ Password_correctness: true });
    } else {
      this.setState({ Password_correctness: false });
    }
    this.setState({ Password: text });
  }
  renderElement() {
    if (Platform.OS === 'android') {
      return (
        <Picker
          selectedValue={this.state.Tier}
          style={{ height: 25, width: 200, borderBottomWidth: 1 }}
          onValueChange={(itemValue, itemIndex) => {
            if (itemValue === 1) {
              this.setState({ Tier: 1, Designation: 'CEO/MD' });
            } else if (itemValue === 2) {
              this.setState({ Tier: 2, Designation: 'H.R. manager' });
            } else if (itemValue === 3) {
              this.setState({ Tier: 3, Designation: 'PHP developer' });
            } else if (itemValue === 4) {
              this.setState({ Tier: 4, Designation: 'App developer' });
            } else if (itemValue === 5) {
              this.setState({ Tier: 5, Designation: 'Project manager' });
            } else if (itemValue === 6) {
              this.setState({ Tier: 6, Designation: 'General manager' });
            } else if (itemValue === 7) {
              this.setState({
                Tier: 7,
                Designation: 'Business development manager',
              });
            } else if (itemValue === 8) {
              this.setState({
                Tier: 8,
                Designation: 'Internet marketing head',
              });
            } else if (itemValue === 9) {
              this.setState({ Tier: 9, Designation: 'Content writter' });
            } else if (itemValue === 10) {
              this.setState({
                Tier: 10,
                Designation: 'System administrator',
              });
            }
          }}>
          <Picker.Item label="Select" value={0} />
          <Picker.Item label="CEO/MD" value={1} />
          <Picker.Item label="H.R. manager" value={2} />
          <Picker.Item label="PHP developer" value={3} />
          <Picker.Item label="App developer" value={4} />
          <Picker.Item label="Project manager" value={5} />
          <Picker.Item label="General manager" value={6} />
          <Picker.Item label="Business development manager" value={7} />
          <Picker.Item label="Internet marketing head" value={8} />
          <Picker.Item label="Content writter" value={9} />
          <Picker.Item label="System administrator" value={10} />
        </Picker>
      );
    } else {
      return (
        <Text
          style={{ fontSize: 15 }}
          onPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                options: [
                  'Cancel',
                  'CEO/MD',
                  'H.R. manager',
                  'PHP developer',
                  'App developer',
                  'Project manager',
                  'General manager',
                  'Business development manager',
                  'Internet marketing head',
                  'Content writter',
                  'System administrator',
                ],
                cancelButtonIndex: 0,
              },
              buttonIndex => {
                if (buttonIndex === 1) {
                  this.setState({ Tier: '1', Designation: 'CEO/MD' });
                } else if (buttonIndex === 2) {
                  this.setState({ Tier: '2', Designation: 'H.R. manager' });
                } else if (buttonIndex === 3) {
                  this.setState({ Tier: '3', Designation: 'PHP developer' });
                } else if (buttonIndex === 4) {
                  this.setState({ Tier: '4', Designation: 'App developer' });
                } else if (buttonIndex === 5) {
                  this.setState({ Tier: '5', Designation: 'Project manager' });
                } else if (buttonIndex === 6) {
                  this.setState({ Tier: '6', Designation: 'General manager' });
                } else if (buttonIndex === 7) {
                  this.setState({
                    Tier: '7',
                    Designation: 'Business development manager',
                  });
                } else if (buttonIndex === 8) {
                  this.setState({
                    Tier: '8',
                    Designation: 'Internet marketing head',
                  });
                } else if (buttonIndex === 9) {
                  this.setState({ Tier: '9', Designation: 'Content writter' });
                } else if (buttonIndex === 10) {
                  this.setState({
                    Tier: '10',
                    Designation: 'System administrator',
                  });
                }
              }
            );
          }}>
          {this.state.Designation}
        </Text>
      );
    }
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={{ flex: 1, padding: 10 }}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={{ flex: 2 }}>
              <Text style={{ fontSize: 15 }}>Mail_id</Text>
            </View>
            <View style={{ flex: 3 }}>
              <TextInput
                style={{
                  height: 25,
                  paddingLeft: 6,
                  fontSize: 15,
                  borderBottomWidth: 1,
                }}
                placeholder="Mail_id"
                keyboardType={'email-address'}
                onChangeText={text => {
                  this.setState({ Mail_id: text });
                }}
                onSubmitEditing={() => {
                  this.PasswordInput.focus();
                }}
                blurOnSubmit={false}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={{ flex: 2 }}>
              <Text style={{ fontSize: 15 }}>Password</Text>
            </View>
            <View style={{ flex: 3 }}>
              <TextInput
                style={[
                  {
                    height: 25,
                    paddingLeft: 6,
                    fontSize: 15,
                    borderBottomWidth: 1,
                  },
                  !this.state.Password_correctness
                    ? { borderBottomColor: 'red' }
                    : null,
                ]}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={text => {
                  this.correctness(text);
                }}
                onSubmitEditing={() => {
                  {
                    if (this.state.Password_correctness == true) {
                      this.ConfirmPasswordInput.focus();
                    } else {
                      this.refs.toast.show(
                        'Password too short, minimum length should be 8'
                      );
                    }
                  }
                }}
                blurOnSubmit={false}
                ref={input => {
                  this.PasswordInput = input;
                }}
              />
              <Toast
                ref="toast"
                position="top"
                style={{ backgroundColor: 'red' }}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={{ flex: 2 }}>
              <Text style={{ fontSize: 15 }}>Confirm_Password</Text>
            </View>
            <View style={{ flex: 3 }}>
              <TextInput
                style={[
                  {
                    height: 25,
                    paddingLeft: 6,
                    fontSize: 15,
                    borderBottomWidth: 1,
                  },
                  !this.state.Validate_Password
                    ? { borderBottomColor: 'red' }
                    : null,
                ]}
                placeholder="Confirm_Password"
                secureTextEntry={true}
                onChangeText={text => {
                  this.validate(text);
                }}
                onSubmitEditing={() => {
                  {
                    if (this.state.Validate_Password == true) {
                      this.CompanyInput.focus();
                    } else {
                      this.refs.toast.show('Password not matching');
                    }
                  }
                }}
                blurOnSubmit={false}
                ref={input => {
                  this.ConfirmPasswordInput = input;
                }}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={{ flex: 2 }}>
              <Text style={{ fontSize: 15 }}>Company_Name</Text>
            </View>
            <View style={{ flex: 3 }}>
              <TextInput
                style={{
                  height: 25,
                  paddingLeft: 6,
                  fontSize: 15,
                  borderBottomWidth: 1,
                }}
                placeholder="Company_name"
                onChangeText={text => {
                  this.setState({ Company_Name: text });
                }}
                ref={input => {
                  this.CompanyInput = input;
                }}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={{ flex: 2 }}>
              <Text style={{ fontSize: 15 }}>Designation</Text>
            </View>
            <View style={{ flex: 3 }}>{this.renderElement()}</View>
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Signup"
              onPress={() => {
                console.log('des..', this.state.Designation);
                console.log('tier..',this.state.Tier)
                fetch('http://54.89.43.223:3000/api/user/signup', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    email: this.state.Mail_id,
                    password: this.state.Password,
                    tier: this.state.Tier, 
                    company: this.state.Company_Name,
                    designation: this.state.Designation,
                  }),
                })
                  .then(response => {
                    const obj = JSON.parse(response._bodyInit);
                    if (obj.statusCode == 201) {
                      this.refs.toast.show(obj.statusMessage);
                      setTimeout(function() {
                        navigate('Login');
                      }, 1000);
                    }
                    this.refs.toast.show(obj.statusMessage);
                  })
                  .catch(error => {
                    console.error(error);
                  });
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
