import 'package:flutter/material.dart';

import 'package:get/get.dart';

import '../controllers/login_controller.dart';

class LoginView extends GetView<LoginController> {
  const LoginView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        backgroundColor: Color(0xFFF5F7FC),
        body: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Center(
                child: Image.asset(
                  'assets/img/indicar.png',
                  width: 200,
                ),
              ),
              SizedBox(
                height: 20,
              ),
              TextField(
                controller: controller.emailController,
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                decoration: InputDecoration(
                  labelText: 'Email',
                  labelStyle: TextStyle(
                    color: Colors.black,
                    fontSize: 18,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  prefixIcon: Icon(
                    Icons.email,
                    color: Colors.grey,
                  ),
                  errorText: controller.usernameError.value != ''
                      ? controller.usernameError.value
                      : null,
                ),
                style: TextStyle(color: Colors.black, fontSize: 18),
                onChanged: controller.usernameOnChanged,
              ),
              SizedBox(
                height: 20,
              ),
              Obx(
                () => TextField(
                  controller: controller.passwordController,
                  obscureText: !controller.showPassword.value,
                  decoration: InputDecoration(
                    prefixIcon: Icon(
                      Icons.lock,
                      color: Colors.grey,
                    ),
                    suffixIcon: IconButton(
                      icon: Icon(
                        controller.showPassword.value
                            ? Icons.visibility
                            : Icons.visibility_off,
                        color: controller.showPassword.value
                            ? Colors.black
                            : Colors.grey,
                      ),
                      onPressed: () {
                        controller.showPassword.toggle();
                      },
                    ),
                    labelText: 'Password',
                    labelStyle: TextStyle(
                      color: Colors.black,
                      fontSize: 18,
                    ),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    errorText: controller.passwordError.value != ''
                        ? controller.passwordError.value
                        : null,
                  ),
                  style: TextStyle(color: Colors.black, fontSize: 18),
                  onChanged: controller.passwordOnChanged,
                ),
              ),
              SizedBox(
                height: 20,
              ),
              SizedBox(
                  width: double.infinity,
                  child: Obx(
                    () => ElevatedButton(
                      style: ElevatedButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          primary: controller.buttonEnable.value
                              ? const Color.fromARGB(255, 245, 193, 7)
                              : Colors.grey,
                          splashFactory: controller.buttonEnable.value
                              ? null
                              : NoSplash.splashFactory),
                      onPressed: () {
                        controller.buttonEnable.value
                            ? controller.login()
                            : null;
                      },
                      child: const Text(
                        "Login",
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  )),
            ],
          ),
        ),
      ),
    );
  }
}
