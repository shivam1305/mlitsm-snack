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

export default class RequestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: 'true',
      configAvailable: '',
      fields: [],
    };
  }
  static navigationOptions = {
    title: 'Request',
  };

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
          this.setState({
            isLoading: false,
            fields: this.props.navigation.getParam('fields'),
          });
        } else {
          this.refs.toast.show(result.statusMessage);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  renderElement2() {
    var temp = this.state.fields;
    console.log(this.props.navigation.getParam('fields'));
    const token = this.props.navigation.getParam('token');
    const obj = {
      'CEO/MD': 1,
      'H.R. manager': 2,
      'PHP developer': 3,
      'App developer': 4,
      'Project manager': 5,
      'General manager': 6,
      'Business development manager': 7,
      'Internet marketing head': 8,
      'Content writter': 9,
      'System administrator': 10,
    };
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
          <Text />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title="Request Configuration"
            onPress={() => {
              if (this.state.fields == '') {
                this.refs.toast.show('Select atleast one field');
              } else {
                Alert.alert(
                  'Confirmation!',
                  'Do you want to request the configuration?',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Set',
                      style: 'default',
                      onPress: () =>
                        fetch('http://54.89.43.223:3000/api/alter', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: token,
                          },
                          body: JSON.stringify({
                            tier:
                              obj[
                                this.props.navigation.getParam('designation')
                              ],
                            fields: this.state.fields,
                          }),
                        })
                          .then(response => {
                            const result = JSON.parse(response._bodyInit);
                            if (result.statusCode == 200) {
                              this.refs.toast.show(result.statusMessage);
                              const { navigate } = this.props.navigation;
                              setTimeout(function() {
                                navigate('Profile');
                              }, 1000);
                            } else {
                              this.refs.toast.show(result.statusMessage);
                            }
                          })
                          .catch(err => console.error(err)),
                    },
                  ]
                );
              }
            }}
          />
        </View>
        <Toast ref="toast" position="top" style={{ backgroundColor: 'red' }} />
      </View>
    );
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
        <View style={{ flex: 1, padding: 20 }}>{this.renderElement2()}</View>
      );
    }
  }
}
