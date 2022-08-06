import 'package:flutter/material.dart';

import 'package:get/get.dart';

import '../controllers/profile_controller.dart';

class ProfileView extends GetView<ProfileController> {
  const ProfileView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: Scaffold(
      appBar: AppBar(
        elevation: 0,
        shadowColor: Colors.transparent,
        backgroundColor: Color.fromARGB(255, 40, 96, 201),
        actions: [
          IconButton(
            icon: Icon(Icons.notifications),
            onPressed: () {
              Get.toNamed('/settings');
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Container(
            height: Get.height * 0.28,
            width: Get.width,
            decoration: BoxDecoration(
              color: Color.fromARGB(255, 40, 96, 201),
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(40),
                bottomRight: Radius.circular(40),
              ),
            ),
            child: Column(
              children: [
                Container(
                  child: const Center(
                    child: CircleAvatar(
                      backgroundImage: NetworkImage(
                          'https://intipay.id/wp-content/uploads/2022/01/mock-up-intipay_0002s_0010_Intipay_logo_fix-1-e1641374741409.png'),
                      radius: 50,
                    ),
                  ),
                ),
                SizedBox(
                  height: 10,
                ),
                Obx(() => Text(
                      controller.userProfile.value.customername,
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    )),
                Obx(
                  () => Text(
                    controller.userProfile.value.email,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white.withOpacity(0.5),
                    ),
                  ),
                ),
                const SizedBox(
                  height: 10,
                ),
                SizedBox(
                  width: 350,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                            fixedSize: Size(160, 30),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            primary: const Color.fromARGB(255, 245, 193, 7)),
                        onPressed: () {},
                        child: const Text(
                          "Edit Profile",
                          style: TextStyle(
                            color: Colors.black,
                            fontSize: 14,
                          ),
                        ),
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                            fixedSize: Size(160, 30),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            primary: const Color.fromARGB(255, 245, 193, 7)),
                        onPressed: () {},
                        child: const Text(
                          "Change Password",
                          style: TextStyle(
                            color: Colors.black,
                            fontSize: 14,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(
            height: 5,
          ),
          Expanded(
            child: SingleChildScrollView(
              child: Padding(
                  padding: const EdgeInsets.all(10),
                  child: Obx(
                    () => Column(
                      children: [
                        titleBuilder(
                            "Nama Lengkap",
                            controller.userProfile.value.customername,
                            Icons.account_circle_rounded),
                        titleBuilder(
                            "Email",
                            controller.userProfile.value.email,
                            Icons.email_outlined),
                        titleBuilder(
                            "Alamat Lengkap",
                            controller.userProfile.value.email,
                            Icons.location_on),
                        titleBuilder(
                            "Kota",
                            controller.userProfile.value.nmkota,
                            Icons.location_on),
                        titleBuilder(
                            "Nomor Telpon",
                            controller.userProfile.value.telepon,
                            Icons.phone_android_outlined),
                        titleBuilder(
                            "Jenis Kepemilikan",
                            controller.userProfile.value.nmjenisKepemilikan,
                            Icons.account_balance_wallet,
                            last: true),
                        SizedBox(
                          height: 10,
                        ),
                        Column(
                          children: [
                            Text(
                              "Menu Lainnya",
                              style: TextStyle(
                                color: Colors.black,
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(
                              height: 10,
                            ),
                            menuBuilder("Skor Berkendara"),
                            menuBuilder("Kondisi Kendaraan"),
                            menuBuilder("Batas Area"),
                            menuBuilder("Laporan Gangguan"),
                          ],
                        )
                      ],
                    ),
                  )),
            ),
          )
        ],
      ),
    ));
  }
}

Container titleBuilder(String title, String value, IconData icon,
    {bool last = false}) {
  return Container(
    decoration: last
        ? null
        : BoxDecoration(
            border: Border(
                bottom: BorderSide(
              color: Colors.grey.withOpacity(0.2),
              width: 1,
            )),
          ),
    child: ListTile(
      leading: Icon(
        icon,
        color: Colors.grey,
      ),
      title: Text(
        "$title :",
        style: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
          color: Colors.black,
        ),
      ),
      subtitle: Text(
        value,
        style: TextStyle(
          fontSize: 16,
          color: Colors.black,
        ),
      ),
    ),
  );
}

Container menuBuilder(String title) {
  return Container(
    decoration: BoxDecoration(
      border: Border(
          bottom: BorderSide(
        color: Colors.grey.withOpacity(0.2),
        width: 1,
      )),
    ),
    child: ListTile(
      title: Text(
        title,
        style: TextStyle(
          fontSize: 16,
          color: Colors.black,
        ),
      ),
      trailing: Icon(
        Icons.arrow_forward_ios,
        color: Colors.black,
      ),
    ),
  );
}
