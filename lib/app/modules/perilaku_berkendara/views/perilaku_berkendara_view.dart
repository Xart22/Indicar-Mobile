import 'package:flutter/material.dart';

import 'package:get/get.dart';

import '../controllers/perilaku_berkendara_controller.dart';

class PerilakuBerkendaraView extends GetView<PerilakuBerkendaraController> {
  const PerilakuBerkendaraView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('PerilakuBerkendaraView'),
        centerTitle: true,
      ),
      body: Center(
        child: Text(
          'PerilakuBerkendaraView is working',
          style: TextStyle(fontSize: 20),
        ),
      ),
    );
  }
}
