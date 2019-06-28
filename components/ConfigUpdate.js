import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Picker,
  AppRegistry,
  Switch,
  Alert,
  Platform,
  ActionSheetIOS,
  Button,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import Toast from 'react-native-easy-toast';
var _ = require('lodash');

export default class ConfigUpdateScreen extends React.Component {
  static navigationOptions = {
    title: 'Setting configuration',
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: 'true',
      Tier: '',
      Designation: 'Select',
      configAvailable: '',
      fields: [],
    };
  }
  componentDidMount() {
    return fetch('http://54.89.43.223:3000/api/config/available', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.props.navigation.getParam('token'),
      },
    })
      .then(response => {
        const result = JSON.parse(response._bodyInit);
        if (result.statusCode == 200) {
          this.setState({
            configAvailable: result.configuration.sort(
              (a, b) => a.field > b.field
            ),
          });
          this.setState({ isLoading: false });
        } else {
          this.refs.toast.show(result.statusMessage);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  renderElement1() {
    const config = this.props.navigation.getParam('Data');
    if (Platform.OS === 'android') {
      return (
        <Picker
          selectedValue={this.state.Tier}
          style={{ height: 25, width: 200, borderBottomWidth: 1 }}
          onValueChange={(itemValue, itemIndex) => {
            const tt = itemValue;
            this.setState({ Tier: itemValue });
            const ft = _.find(config, { tier: tt });
            if (ft != null) {
              this.setState({
                fields: ft.fields,
              });
            } else {
              this.setState({
                fields: [],
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
          style={{ fontSize: 20 }}
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
                  this.setState({ Tier: 1, Designation: 'CEO/MD' });
                } else if (buttonIndex === 2) {
                  this.setState({ Tier: 2, Designation: 'H.R. manager' });
                } else if (buttonIndex === 3) {
                  this.setState({ Tier: 3, Designation: 'PHP developer' });
                } else if (buttonIndex === 4) {
                  this.setState({ Tier: 4, Designation: 'App developer' });
                } else if (buttonIndex === 5) {
                  this.setState({ Tier: 5, Designation: 'Project manager' });
                } else if (buttonIndex === 6) {
                  this.setState({ Tier: 6, Designation: 'General manager' });
                } else if (buttonIndex === 7) {
                  this.setState({
                    Tier: 7,
                    Designation: 'Business development manager',
                  });
                } else if (buttonIndex === 8) {
                  this.setState({
                    Tier: 8,
                    Designation: 'Internet marketing head',
                  });
                } else if (buttonIndex === 9) {
                  this.setState({ Tier: 9, Designation: 'Content writter' });
                } else if (buttonIndex === 10) {
                  this.setState({
                    Tier: 10,
                    Designation: 'System administrator',
                  });
                }
                const ft = _.find(config, { tier: this.state.Tier });
                if (ft != null) {
                  this.setState({
                    fields: ft.fields,
                  });
                } else {
                  this.setState({
                    fields: [],
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

  renderElement2() {
    const temp = this.state.fields;
    const token = this.props.navigation.getParam('token');
    if (this.state.Tier != 0) {
      return (
        <View style={{ flex: 11 }}>
          <View style={{ flex: 10 }}>
            <FlatList
              data={this.state.configAvailable}
              extraData={this.state}
              renderItem={({ item }) => (
                <TouchableHighlight
                  onPress={() => {
                    _.includes(temp, item.field)
                      ? _.pull(temp, item.field)
                      : temp.push(item.field);
                    this.setState({
                      fields: temp,
                    });
                  }}>
                  <View
                    style={[
                      {
                        flexDirection: 'row',
                        flex: 1,
                      },
                      _.includes(this.state.fields, item.field)
                        ? { backgroundColor: 'yellow' }
                        : null,
                    ]}>
                    <View
                      style={{
                        flex: 1,
                      }}>
                      <Text style={[{ fontSize: 20, color: 'brown' }]}>
                        {item.field}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                      }}>
                      <Text style={{ fontSize: 20 }}>{item.inferredType}</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
              keyExtractor={({ tier }, index) => tier}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Set Configuration"
              onPress={() => {
                if (this.state.fields == '') {
                  this.refs.toast.show('Select atleast one field');
                } else {
                  Alert.alert(
                    'Confirmation!',
                    'Do you want to set the configuration?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Set',
                        style: 'default',
                        onPress: () =>
                          fetch('http://54.89.43.223:3000/api/config', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: token,
                            },
                            body: JSON.stringify({
                              tier: this.state.Tier,
                              fields: this.state.fields,
                            }),
                          })
                            .then(response => {
                              const result = JSON.parse(response._bodyInit);
                              if (result.statusCode == 200) {
                                this.refs.toast.show(result.statusMessage);
                                const { navigate } = this.props.navigation;
                                setTimeout(function() {
                                  navigate('Config', {
                                    update: true,
                                    token: token,
                                  });
                                }, 1000);
                              } else {
                                this.refs.toast.show(result.statusMessage);
                              }
                            })
                            .catch(err => console.error(err)),
                      },
                    ],
                  );
                }
              }}
            />
          </View>
          <Toast
            ref="toast"
            position="top"
            style={{ backgroundColor: 'red' }}
          />
        </View>
      );
    }
  }

  render() {
    if (this.state.isLoading == true) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={{ flex: 2 }}>
              <Text style={{ fontSize: 20 }}>Designation</Text>
            </View>
            <View style={{ flex: 3 }}>{this.renderElement1()}</View>
          </View>
          {this.renderElement2()}
        </View>
      );
    }
  }
}
