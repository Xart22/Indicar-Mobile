import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:geolocator/geolocator.dart';
import 'package:get/get.dart';
import 'package:geocoding/geocoding.dart' as geo;

class LocationService extends GetxService {
  final _location = GeolocatorPlatform.instance;
  final _locationSettings = const LocationSettings(
    accuracy: LocationAccuracy.bestForNavigation,
    distanceFilter: 1,
  );

  Future<LocationService> init() async {
    return this;
  }

  Future<bool> isLocationServiceEnabled() async {
    return _location.isLocationServiceEnabled();
  }

  Future<bool> isPermissionGranted() async {
    final permission = await _location.checkPermission();
    if (permission == LocationPermission.always ||
        permission == LocationPermission.whileInUse) {
      return true;
    }
    return false;
  }

  Future<bool> requestPermission() async {
    final isAlreadyGranted = await isPermissionGranted();
    if (isAlreadyGranted) {
      return true;
    }
    final resultPermission = await _location.requestPermission();
    if (resultPermission == LocationPermission.always ||
        resultPermission == LocationPermission.whileInUse) {
      return true;
    }
    return false;
  }

  Future<bool> checkAndRequestPermission() async {
    final isAlreadyGranted = await isPermissionGranted();
    if (isAlreadyGranted) {
      return true;
    }
    final isGranted = await requestPermission();
    return isGranted;
  }

  Future<Position?> getCurrentPosition() async {
    try {
      final position = await _location.getCurrentPosition(
          locationSettings: _locationSettings);
      return position;
    } catch (e) {
      print(e);

      return null;
    }
  }

  StreamSubscription<Position> addOnLocationChangedListener(
      Function(Position) listener) {
    return _location
        .getPositionStream(locationSettings: _locationSettings)
        .listen(listener);
  }

  Future<String?> getAddress(double lat, double long) async {
    try {
      final listAddress = await geo.placemarkFromCoordinates(lat, long);
      if (listAddress.isEmpty) {
        return null;
      }
      final address = listAddress[0];
      return '${address.street} ${address.subLocality} ${address.locality} ${address.subAdministrativeArea} ${address.administrativeArea} ${address.postalCode}';
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
      return null;
    }
  }
}
