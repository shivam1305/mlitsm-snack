import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Button,
} from 'react-native';
import * as scale from 'd3-scale';
var _ = require('lodash');
import { BarChart, Grid, XAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

export default class PlotScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val: '',
      data: '',
    };
  }
  static navigationOptions = {
    title: 'Plot',
  };

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

  renderElement(rank) {
    if (rank == 'HIGH') {
      return <Text style={{fontSize:20, color:'brown'}}>Top-level</Text>;
    } else if (rank == 'MIDDLE') {
      return <Text></Text>;
    } else {
      return <Text></Text>;
    }
  }

  render() {
    if (this.state.data == '') {
      return <ActivityIndicator />;
    } else {
      if (this.state.val == '') {
        const val1 = this.state.data;
        var tp1 = [];
        _.forEach(val1, function(val2, index) {
          _.forEach(val2, function(val3, key1) {
            tp1.push(key1);
            _.forEach(val3, function(val4, key2) {
              tp1.push(val4);
            });
          });
        });
        var tp2 = [];
        for (var i = 0; i < tp1.length; i += 3) {
          var tp5 = [];
          var tp4 = _.countBy(tp1[i + 2], 'value');
          _.forEach(tp4, function(value, key) {
            tp5.push({
              value: value,
              label: key,
            });
          });
          var tp3 = {
            field: tp1[i],
            rank: tp1[i + 1],
            valu: tp5,
          };
          tp2.push(tp3);
        }
        this.setState({ val: tp2 });
        return(
          <ActivityIndicator/>
        )
      } else {
        return ( 
          <FlatList
            data={this.state.val} 
            renderItem={({ item }) => (
              <View style={{ padding: 20 }}>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{fontSize:20}}>{item.field}</Text>
                {this.renderElement(item.rank)}
                </View>
                <BarChart
                  style={{ height: 150 }}
                  data={item.valu}
                  gridMin={0}
                  yAccessor={({ item }) => item.value}
                  svg={{ fill: 'rgb(134, 65, 244)' }}
                  spacing={0.2}
                />
                <XAxis
                  style={{ alignContent: 'center' }}
                  data={item.valu}
                  formatLabel={(value, index) => item.valu[index].label}
                  contentInset={{ left: 30, right: 30 }}
                  svg={{ fontSize: 10, fill: 'black' }}
                />
              </View>
            )}
            keyExtractor={({ item }, index) => item}
          />
        );
      }
    }
  }
}
