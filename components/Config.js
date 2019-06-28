import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Card,
  Alert,
  ActivityIndicator,
  FlatList,
  Button,
} from 'react-native';
import Toast from 'react-native-easy-toast';
import FAB from 'react-native-fab';
import { Icon } from 'react-native-elements';

export default class ConfigScreen extends React.Component {
  static navigationOptions = {
    title: 'Configuration',
  };
  constructor(props) {
    super(props);
    this.state = {
      result: '',
      isLoading: true,
    };
  }

  componentDidUpdate() {
    return fetch('http://54.89.43.223:3000/api/config', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.props.navigation.getParam('token'),
      },
    })
      .then(response => {
        const result = JSON.parse(response._bodyInit);
        if (result.statusCode == 200) {
          if (this.props.navigation.getParam('update') == true) {
            this.props.navigation.navigate('Config', { update: false });
            this.setState({ result: result.result, isLoading: false });
          }
        } else {
          this.refs.toast.show(result.message);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  componentDidMount() {
    return fetch('http://54.89.43.223:3000/api/config', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.props.navigation.getParam('token'),
      },
    })
      .then(response => {
        const result = JSON.parse(response._bodyInit);
        if (result.statusCode == 200) {
          this.setState({ result: result.result, isLoading: false });
        } else {
          this.refs.toast.show(result.message);
          this.setState({ isLoading: false });
        }
      })
      .catch(error => {
        console.error(error);
      });
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
      return (
        <View>
          <ActivityIndicator />
          <Toast
            ref="toast"
            position="top"
            style={{ backgroundColor: 'red' }}
          />
        </View>
      );
    } else {
      const token = this.props.navigation.getParam('token');
      if (this.state.result != '') {
        return (
          <View style={{ flex: 1 }}>
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
                onPress={() =>{
                  Alert.alert(
                      'Do you want to signout?',
                      '',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'Signout',
                          style: 'default',
                          onPress: () => this.props.navigation.navigate('Login'),
                        },
                      ],
                      {cancelable: true},
                    );
                }}
              />
            </View>
            <View style={{ flex: 9 }}>
              <FlatList
                data={this.state.result.configurations.sort(
                  (a, b) => a.tier > b.tier
                )}
                extraData={this.state}
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
                  </View>
                )}
                keyExtractor={({ tier }, index) => tier}
              />
            </View>
            <View style={{ flex: 1 }}>
              <FAB
                buttonColor="blue"
                iconTextColor="#FFFFFF"
                onClickAction={() => {
                  this.props.navigation.navigate('ConfigUpdate', {
                    Data: this.state.result.configurations,
                    token: token,
                  });
                }}
                visible={true}
              />
              <Toast
                ref="toast"
                position="top"
                style={{ backgroundColor: 'red' }}
              />
            </View>
          </View>
        );
      } else {
        return (
          <View style={{ flex: 1 }}>
            <Text />
            <FAB
              buttonColor="blue"
              iconTextColor="#FFFFFF"
              onClickAction={() => {
                this.props.navigation.navigate('ConfigUpdate', {
                  Data: this.state.result.configurations,
                  token: token,
                });
              }}
              visible={true}
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
