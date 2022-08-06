import 'package:get/get.dart';
import 'package:http/http.dart' as http;

import 'package:get_storage/get_storage.dart';
import 'package:indicar/app/data/model/list_kendaraan_response_model.dart';

import '../../../utils/config.dart';
import '../../../utils/helper.dart';

class KendaraanProvider {
  static final client = http.Client();
  static final storage = GetStorage();
  static final accestoken = storage.read('accestoken');

  static Future<ListKendaraanResponseModel?> getListKendaraan() async {
    try {
      final response = await client.post(Config.listKendaraan, headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer $accestoken',
      }).timeout(const Duration(seconds: 10));
      if (response.statusCode == 200) {
        return listKendaraanResponseModelFromJson(response.body);
      } else {
        await storage.remove('accestoken');
        showToast('Session anda telah berakhir, silahkan login kembali');
        Get.offAllNamed('/login');
      }
    } catch (e) {
      print(e);
      showToast('Terjadi Kesalahan');
      throw Exception('Terjadi kesalahan');
    }
    return null;
  }
}
