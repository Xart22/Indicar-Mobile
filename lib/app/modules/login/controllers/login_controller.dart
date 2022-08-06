import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

import '../../../service/api/response/auth_provider.dart';
import '../../../utils/helper.dart';

class LoginController extends GetxController {
  final storage = GetStorage();
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  var showPassword = false.obs;
  var buttonEnable = false.obs;
  var usernameError = ''.obs;
  var passwordError = ''.obs;

  void usernameOnChanged(String value) {
    usernameError.value = '';
    validate();
  }

  void passwordOnChanged(String value) {
    passwordError.value = '';
    validate();
  }

  void validate() {
    if (emailController.text.isEmpty) {
      buttonEnable.value = false;
      usernameError.value = 'Username tidak boleh kosong';
    } else if (passwordController.text.isEmpty) {
      buttonEnable.value = false;
      passwordError.value = 'Password tidak boleh kosong';
    } else if (passwordController.text.length < 6) {
      passwordError.value = 'Password minimal 6 karakter';
      buttonEnable.value = false;
    } else {
      buttonEnable.value = true;
    }
  }

  void login() async {
    await AuthProvider.login(emailController.text, passwordController.text)
        .then((value) async {
      if (value.error == null) {
        await storage.write('accestoken', value.result!.accessToken);
        Get.offAllNamed('/home');
      } else {
        showToast(value.error!.message);
      }
    });
  }
}
