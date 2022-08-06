class Config {
  static const String baseUrl = "https://indicar.id/platform/public/sysapi";
  static Uri baseUrlLogin =
      Uri.parse("https://portal.indicar.id/api/TokenAuth/AuthenticatePortal");

  static Uri profile =
      Uri.parse("https://indicar.id/platform/public/sysapi/profile/view");

  // get Merk from API
  static Uri listMrek = Uri.parse('$baseUrl/lookup/merk');

  // get Type Kendaraan from API extra parameter merkId
  static String listType = '$baseUrl/lookup/model/merkId/';

  static Uri listKendaraan = Uri.parse('$baseUrl/vehicles/list');

  // get Detail Kendaraan from API extra parameter vehicleId
  static Uri detailKendaraan = Uri.parse('$baseUrl/vehicles/edit');
}
