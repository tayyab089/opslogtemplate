/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, TouchableOpacity} from 'react-native';
import SectionListComponent from '../Components/SectionListComponent';
import {openDatabase, closeDatabase} from 'react-native-sqlite-storage';

const SectionListView = ({route,navigation}) => {
    let colors = ['#ffffff', '#f5f8ff'];
    const [secData, setSecData] = useState([]);

    // Remove duplicates from dropdown list items
    const removeDuplicates = duplicates => {
      const flag = {};
      const unique = [];
      duplicates.forEach(elem => {
        if (!flag[elem.area]) {
          flag[elem.area] = true;
          unique.push(elem);
        }
      });
      return unique;
    };

    useEffect(
      () =>
        navigation.addListener('focus', () => {
          // Connction to access the pre-populated db
          const db = openDatabase({
            name: 'app_database.db',
            createFromLocation: 1,
          }); //Could have opened the connection outsie the component if no close is requied
          db.transaction(tx => {
            tx.executeSql('SELECT * FROM reference_table', [], (_tx, results) => {
              var temp = [];
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }
              setSecData(removeDuplicates(temp.filter(item => item.category === route.params.section)));
              closeDatabase({name: 'app_database.db', createFromLocation: 1}); // Not sure if this line is needed, need to see when finalizing
            });
          });
        }),
      [],
    );
    const renderItem = ({ item, index }) => (
        <TouchableOpacity
        style={{backgroundColor: colors[index % colors.length]}}
        onPress={() => navigation.navigate('AreaListView', {area : item.area})}>
            <SectionListComponent title={item.area}/>
        </TouchableOpacity>
      );
    return (
        <SafeAreaView>
            <FlatList
                data={secData}
                renderItem={renderItem}
                keyExtractor={(_item, index) => index.toString()}
            />
        </SafeAreaView>

    );
};

export default SectionListView;
