import { StyleSheet, View } from "react-native";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";

const INITIAL_COORDS = {
  latitude: 39.9526,
  longitude: -75.1652,
  latitudeDelta: 0.0922, //Zoom Level
  longitudeDelta: 0.0421,
};

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <MapView
        initialRegion={INITIAL_COORDS}
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFill}
        showsUserLocation
        showsMyLocationButton
      ></MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    height: "100%",
    width: "100%",
  },
});
