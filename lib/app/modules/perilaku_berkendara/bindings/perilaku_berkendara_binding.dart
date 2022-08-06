import 'package:get/get.dart';

import '../controllers/perilaku_berkendara_controller.dart';

class PerilakuBerkendaraBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<PerilakuBerkendaraController>(
      () => PerilakuBerkendaraController(),
    );
  }
}
