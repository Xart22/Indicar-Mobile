import 'package:get/get.dart';

import '../controllers/perjalanan_controller.dart';

class PerjalananBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<PerjalananController>(
      () => PerjalananController(),
    );
  }
}
