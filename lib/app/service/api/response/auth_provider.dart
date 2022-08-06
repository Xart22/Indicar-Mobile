import 'dart:convert';

import 'package:http/http.dart' as http;

import 'package:get_storage/get_storage.dart';
import 'package:indicar/app/data/model/user_profile_response.dart';

import '../../../data/model/login_response_model.dart';
import '../../../utils/config.dart';
import '../../../utils/helper.dart';

class AuthProvider {
  static final client = http.Client();
  static final storage = GetStorage();
  static final accestoken = storage.read('accestoken');

  static Future<LoginResponseModel> login(
      String username, String password) async {
    try {
      final response = await client
          .post(Config.baseUrlLogin,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: json.encode({
                'UserNameOrEmailAddress': username,
                'password': password,
              }))
          .timeout(const Duration(seconds: 5));

      return loginResponseModelFromJson(response.body);
    } catch (e) {
      print(e);
      showToast('Terjadi Kesalahan');
      throw Exception('Terjadi kesalahan');
    }
  }

  static Future<UserProfileResponseModel> getUserProfile() async {
    try {
      final response = await client.post(Config.profile, headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer $accestoken',
      }).timeout(const Duration(seconds: 5));

      return userProfileResponseModelFromJson(response.body);
    } catch (e) {
      print(e);
      showToast('Terjadi Kesalahan');
      throw Exception('Terjadi kesalahan');
    }
  }
}
