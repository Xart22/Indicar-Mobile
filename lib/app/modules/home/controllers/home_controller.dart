import 'dart:async';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import 'package:indicar/app/service/api/response/kendaraan_provider.dart';

import '../../../data/model/list_kendaraan_response_model.dart';
import '../../../service/location.dart';

class HomeController extends GetxController {
  final Completer<GoogleMapController> controllerMaps = Completer();
  final _locationService = Get.find<LocationService>();
  late Timer _timer;

  CameraPosition position = CameraPosition(
    target: LatLng(-6.921164377198581, 107.6071290714782),
    zoom: 10,
  );
  var seletedIndex = 0.obs;
  var kendaraan = <Kendaraan>[].obs;

  var listMarker = <Marker>[].obs;
  var markers = <Marker>{}.obs;
  var loading = true.obs;

  @override
  void onInit() {
    super.onInit();

    _locationService.checkAndRequestPermission();
    getCurrentPosition();
    getListKendaraan(true);
    _timer = Timer.periodic(Duration(seconds: 10), (timer) {
      getListKendaraan(false);
    });
  }

  @override
  void onClose() {
    super.onClose();
    _timer.cancel();
  }

  void changeIndex(int index) {
    if (index != 3) {
      seletedIndex.value = index;
    } else {
      Get.toNamed('/home/profile');
    }
  }

  void getListKendaraan(bool load) async {
    await KendaraanProvider.getListKendaraan().then((value) async {
      kendaraan.value = value == null ? [] : value.dataset;

      kendaraan.sort((a, b) => b.statEngine!.compareTo(a.statEngine!));
      kendaraan.sort((a, b) {
        if (a.loctime == null) {
          return 1;
        } else if (b.loctime == null) {
          return -1;
        } else {
          return b.loctime!.compareTo(a.loctime!);
        }
      });

      for (var item in kendaraan) {
        var icon = "";
        if (item.vehicletype == 1) {
          if (item.statEngine == 1) {
            icon = "assets/img/bike-on.png";
          } else if (item.alarm != "") {
            icon = "assets/img/bike-alarm.png";
          } else {
            icon = "assets/img/bike-off.png";
          }
        } else {
          if (item.statEngine == 1) {
            icon = "assets/img/car-on.png";
          } else if (item.alarm != "") {
            icon = "assets/img/car-alarm.png";
          } else {
            icon = "assets/img/car-off.png";
          }
        }

        BitmapDescriptor markerbitmap = await BitmapDescriptor.fromAssetImage(
          ImageConfiguration(
            size: Size(48, 48),
          ),
          icon,
        );
        listMarker.add(Marker(
          rotation: item.angle,
          markerId: MarkerId(item.vehicleid.toString()),
          position: LatLng(item.latitude, item.longitude),
          infoWindow: InfoWindow(
            title: item.vehiclename,
            snippet: item.statEngine == 1 ? 'Online' : 'Offline',
          ),
          icon: markerbitmap,
          onTap: () {
            Get.bottomSheet(
                Container(
                  child: Column(
                    children: [
                      Text(item.vehiclename),
                    ],
                  ),
                ),
                backgroundColor: Colors.white);
          },
        ));
      }
      markers.addAll(listMarker);
    });
    loading.value = false;
  }

  void getCurrentPosition() async {
    final currentPosition = await _locationService.getCurrentPosition();
    final mapController = await controllerMaps.future;
    mapController.animateCamera(CameraUpdate.newCameraPosition(
      CameraPosition(
        target: LatLng(currentPosition!.latitude, currentPosition.longitude),
        zoom: 10,
      ),
    ));
    position = CameraPosition(
      target: LatLng(currentPosition.latitude, currentPosition.longitude),
      zoom: 10,
    );
  }

  void delay(Duration duration) {
    Future.delayed(duration, () {
      loading.value = false;
    });
  }
}
