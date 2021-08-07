import React, {useEffect, useRef, useState} from 'react';
import {LineChart} from 'react-native-chart-kit';
import {
  ScrollView,
  Dimensions,
  StyleSheet,
  View,
  TextInput,
  Alert,
} from 'react-native';
import {Surface, withTheme} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';
// import { ThemeProvider } from '@react-navigation/native';

// Connction to access the pre-populated user_db.db
const db = openDatabase({name: 'app_database.db', createFromLocation: 1});

const margin = 13;

const DataTrendView = ({route, navigation, theme}) => {
  const mounted = useRef(true);
  const [dataItems, setDataItems] = useState('');
  const labels = useRef([]);
  const dataset = useRef([]);
  const [kksPlaceholder, setKKsPlaceholder] = useState('KKS');

  useEffect(() =>
    navigation.addListener('focus', () => {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM data_input_table', [], (_tx, results) => {
          var temp = [];
          console.log(results.rows.length);
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          if (mounted.current) {
            setDataItems(temp);
            upDateTrendQR();
          }
        });
      });
    }),
  );

  const upDateTrendQR = () => {
    try {
      console.log(route.params.kks);
      upDateTrend(route.params.kks);
      setKKsPlaceholder(route.params.kks);
    } catch (err) {
      console.log(err);
    }
  };

  // Cleanup Fuction
  useEffect(() => {
    return function cleanup() {
      mounted.current = false;
    };
  }, []);

  // Line Chart Data and configuration Start-----------------//
  const [dataLineChart, setdataLineChart] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
        ],
      },
    ],
  });

  const lineChartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(38, 64, 148, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(38, 64, 148, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#18A558',
    },
  };
  // Line Chart Data and configuration End-----------------//

  const upDateTrend = kks => {
    try {
      dataset.current = dataItems.filter(x => x.kks === kks).map(x => x.value);
      labels.current = dataItems
        .filter(x => x.kks === kks)
        .map(x => x.date.slice(4, 10));
      if (dataset.current.length === 0 || labels.current.length === 0) {
        Alert.alert('No Entry For this KKS');
        return;
      }
      if (mounted.current) {
        setdataLineChart({
          labels: labels.current,
          datasets: [
            {
              data: dataset.current,
            },
          ],
        });
      }
    } catch (err) {
      Alert.alert('Somethings seems to be not right, try again later');
      return;
    }
  };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <ScrollView style={{flex: 1, backgroundColor: theme.colors.primary}}>
      <View style={styles.container}>
        <Surface style={styles.input}>
          <TextInput
            style={{...styles.inputText, color: theme.colors.primary}}
            placeholder={kksPlaceholder}
            placeholderTextColor= {theme.colors.primary}
            // onChangeText={kks => setKks(kks)}
            onSubmitEditing={({nativeEvent}) => upDateTrend(nativeEvent.text)}
            // value={kks}
          />
        </Surface>
        <View>
          <LineChart
            data={dataLineChart}
            width={Dimensions.get('window').width - margin * 2}
            height={270}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1}
            verticalLabelRotation={45}
            chartConfig={lineChartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: margin,
  },
  input: {
    padding: 10,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
  inputText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#18A558',
    padding: 0,
    height: 30,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
});

export default withTheme(DataTrendView);
