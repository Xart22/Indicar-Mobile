import 'package:flutter/material.dart';

import 'package:get/get.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:skeleton_loader/skeleton_loader.dart';

import '../controllers/home_controller.dart';

class HomeView extends GetView<HomeController> {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
          backgroundColor: Color.fromARGB(237, 245, 247, 252),
          body: Column(
            children: [
              SizedBox(
                  height: Get.height * 0.5,
                  width: Get.width,
                  child: Stack(children: [
                    Obx(
                      () => GoogleMap(
                        mapType: MapType.normal,
                        initialCameraPosition: controller.position,
                        markers: controller.markers,
                        onMapCreated: (GoogleMapController controllerM) {
                          controller.controllerMaps.complete(controllerM);
                        },
                        mapToolbarEnabled: false,
                        myLocationEnabled: true,
                        myLocationButtonEnabled: true,
                        trafficEnabled: true,
                        buildingsEnabled: true,
                        compassEnabled: true,
                      ),
                    ),
                    Positioned(
                        top: 5,
                        left: 80,
                        width: Get.width - 180,
                        height: 50,
                        child: Card(
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10)),
                          color: Colors.white.withOpacity(0.8),
                          elevation: 5,
                          child: TextField(
                            textAlign: TextAlign.center,
                            decoration: InputDecoration(
                              border: InputBorder.none,
                              hintText: 'Search',
                              suffixIcon: IconButton(
                                icon: const Icon(Icons.search),
                                onPressed: () {},
                              ),
                            ),
                            style: TextStyle(
                              fontSize: 16,
                            ),
                            onChanged: (value) {},
                          ),
                        )),
                  ])),
              Expanded(child: Obx(() {
                if (controller.loading.value) {
                  return SingleChildScrollView(
                    child: SkeletonLoader(
                      builder: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Card(
                              shadowColor: Colors.grey,
                              elevation: 5,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10)),
                              child: SizedBox(
                                width: Get.width * 0.4,
                                height: Get.height * 0.1,
                              ))),
                      items: controller.kendaraan.length,
                      period: Duration(seconds: 1),
                      highlightColor: Colors.grey.withOpacity(0.5),
                      direction: SkeletonDirection.ltr,
                    ),
                  );
                } else if (controller.kendaraan.isNotEmpty) {
                  return ListView.builder(
                      itemCount: controller.kendaraan.length,
                      itemBuilder: (context, index) {
                        return Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Card(
                            shadowColor: Colors.grey,
                            elevation: 5,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10)),
                            child: Padding(
                              padding: const EdgeInsets.all(10.0),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceAround,
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: [
                                  SizedBox(
                                    width: Get.width * 0.4,
                                    child: Row(
                                      children: [
                                        Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.center,
                                          children: [
                                            Text(
                                              controller
                                                  .kendaraan[index].vehiclename,
                                              style: TextStyle(
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.bold,
                                                  wordSpacing: 1),
                                            ),
                                            Text(
                                              controller.kendaraan[index].nopol,
                                              style: TextStyle(
                                                fontSize: 14,
                                                wordSpacing: 1,
                                              ),
                                            ),
                                            Text(
                                              "Last Update: ${controller.kendaraan[index].lastUpdate}",
                                              style: TextStyle(
                                                fontSize: 12,
                                                wordSpacing: 0,
                                                color: Colors.grey
                                                    .withOpacity(0.9),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                  Container(
                                    color: Colors.black,
                                    width: 1,
                                    height: 50,
                                  ),
                                  SizedBox(
                                    width: 10,
                                  ),
                                  Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        'Engine : ${controller.kendaraan[index].statEngine == 1 ? 'ON' : 'OFF'}',
                                        style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                          color: controller.kendaraan[index]
                                                      .statEngine ==
                                                  1
                                              ? Colors.green
                                              : Colors.red,
                                        ),
                                      ),
                                      SizedBox(
                                        height: 10,
                                      ),
                                      Row(
                                        children: [
                                          Container(
                                            width: 35,
                                            height: 35,
                                            decoration: BoxDecoration(
                                              borderRadius:
                                                  BorderRadius.circular(5),
                                              border: Border.all(
                                                color: Colors.black,
                                                width: 1,
                                                style: BorderStyle.solid,
                                              ),
                                            ),
                                            child: IconButton(
                                                padding: EdgeInsets.all(0),
                                                onPressed: () {},
                                                icon: Icon(
                                                  Icons.wifi,
                                                  color: Colors.black,
                                                  size: 20,
                                                )),
                                          ),
                                          SizedBox(
                                            width: 10,
                                          ),
                                          Container(
                                            width: 35,
                                            height: 35,
                                            decoration: BoxDecoration(
                                              borderRadius:
                                                  BorderRadius.circular(5),
                                              border: Border.all(
                                                color: Colors.black,
                                                width: 1,
                                                style: BorderStyle.solid,
                                              ),
                                            ),
                                            child: IconButton(
                                                padding: EdgeInsets.all(0),
                                                onPressed: () {},
                                                icon: Icon(
                                                  Icons.speed,
                                                  color: Colors.black,
                                                  size: 20,
                                                )),
                                          ),
                                          SizedBox(
                                            width: 10,
                                          ),
                                          Container(
                                            width: 35,
                                            height: 35,
                                            decoration: BoxDecoration(
                                              borderRadius:
                                                  BorderRadius.circular(5),
                                              border: Border.all(
                                                color: Colors.black,
                                                width: 1,
                                                style: BorderStyle.solid,
                                              ),
                                            ),
                                            child: IconButton(
                                                padding: EdgeInsets.all(0),
                                                onPressed: () {},
                                                icon: Icon(
                                                  Icons.menu,
                                                  color: Colors.black,
                                                  size: 20,
                                                )),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      });
                } else {
                  return Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.car_crash_outlined,
                        color: Colors.grey,
                        size: 50,
                      ),
                      SizedBox(
                        height: 10,
                      ),
                      Text(
                        'Belum Ada Kendaraan',
                        style: TextStyle(
                          fontSize: 18,
                        ),
                      ),
                      SizedBox(
                        height: 10,
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          primary: Colors.grey,
                        ),
                        onPressed: () {},
                        child: const Text(
                          "Tambah Kendaraan",
                          style: TextStyle(
                            color: Colors.black,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ],
                  );
                }
              }))
            ],
          ),
          // floatingActionButton: FloatingActionButton(
          //   onPressed: () {
          //     Get.toNamed('/add');
          //   },
          //   child: Icon(Icons.add),
          // ),
          // floatingActionButtonLocation:
          //     FloatingActionButtonLocation.centerDocked,
          bottomNavigationBar: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.only(
                    topRight: Radius.circular(30),
                    topLeft: Radius.circular(30)),
                boxShadow: [
                  BoxShadow(
                      color: Colors.black38, spreadRadius: 0, blurRadius: 10),
                ],
              ),
              child: ClipRRect(
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(30.0),
                    topRight: Radius.circular(30.0),
                  ),
                  child: Obx(
                    () => BottomNavigationBar(
                      currentIndex: controller.seletedIndex.value,
                      onTap: (index) {
                        controller.changeIndex(index);
                      },
                      type: BottomNavigationBarType.fixed,
                      items: <BottomNavigationBarItem>[
                        BottomNavigationBarItem(
                          icon: Icon(Icons.location_on_outlined),
                          label: 'Tracking',
                        ),
                        BottomNavigationBarItem(
                          icon: Icon(Icons.location_on_outlined),
                          label: 'Perjalanan',
                        ),
                        BottomNavigationBarItem(
                          icon: Icon(Icons.trip_origin_outlined),
                          label: 'Perilaku',
                        ),
                        BottomNavigationBarItem(
                          icon: Icon(Icons.account_circle_outlined),
                          label: 'Profile',
                        ),
                      ],
                    ),
                  )))),
    );
  }
}
