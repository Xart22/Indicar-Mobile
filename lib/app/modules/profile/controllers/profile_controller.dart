import 'package:get/get.dart';
import 'package:indicar/app/data/model/user_profile_response.dart';
import 'package:indicar/app/service/api/response/auth_provider.dart';

class ProfileController extends GetxController {
  var userProfile = UserProfileResponseModel(
          alamat: '',
          email: '',
          telepon: '',
          idkota: '',
          nmkota: '',
          idprovinsi: '',
          nmprovinsi: '',
          idjenisKepemilikan: '',
          nmjenisKepemilikan: '',
          customername: '',
          customercode: '',
          success: 0)
      .obs;

  @override
  void onInit() {
    super.onInit();
    getUserProfile();
  }

  void getUserProfile() async {
    await AuthProvider.getUserProfile().then((value) {
      print(value.alamat);
      userProfile.value = value;
    });
  }
}
