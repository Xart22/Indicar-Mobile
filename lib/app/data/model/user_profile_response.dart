import 'dart:convert';

UserProfileResponseModel userProfileResponseModelFromJson(String str) =>
    UserProfileResponseModel.fromJson(json.decode(str));

String userProfileResponseModelToJson(UserProfileResponseModel data) =>
    json.encode(data.toJson());

class UserProfileResponseModel {
  UserProfileResponseModel({
    required this.success,
    required this.customercode,
    required this.customername,
    required this.alamat,
    required this.email,
    required this.idprovinsi,
    required this.nmprovinsi,
    required this.idkota,
    required this.nmkota,
    required this.idjenisKepemilikan,
    required this.nmjenisKepemilikan,
    required this.telepon,
  });

  final int success;
  final String customercode;
  final String customername;
  final String alamat;
  final String email;
  final String idprovinsi;
  final String nmprovinsi;
  final String idkota;
  final String nmkota;
  final String idjenisKepemilikan;
  final String nmjenisKepemilikan;
  final String telepon;

  factory UserProfileResponseModel.fromJson(Map<String, dynamic> json) =>
      UserProfileResponseModel(
        success: json["success"],
        customercode: json["customercode"],
        customername: json["customername"],
        alamat: json["alamat"],
        email: json["email"],
        idprovinsi: json["idprovinsi"],
        nmprovinsi: json["nmprovinsi"],
        idkota: json["idkota"],
        nmkota: json["nmkota"],
        idjenisKepemilikan: json["idjenis_kepemilikan"],
        nmjenisKepemilikan: json["nmjenis_kepemilikan"],
        telepon: json["telepon"],
      );

  Map<String, dynamic> toJson() => {
        "success": success,
        "customercode": customercode,
        "customername": customername,
        "alamat": alamat,
        "email": email,
        "idprovinsi": idprovinsi,
        "nmprovinsi": nmprovinsi,
        "idkota": idkota,
        "nmkota": nmkota,
        "idjenis_kepemilikan": idjenisKepemilikan,
        "nmjenis_kepemilikan": nmjenisKepemilikan,
        "telepon": telepon,
      };
}
