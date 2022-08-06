import 'package:flutter/material.dart';

import 'package:get/get.dart';

import '../controllers/perjalanan_controller.dart';

class PerjalananView extends GetView<PerjalananController> {
  const PerjalananView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('PerjalananView'),
        centerTitle: true,
      ),
      body: Center(
        child: Text(
          'PerjalananView is working',
          style: TextStyle(fontSize: 20),
        ),
      ),
    );
  }
}
