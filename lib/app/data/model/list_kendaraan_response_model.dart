import 'dart:convert';

import 'package:get/get.dart';

import '../../service/location.dart';

ListKendaraanResponseModel listKendaraanResponseModelFromJson(String str) =>
    ListKendaraanResponseModel.fromJson(json.decode(str));

String listKendaraanResponseModelToJson(ListKendaraanResponseModel data) =>
    json.encode(data.toJson());
final locationService = Get.find<LocationService>();

class ListKendaraanResponseModel {
  ListKendaraanResponseModel({
    required this.totalCount,
    required this.success,
    required this.dataset,
  });

  final String totalCount;
  final int success;
  final List<Kendaraan> dataset;

  factory ListKendaraanResponseModel.fromJson(Map<String, dynamic> json) =>
      ListKendaraanResponseModel(
        totalCount: json["total_count"],
        success: json["success"],
        dataset: List<Kendaraan>.from(
            json["dataset"].map((x) => Kendaraan.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "total_count": totalCount,
        "success": success,
        "dataset": List<dynamic>.from(dataset.map((x) => x.toJson())),
      };
}

class Kendaraan {
  Kendaraan(
      {required this.vehicleid,
      required this.vehiclename,
      required this.nopol,
      required this.doId,
      required this.imei,
      required this.statusKendaraan,
      required this.longitude,
      required this.latitude,
      required this.angle,
      required this.hdop,
      required this.speed,
      required this.loctime,
      required this.statusData,
      required this.statusGps,
      required this.statEngine,
      required this.protocol,
      required this.immobilizeable,
      required this.vehicletype,
      required this.merk,
      required this.merkname,
      required this.tipe,
      required this.tipename,
      required this.sensors,
      required this.immobilizestat,
      required this.vehiclegroup,
      required this.alarm,
      this.lastUpdate});

  final String vehicleid;
  final String vehiclename;
  final String nopol;
  final dynamic doId;
  final String imei;
  final String? statusKendaraan;
  final double longitude;
  final double latitude;
  final double angle;
  final String? hdop;
  final String? speed;
  final DateTime? loctime;
  final String? statusData;
  final String? statusGps;
  final int? statEngine;
  final String? protocol;
  final String? immobilizeable;
  final int vehicletype;
  final String? merk;
  final String? merkname;
  final String? tipe;
  final String? tipename;
  final List<dynamic> sensors;
  final List<dynamic> immobilizestat;
  final String? vehiclegroup;
  final String? alarm;
  final String? lastUpdate;

  factory Kendaraan.fromJson(Map<String, dynamic> json) => Kendaraan(
        vehicleid: json["vehicleid"],
        vehiclename: json["vehiclename"],
        nopol: json["nopol"],
        doId: json["do_id"],
        imei: json["imei"],
        statusKendaraan: json["status_kendaraan"],
        longitude: double.parse(json["longitude"] ?? "0"),
        latitude: double.parse(json["latitude"] ?? "0"),
        angle: double.parse(json["angle"] ?? "0"),
        hdop: json["hdop"],
        speed: json["speed"],
        loctime:
            json["loctime"] == null ? null : DateTime.parse(json["loctime"]),
        statusData: json["status_data"],
        statusGps: json["status_gps"],
        statEngine: int.parse(json["stat_engine"] ?? "0"),
        protocol: json["protocol"],
        immobilizeable: json["immobilizeable"],
        vehicletype: int.parse(json["vehicletype"]),
        merk: json["merk"],
        merkname: json["merkname"],
        tipe: json["tipe"],
        tipename: json["tipename"],
        sensors: List<dynamic>.from(json["sensors"].map((x) => x)),
        immobilizestat:
            List<dynamic>.from(json["immobilizestat"].map((x) => x)),
        vehiclegroup: json["vehiclegroup"],
        alarm: json["alarm"],
        lastUpdate: json["loctime"] == null ? null : diffDate(json["loctime"]),
      );

  Map<String, dynamic> toJson() => {
        "vehicleid": vehicleid,
        "vehiclename": vehiclename,
        "nopol": nopol,
        "do_id": doId,
        "imei": imei,
        "status_kendaraan": statusKendaraan,
        "longitude": longitude,
        "latitude": latitude,
        "angle": angle,
        "hdop": hdop,
        "speed": speed,
        "loctime": loctime,
        "status_data": statusData,
        "status_gps": statusGps,
        "stat_engine": statEngine,
        "protocol": protocol,
        "immobilizeable": immobilizeable,
        "vehicletype": vehicletype,
        "merk": merk,
        "merkname": merkname,
        "tipe": tipe,
        "tipename": tipename,
        "sensors": List<dynamic>.from(sensors.map((x) => x)),
        "immobilizestat": List<dynamic>.from(immobilizestat.map((x) => x)),
        "vehiclegroup": vehiclegroup,
        "alarm": alarm,
      };
  @override
  String toString() {
    return 'Kendaraan{vehicleid: $vehicleid, vehiclename: $vehiclename, nopol: $nopol, doId: $doId, imei: $imei, statusKendaraan: $statusKendaraan, longitude: $longitude, latitude: $latitude, angle: $angle, hdop: $hdop, speed: $speed, loctime: $loctime, statusData: $statusData, statusGps: $statusGps, statEngine: $statEngine, protocol: $protocol, immobilizeable: $immobilizeable, vehicletype: $vehicletype, merk: $merk, merkname: $merkname, tipe: $tipe, tipename: $tipename, sensors: $sensors, immobilizestat: $immobilizestat, vehiclegroup: $vehiclegroup, alarm: $alarm}';
  }

  static String diffDate(String loctime) {
    var date = DateTime.parse(loctime.replaceAll("+07", ""));
    var now = DateTime.now();
    var diff = now.difference(date);
    var diffMinutes = diff.inMinutes;
    var diffHours = diff.inHours;
    var diffDays = diff.inDays;
    if (diffMinutes < 1) {
      return "Just Now";
    } else if (diffMinutes < 60) {
      return "${diffMinutes.toString()} minutes ago";
    } else if (diffHours < 24) {
      return "${diffHours.toString()} hours ago";
    } else {
      return "${diffDays.toString()} days ago";
    }
  }
}
