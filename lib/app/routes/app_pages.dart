import 'package:get/get.dart';

import '../modules/home/bindings/home_binding.dart';
import '../modules/home/views/home_view.dart';
import '../modules/kendaraan/bindings/kendaraan_binding.dart';
import '../modules/kendaraan/views/kendaraan_view.dart';
import '../modules/login/bindings/login_binding.dart';
import '../modules/login/views/login_view.dart';
import '../modules/navigation/bindings/navigation_binding.dart';
import '../modules/navigation/views/navigation_view.dart';
import '../modules/perilaku_berkendara/bindings/perilaku_berkendara_binding.dart';
import '../modules/perilaku_berkendara/views/perilaku_berkendara_view.dart';
import '../modules/perjalanan/bindings/perjalanan_binding.dart';
import '../modules/perjalanan/views/perjalanan_view.dart';
import '../modules/profile/bindings/profile_binding.dart';
import '../modules/profile/views/profile_view.dart';

part 'app_routes.dart';

class AppPages {
  AppPages._();

  static const INITIAL = Routes.LOGIN;

  static final routes = [
    GetPage(
        name: _Paths.HOME,
        page: () => HomeView(),
        binding: HomeBinding(),
        children: [
          GetPage(
            name: _Paths.PROFILE,
            page: () => const ProfileView(),
            binding: ProfileBinding(),
          ),
        ]),
    GetPage(
      name: _Paths.NAVIGATION,
      page: () => const NavigationView(),
      binding: NavigationBinding(),
    ),
    GetPage(
      name: _Paths.LOGIN,
      page: () => const LoginView(),
      binding: LoginBinding(),
    ),
    GetPage(
      name: _Paths.KENDARAAN,
      page: () => const KendaraanView(),
      binding: KendaraanBinding(),
    ),
    GetPage(
      name: _Paths.PERJALANAN,
      page: () => const PerjalananView(),
      binding: PerjalananBinding(),
    ),
    GetPage(
      name: _Paths.PERILAKU_BERKENDARA,
      page: () => const PerilakuBerkendaraView(),
      binding: PerilakuBerkendaraBinding(),
    ),
  ];
}
