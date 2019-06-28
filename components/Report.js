import React from 'react'
import { LineChart, XAxis, Grid } from 'react-native-svg-charts'
import Toast from 'react-native-easy-toast';
import { View, FlatList, Button, ActivityIndicator, Text } from 'react-native';
var _ = require('lodash');

export default class ReportScreen extends React.Component {
  constructor(props){
    super(props)
    this.state={
      rep:''
    }
  }
  componentDidMount(){
    return fetch('http://54.89.43.223:3000/api/report',{
      method: 'GET',
      headers:{
        "Content-Type": 'application/json',
        "Authorization": this.props.navigation.getParam('token')
      }
    })
    .then(response=>{
      const result=JSON.parse(response._bodyInit);
      if(result.statusCode==200){
        this.setState({rep:result})
      }else{
        this.refs.toast.show(result.message)
      }
    })
  }
  render(){
    if(this.state.rep==''){
      return(
        <ActivityIndicator/>
      )
    }else{
      var l=[]
      _.forEach(this.state.rep,function(value,key){
        l.push({
          key: key,
          value: value
        })
      })
      _.pull(l, l[0])
      return(
        <View>
        <FlatList
          data={l}
          renderItem={({ item }) => (
                  <View
                    style={{
                      flex: 1,
                      borderBottomWidth: 1,
                    }}>
                    <View
                      style={{
                        flex: 2,
                        paddingLeft:10
                      }}>
                      <Text style={{fontSize:20, color:'brown'}}>{item.key}</Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        paddingLeft:10,
                        alignItems:'flex-end'
                      }}>
                      <Text style={{fontSize:20}}>{item.value}</Text>
                    </View>
                  </View>
                )}
          keyExtractor={({item})=>item}
          />
        </View>
      )
    }
  }
}