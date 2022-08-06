import 'dart:convert';

LoginResponseModel loginResponseModelFromJson(String str) =>
    LoginResponseModel.fromJson(json.decode(str));

String loginResponseModelToJson(LoginResponseModel data) =>
    json.encode(data.toJson());

class LoginResponseModel {
  LoginResponseModel({
    required this.result,
    required this.targetUrl,
    required this.success,
    required this.error,
    required this.unAuthorizedRequest,
    required this.abp,
  });

  final Result? result;
  final dynamic targetUrl;
  final bool success;
  final Error? error;
  final bool unAuthorizedRequest;
  final bool abp;

  factory LoginResponseModel.fromJson(Map<String, dynamic> json) =>
      LoginResponseModel(
        result: json["result"] == null ? null : Result.fromJson(json["result"]),
        targetUrl: json["targetUrl"],
        success: json["success"],
        error: json["error"] == null ? null : Error.fromJson(json["error"]),
        unAuthorizedRequest: json["unAuthorizedRequest"],
        abp: json["__abp"],
      );

  Map<String, dynamic> toJson() => {
        "result": result!.toJson(),
        "targetUrl": targetUrl,
        "success": success,
        "error": error,
        "unAuthorizedRequest": unAuthorizedRequest,
        "__abp": abp,
      };
}

class Result {
  Result({
    required this.accessToken,
    required this.encryptedAccessToken,
    required this.expireInSeconds,
    required this.userId,
    required this.tenantId,
  });

  final String accessToken;
  final String encryptedAccessToken;
  final int expireInSeconds;
  final int userId;
  final int tenantId;

  factory Result.fromJson(Map<String, dynamic> json) => Result(
        accessToken: json["accessToken"],
        encryptedAccessToken: json["encryptedAccessToken"],
        expireInSeconds: json["expireInSeconds"],
        userId: json["userId"],
        tenantId: json["tenantId"],
      );

  Map<String, dynamic> toJson() => {
        "accessToken": accessToken,
        "encryptedAccessToken": encryptedAccessToken,
        "expireInSeconds": expireInSeconds,
        "userId": userId,
        "tenantId": tenantId,
      };
}

class Error {
  Error({
    required this.code,
    required this.message,
    required this.details,
    required this.validationErrors,
  });

  final int code;
  final String message;
  final dynamic details;
  final dynamic validationErrors;

  factory Error.fromJson(Map<String, dynamic> json) => Error(
        code: json["code"],
        message: json["message"],
        details: json["details"],
        validationErrors: json["validationErrors"],
      );

  Map<String, dynamic> toJson() => {
        "code": code,
        "message": message,
        "details": details,
        "validationErrors": validationErrors,
      };
}
