/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapView from 'react-native-maps';

const Stack = createNativeStackNavigator();

const Home = ({ navigation }) => {
  const [isLoading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const url = 'https://gist.githubusercontent.com/erdem/8c7d26765831d0f9a8c62f02782ae00d/raw/248037cd701af0a4957cce340dabb0fd04e38f4c/countries.json';

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((json) => setCountries(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemTile}
        onPress={() =>
          navigation.navigate('Details', {
            countryName: item.name,
            countryCapital: item.capital,
            countryCode: item.country_code,
            latitude: item.latlng[0],
            longitude: item.latlng[1],
          })
        }
      >
        <View>
          <Text style={styles.countryText}>{item.name} ({item.country_code})</Text>
          <Text>{item.capital}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    isLoading ? <Text>Loading...</Text> :
      <FlatList
        data={countries}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.country_code)}
      />

  );
};

const DetailsScreen = ({ navigation, route }) => {
  const { countryName, countryCode, countryCapital, latitude, longitude } = route.params;
  return (
    <View>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 8,
            longitudeDelta: 0.4,
          }}
        />
      </View>
      <View>
        <Text style={styles.detailTitle}>{countryName}</Text>
        <Text style={styles.otherDetails}>Country Code: {countryCode}</Text>
        <Text style={styles.otherDetails}>Country Capital: {countryCapital}</Text>
        <Text style={styles.otherDetails}>Latitude: {latitude}</Text>
        <Text style={styles.otherDetails}>Longitude: {longitude}</Text>
      </View>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  itemTile: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 2,
    elevation: 3,
  },
  countryText: {
    fontSize: 16,
    color: '#000',
  },
  mapContainer: {
    height: 350,
    ...StyleSheet.absoluteFillObject,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  detailTitle: {
    color: '#000',
    fontSize: 24,
    alignSelf: 'center',
    marginVertical: 10,
  },
  otherDetails: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
});

export default App;
