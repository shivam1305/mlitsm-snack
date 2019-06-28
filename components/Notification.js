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

export default class NotificationScreen extends React.Component {
  static navigationOptions = {
    title: 'Requests',
  };

  constructor(props) {
    super(props);
    this.state = {
      req: '',
      fields: [],
      isLoading: true,
    };
  }

  componentDidUpdate() {
    return fetch('http://54.89.43.223:3000/api/alter', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.props.navigation.getParam('token'),
      },
    })
      .then(response => {
        const result = JSON.parse(response._bodyInit);
        if (result.statusCode == 200) {
          if (this.props.navigation.getParam('update')) {
            this.setState({ req: result.requests });
            console.log('U');
            this.props.navigation.navigate('Notification', { update: false });
          }
        } else {
          this.refs.toast.show(result.statusMessage);
        }
      })
      .catch(err => console.error(err));
  }

  componentDidMount() {
    return fetch('http://54.89.43.223:3000/api/alter', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.props.navigation.getParam('token'),
      },
    })
      .then(response => {
        const result = JSON.parse(response._bodyInit);
        if (result.statusCode == 200) {
          this.setState({ req: result.requests, isLoading: false });
          console.log('M');
        } else {
          this.refs.toast.show(result.statusMessage);
        }
      })
      .catch(err => console.error(err));
  }

  renderElement(tier) {
    if (tier === 1) {
      return <Text style={{ fontSize: 20, color: 'brown' }}>CEO/MD</Text>;
    } else if (tier === 2) {
      return <Text style={{ fontSize: 20, color: 'brown' }}>H.R. manager</Text>;
    } else if (tier === 3) {
      return (
        <Text style={{ fontSize: 20, color: 'brown' }}>PHP developer</Text>
      );
    } else if (tier === 4) {
      return (
        <Text style={{ fontSize: 20, color: 'brown' }}>App developer</Text>
      );
    } else if (tier === 5) {
      return (
        <Text style={{ fontSize: 20, color: 'brown' }}>Project manager</Text>
      );
    } else if (tier === 6) {
      return (
        <Text style={{ fontSize: 20, color: 'brown' }}>General manager</Text>
      );
    } else if (tier === 7) {
      return (
        <Text style={{ fontSize: 20, color: 'brown' }}>
          Business development manager
        </Text>
      );
    } else if (tier === 8) {
      return (
        <Text style={{ fontSize: 20, color: 'brown' }}>
          Internet marketing head
        </Text>
      );
    } else if (tier === 9) {
      return (
        <Text style={{ fontSize: 20, color: 'brown' }}>Content writter</Text>
      );
    } else if (tier === 10) {
      return (
        <Text style={{ fontSize: 20, color: 'brown' }}>
          System administrator
        </Text>
      );
    }
  }

  render() {
    if (this.state.isLoading == true) {
      return <ActivityIndicator />;
    } else {
      console.log('noload');
      if (this.state.req.length == 0) {
        return (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, color: 'red' }}>No Request</Text>
          </View>
        );
      } else {
        return (
          <View>
            <FlatList
              data={this.state.req.sort((a, b) => a.tier > b.tier)}
              extraData={this.state}
              renderItem={({ item }) => (
                <TouchableHighlight
                  onPress={() => {
                    Alert.alert(
                      'Confirmation!',
                      'Do you want to change the configuration?',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: ()=>
                            fetch('http://54.89.43.223:3000/api/alter', {
                                    method: 'DELETE',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      Authorization: this.props.navigation.getParam(
                                        'token'
                                      ),
                                    },
                                    body: JSON.stringify({
                                      id: item.id,
                                    }),
                                  })
                                  .then(response => {
                                      const result = JSON.parse(
                                        response._bodyInit
                                      );
                                      if (result.statusCode == 200) {
                                        const {
                                          navigate,
                                        } = this.props.navigation;
                                        const token = this.props.navigation.getParam(
                                          'token'
                                        );
                                        this.refs.toast.show(result.statusMessage)
                                        navigate('Notification', {
                                          update: true,
                                        });
                                      } else {
                                        this.refs.toast.show(
                                          result.statusMessage
                                        );
                                      }
                                    })
                                    .catch(err => console.error(err))
                        },
                        {
                          text: 'Change',
                          style: 'default',
                          onPress: () =>
                            fetch('http://54.89.43.223:3000/api/config', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: this.props.navigation.getParam(
                                  'token'
                                ),
                              },
                              body: JSON.stringify({
                                tier: item.tier,
                                fields: item.fields,
                              }),
                            })
                              .then(response => {
                                const result = JSON.parse(response._bodyInit);
                                if (result.statusCode == 200) {
                                  this.refs.toast.show(result.statusMessage);
                                  fetch('http://54.89.43.223:3000/api/alter', {
                                    method: 'DELETE',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      Authorization: this.props.navigation.getParam(
                                        'token'
                                      ),
                                    },
                                    body: JSON.stringify({
                                      id: item.id,
                                    }),
                                  })
                                    .then(response => {
                                      const result = JSON.parse(
                                        response._bodyInit
                                      );
                                      if (result.statusCode == 200) {
                                        const {
                                          navigate,
                                        } = this.props.navigation;
                                        const token = this.props.navigation.getParam(
                                          'token'
                                        );
                                        navigate('Config', {
                                          update: true,
                                          token: token,
                                        });
                                        navigate('Notification', {
                                          update: true,
                                        });
                                      } else {
                                        this.refs.toast.show(
                                          result.statusMessage
                                        );
                                      }
                                    })
                                    .catch(err => console.error(err));
                                } else {
                                  this.refs.toast.show(result.statusMessage);
                                }
                              })
                              .catch(err => console.error(err)),
                        },
                      ]
                    );
                  }}>
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
                        flex: 2,
                        paddingLeft: 10,
                      }}>
                      {this.renderElement(item.tier)}
                    </View>
                    <View
                      style={{
                        flex: 3,
                        paddingLeft: 10,
                      }}>
                      <FlatList
                        data={item.fields}
                        renderItem={({ item }) => (
                          <Text style={{ fontSize: 20 }}>{item}</Text>
                        )}
                        keyExtractor={({ item }, index) => item}
                      />
                    </View>
                    <Toast
                      ref="toast"
                      position="top"
                      style={{ backgroundColor: 'red' }}
                    />
                  </View>
                </TouchableHighlight>
              )}
              keyExtractor={({ id }, index) => id}
            />
            <Toast
              ref="toast"
              position="top"
              style={{ backgroundColor: 'red' }}
            />
          </View>
        );
      }
    }
  }
}
