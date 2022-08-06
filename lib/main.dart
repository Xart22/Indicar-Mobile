import 'package:flutter/material.dart';

import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:indicar/app/utils/theme.dart';

import 'app/routes/app_pages.dart';
import 'app/service/location.dart';

void main() async {
  await GetStorage.init();
  final storage = GetStorage();
  final token = await storage.read('accestoken');
  await Get.putAsync<LocationService>(() => LocationService().init());
  runApp(
    GetMaterialApp(
      debugShowCheckedModeBanner: false,
      title: "Indicar",
      initialRoute: token == null ? '/login' : '/home',
      getPages: AppPages.routes,
      theme: appTheme,
    ),
  );
}
