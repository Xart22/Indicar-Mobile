import 'package:flutter/material.dart';

import 'package:get/get.dart';

import '../controllers/kendaraan_controller.dart';

class KendaraanView extends GetView<KendaraanController> {
  const KendaraanView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('KendaraanView'),
        centerTitle: true,
      ),
      body: Center(
        child: Text(
          'KendaraanView is working',
          style: TextStyle(fontSize: 20),
        ),
      ),
    );
  }
}
