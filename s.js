var minimTime = "";
var tmp_vehicle;

var statusParam = {};
var currentVid = null;
var tipeID;
var saveMode;
var isParamEdited = {};

var geojsonFeature = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        stroke: "#10227f",
        "stroke-width": 2,
        "stroke-opacity": 1,
        fill: "#ffbe33",
        "fill-opacity": 0.5,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [107.60361671447754, -6.917565518618452],
            [107.60052680969238, -6.92037730431652],
            [107.60361671447754, -6.924296735222673],
            [107.6099681854248, -6.922081408710182],
            [107.60953903198242, -6.916883871079278],
            [107.60361671447754, -6.917565518618452],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        stroke: "#291b6f",
        "stroke-width": 2,
        "stroke-opacity": 1,
        fill: "#ff8585",
        "fill-opacity": 0.5,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [107.59958267211914, -6.902654254223455],
            [107.5960636138916, -6.9063182084786146],
            [107.59769439697266, -6.910663791849688],
            [107.60001182556152, -6.910663791849688],
            [107.60224342346191, -6.907170286796667],
            [107.60516166687012, -6.901461332762905],
            [107.60052680969238, -6.899245899217878],
            [107.59597778320312, -6.899671944935481],
            [107.59958267211914, -6.902654254223455],
          ],
        ],
      },
    },
  ],
};

var updateTimeInfo = function () {
  // console.log('Data Vehicle', tmp_vehicle)
  for (var i = 0; i < tmp_vehicle.length; i++) {
    var vitem = tmp_vehicle[i];
    if (!(vitem.loctime === undefined || vitem.loctime === null)) {
      var vxtime = date_diff(vitem.loctime);
      var vclass = date_label(vitem.loctime);
      console.log("Time Diff", vxtime, vclass);
      $("#timeinfo_" + vitem.vehicleid).attr("class", vclass);
      $("#timeinfo_" + vitem.vehicleid).html(vxtime);
    }
  }
};

var showQuota = function (simcard) {
  console.log("showQuota");
  $("#device_sisa_kuota").modal("show");
  var vlink = "https://telkomsel.com/kartu-halo";
  var vhtml = '<iframe src="' + vlink + '" height="420" width="100%"></iframe>';
  $("#body_device_sisa_kuota").html(vhtml);
};

var saveParams = function (vcode) {
  var vdata = statusParam[vcode];
  var vimei = vdata.imei;
  var vvalue = $("#edit_" + vcode).val();
  var vparam = {
    imei: vimei,
    value: vvalue,
    kode: vcode,
  };
  $.ajax({
    url: BACKEND_URL + "vehicles/updateparam",
    dataType: "JSON",
    type: "POST",
    data: vparam,
    success: function (resp) {
      // $('#edit_202').val('XXXX');
      console.log("param resp", resp);
      $("#device_params_loading").hide();

      $.notific8(
        "Permintaan perubahan setting sudah dikirim. Pastikan device dalam keadaan hidup.",
        {
          heading: "Sukses",
          theme: "teal", // teal, amethyst,ruby, tangerine, lemon, lime, ebony, smoke
          life: 2000,
          horizontalEdge: "bottom",
          verticalEdge: "left",
        }
      );
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // App.unblockUI("#form_obd");
      var vmessage = extractErrorMessage(jqXHR);
      bootbox.alert({
        message: vmessage,
        title:
          '<span class="font-red bold"> <strong> <i class="fa fa-warning"> </i> Error!! </strong><span>',
      });
    },
    beforeSend: function (xhr, settings) {
      xhr.setRequestHeader("Authorization", "Bearer " + USER_TOKEN);
    },
  });
};

var updateByStatus = function (vcode) {
  $("#statinfo_" + vcode).hide();
  if (isParamEdited[vcode]) {
    $("#edit_" + vcode).prop("disabled", false);
    $("#button_" + vcode).prop("disabled", false);
    $("#button_" + vcode).html("Simpan");
    $("#buttonx_" + vcode).show();
    $("#buttony_" + vcode).hide();
  } else {
    $("#edit_" + vcode).prop("disabled", true);
    $("#button_" + vcode).prop("disabled", false);
    $("#buttony_" + vcode).prop("disabled", false);
    $("#button_" + vcode).html("Ubah");
    $("#button_" + vcode).show();
    $("#buttonx_" + vcode).hide();
    $("#buttony_" + vcode).show();
    var vstatus = Number(statusParam[vcode]["status"]);
    if (vstatus === 2) {
      $("#button_" + vcode).hide();
      $("#buttony_" + vcode).hide();
      $("#statinfo_" + vcode).html(
        "Tunggu... Sedang meminta perubahan parameter. Pastikan device dalam keadaan hidup."
      );
      $("#statinfo_" + vcode).show();
    } else if (vstatus === 3) {
      $("#statinfo_" + vcode).html(
        "Device tidak merespon dalam batas waktu yang ditentukan. Mohon tunggu sampai device aktif."
      );
      // $('#statinfo_'+vcode).html('Perubahan Setting ke device GAGAL dilakukan (device tidak merespon dalam batas waktu yang ditentukan).');
      $("#statinfo_" + vcode).show();
    } else if (vstatus === 4) {
      $("#button_" + vcode).hide();
      $("#buttony_" + vcode).hide();
      $("#statinfo_" + vcode).html(
        "Tunggu... Sedang melakukan pengecekan setting device. Pastikan device dalam keadaan hidup."
      );
      $("#statinfo_" + vcode).show();
    } else if (vstatus === 5) {
      $("#statinfo_" + vcode).html(
        "Device tidak merespon dalam batas waktu yang ditentukan. Mohon tunggu sampai device aktif."
      );
      // $('#statinfo_'+vcode).html('Pengecekan Setting ke device GAGAL dilakukan (device tidak merespon dalam batas waktu yang ditentukan).');
      $("#statinfo_" + vcode).show();
    } else if (vstatus === 7) {
      $("#statinfo_" + vcode).html(
        "Perubahan/pengecekan setting berhasil dilakukan."
      );
      $("#statinfo_" + vcode).show();
    }
  }
};

var editClick = function (vcode) {
  if (isParamEdited[vcode]) {
    isParamEdited[vcode] = 0;
    statusParam[vcode]["status"] = 2;
    updateByStatus(vcode);
    console.log("Simpan");
    saveParams(vcode);
  } else {
    isParamEdited[vcode] = 1;
    updateByStatus(vcode);
    console.log("Edit");
  }
};

var extractErrorMessage = function (vrequest, vdefault) {
  if (typeof vdefault === "undefined") {
    vdefault =
      '<span class="font-yellow"> Mohon maaf koneksi bermasalah.</span> <br />' +
      " Silahkan coba beberapa saat lagi <strong>atau</strong> hubungi <strong> Administrator Aplikasi. </strong>";
  }
  var jsonError = jQuery.parseJSON(vrequest.responseText);
  var vmessage = vdefault;
  if (typeof jsonError.message !== "undefined") {
    vmessage = jsonError.message;
  }
  return vmessage;
};

var extractErrorMessageJSON = function (jsonError, vdefault) {
  if (typeof vdefault === "undefined") {
    vdefault =
      '<span class="font-yellow"> Mohon maaf data bermasalah.</span> <br />' +
      " <strong> Sistem tidak dapat ditampilkan. </strong>";
  }
  var vmessage = vdefault;
  if (typeof jsonError.message !== "undefined") {
    vmessage = jsonError.message;
  }
  return vmessage;
};

var inquiryParam = function (vcode) {
  var vdata = statusParam[vcode];
  var vimei = vdata.imei;
  var vvalue = $("#edit_" + vcode).val();
  statusParam[vcode]["status"] = 4;
  updateByStatus(vcode);
  var vparam = {
    imei: vimei,
    value: vvalue,
    kode: vcode,
  };
  $.ajax({
    url: BACKEND_URL + "vehicles/inquiry",
    dataType: "JSON",
    type: "POST",
    data: vparam,
    success: function (resp) {
      console.log("param resp", resp);
      $("#device_params_loading").hide();
      // refreshData()

      $.notific8(
        "Permintaan perubahan setting sudah dikirim. Pastikan device dalam keadaan hidup.",
        {
          heading: "Sukses",
          theme: "teal", // teal, amethyst,ruby, tangerine, lemon, lime, ebony, smoke
          life: 2000,
          horizontalEdge: "bottom",
          verticalEdge: "left",
        }
      );
    },
    error: function (jqXHR, textStatus, errorThrown) {
      var vmessage = extractErrorMessage(jqXHR);
      bootbox.alert({
        message: vmessage,
        title:
          '<span class="font-red bold"> <strong> <i class="fa fa-warning"> </i> Error!! </strong><span>',
      });
    },
    beforeSend: function (xhr, settings) {
      xhr.setRequestHeader("Authorization", "Bearer " + USER_TOKEN);
    },
  });
};

var confirmDisableAlarm = function (vid) {
  bootbox.dialog({
    message:
      "Apakah alarm sudah dikonfirmasi ? Bila anda memilih Ya, maka tanda alarm di Peta akan disembunyikan.",
    title: "Disable Alarm",
    buttons: {
      yes: {
        label: "Ya",
        className: "btn-primary",
        callback: function () {
          console.log("Disable ALARM");
          disableVehicleAlarm(vid);
        },
      },
      no: {
        label: "Tidak",
        className: "btn-test",
      },
    },
  });
};

var disableVehicleAlarm = function (vid) {
  App.blockUI({
    boxed: true,
    message: "Sedang di proses....",
  });

  $.ajax({
    url: BACKEND_URL + "vehicles/disablealarm",
    dataType: "JSON",
    type: "POST",
    data: "vehicleId=" + vid,
    success: function (resp) {
      TrackingMap.loadList(0);
      App.unblockUI();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      App.unblockUI();
      var vmessage = extractErrorMessage(jqXHR);
      bootbox.alert({
        message: vmessage,
        title:
          '<span class="font-red bold"> <strong> <i class="fa fa-warning"> </i> Error!! </strong><span>',
      });
    },
    beforeSend: function (xhr, settings) {
      xhr.setRequestHeader("Authorization", "Bearer " + USER_TOKEN);
    },
  });
};

var cancelEdit = function (vcode) {
  isParamEdited[vcode] = 0;
  updateByStatus(vcode);
};

var reloadData = function (vid, showLoading, onFinish, onError) {
  if (typeof showLoading === "undefined") {
    showLoading = true;
  }
  if (showLoading) {
    $("#device_params_loading").show();
  }

  $.ajax({
    url: BACKEND_URL + "vehicles/obdparams",
    dataType: "JSON",
    type: "POST",
    data: "vehicleid=" + vid,
    success: function (resp) {
      // $('#edit_202').val('XXXX');
      console.log("param resp", resp);
      $("#device_params_loading").hide();
      $.each(resp.dataset, function (key, value) {
        var vcode = value["paramcode"];
        statusParam[vcode] = value;
        $("#edit_" + vcode).val(value["value"]);
        updateByStatus(vcode, value.status);
        value.oristatus = value.status;
      });
      if (onFinish) {
        console.log("finish update");
        onFinish(resp);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      var vmessage = extractErrorMessage(jqXHR);
      bootbox.alert({
        message: vmessage,
        title:
          '<span class="font-red bold"> <strong> <em class="fa fa-warning"> </em> Error!! </strong><span>',
      });
      if (onError) {
        onError(vmessage);
      }
    },
    beforeSend: function (xhr, settings) {
      xhr.setRequestHeader("Authorization", "Bearer " + USER_TOKEN);
    },
  });
};

var showParams = function (vid) {
  console.log("showParams");
  currentVid = vid;

  isParamEdited["0202"] = 0;
  isParamEdited["0203"] = 0;
  isParamEdited["0207"] = 0;

  $("#device_params").modal("show");

  $("#statinfo_0202").hide();
  $("#statinfo_0203").hide();
  $("#statinfo_0207").hide();

  $("#edit_0202").val("");
  $("#edit_0203").val("");
  $("#edit_0207").val("");

  $("#edit_0202").prop("disabled", true);
  $("#edit_0203").prop("disabled", true);
  $("#edit_0207").prop("disabled", true);

  $("#button_0202").prop("disabled", true);
  $("#button_0203").prop("disabled", true);
  $("#button_0207").prop("disabled", true);

  $("#buttony_0202").prop("disabled", true);
  $("#buttony_0203").prop("disabled", true);
  $("#buttony_0207").prop("disabled", true);

  $("#buttony_0202").show();
  $("#buttony_0203").show();
  $("#buttony_0207").show();

  $("#buttonx_0202").hide();
  $("#buttonx_0203").hide();
  $("#buttonx_0207").hide();

  $("#buttony_0202").show();
  $("#buttony_0203").show();
  $("#buttony_0207").show();

  // $('#image_0202').hide()
  // $('#image_0203').hide()
  // $('#image_0207').hide()
  reloadData(vid);
  // refreshData()
};

var refreshData = function () {
  var vtimeout = 5000;
  var vload = false;
  $.each(statusParam, function (key, value) {
    if (Number(statusParam[key]["status"]) === 2) {
      vload = true;
      return;
    }
    if (Number(statusParam[key]["status"]) === 4) {
      vload = true;
      return;
    }
    if (Number(statusParam[key]["status"]) === 7) {
      vload = true;
      return;
    }
  });
  if (vload) {
    reloadData(
      currentVid,
      false,
      function (resp) {
        setTimeout(function () {
          refreshData();
        }, vtimeout);
      },
      function (err) {
        setTimeout(function () {
          refreshData();
        }, vtimeout);
      }
    );
  } else {
    setTimeout(function () {
      refreshData();
    }, vtimeout);
  }
};

// var refreshData = function () {
//   // if ($(element).is(":visible"); )
//   if (($("#device_params").data('bs.modal') || {isShown: false}).isShown) {
//     console.log('modal show')
//     reloadData(currentVid, false, function (resp){
//       setTimeout(function(){
//         refreshData()
//       }, 30000)
//     }, function (err){
//       setTimeout(function(){
//         refreshData()
//       }, 30000)
//     })
//   } else {
//     // console.log('not show')
//     setTimeout(function(){
//       refreshData()
//     }, 30000)
//   }
// }

var clearComma = function (value) {
  return value.replace(/,/g, "");
};

var updateEditComponent = function (mode) {
  if (mode === "add") {
    $("#div_odometer").show();
    $("#odometer").prop("disabled", false);
    $("#modal_title_vehicle").html("Tambah Kendaraan");
    // $('#div_tahunbuat').removeClass('col-md-6')
    // $('#div_tglstnk').removeClass('col-md-6')
    // $('#div_odometer').removeClass('col-md-6')
    // $('#div_tahunbuat').addClass('col-md-4')
    // $('#div_tglstnk').addClass('col-md-4')
    // $('#div_odometer').addClass('col-md-4')
    $("#vehicleName").prop("disabled", false);
    $("#nomorPolisi").prop("disabled", false);
    $("#merkId").prop("disabled", false);
    $("#tipeId").prop("disabled", false);
    $("#tahunPembuatan").prop("disabled", false);
    $("#tanggalStnk").prop("disabled", false);
    $("#deviceId").prop("disabled", false);
    $("#simcardNo").prop("disabled", false);
    $("#vehiclegroup").prop("disabled", false);
    $("#div_mileage").hide();

    $("#merkId").removeClass("select-disabled");
    $("#tipeId").removeClass("select-disabled");
    $("#edit_vehicle").hide();
    $("#submit_vehicle").show();
    $("#submit_mileage").hide();
    $("#reset_mileage").hide();
    $("#cancel_edit").hide();
    $("#close_form").html("Batal");
  } else if (mode === "mileage") {
    $("#div_odometer").hide();
    $("#odometer").prop("disabled", true);
    $("#warning_message").hide();
    $("#modal_title_vehicle").html("Lihat Data Kendaraan");
    // $('#div_tahunbuat').removeClass('col-md-4')
    // $('#div_tglstnk').removeClass('col-md-4')
    // $('#div_odometer').removeClass('col-md-4')
    // $('#div_tahunbuat').addClass('col-md-6')
    // $('#div_tglstnk').addClass('col-md-6')
    // $('#div_odometer').addClass('col-md-6')

    $("#vehicleName").prop("disabled", true);
    $("#nomorPolisi").prop("disabled", true);
    $("#merkId").prop("disabled", true);
    $("#tipeId").prop("disabled", true);
    $("#tahunPembuatan").prop("disabled", true);
    $("#tanggalStnk").prop("disabled", true);
    $("#deviceId").prop("disabled", true);
    $("#simcardNo").prop("disabled", true);
    $("#vehiclegroup").prop("disabled", true);
    $("#merkId").addClass("select-disabled");
    $("#tipeId").addClass("select-disabled");
    $("#div_mileage").show();
    $("#mileage").prop("disabled", false);

    $("#edit_vehicle").hide();
    $("#submit_vehicle").show();
    $("#reset_mileage").hide();
    $("#submit_mileage").hide();
    $("#cancel_edit").show();
    $("#close_form").html("Tutup");
    $("#mileage").val(clearComma($("#mileage").val()));
  } else if (mode === "view") {
    $("#div_odometer").hide();
    $("#odometer").prop("disabled", true);
    $("#warning_message").hide();
    $("#modal_title_vehicle").html("Lihat Data Kendaraan");
    // $('#div_tahunbuat').removeClass('col-md-4')
    // $('#div_tglstnk').removeClass('col-md-4')
    // $('#div_odometer').removeClass('col-md-4')
    // $('#div_tahunbuat').addClass('col-md-6')
    // $('#div_tglstnk').addClass('col-md-6')
    // $('#div_odometer').addClass('col-md-6')

    $("#vehicleName").prop("disabled", true);
    $("#nomorPolisi").prop("disabled", true);
    $("#merkId").prop("disabled", true);
    $("#tipeId").prop("disabled", true);
    $("#tahunPembuatan").prop("disabled", true);
    $("#tanggalStnk").prop("disabled", true);
    $("#deviceId").prop("disabled", true);
    $("#simcardNo").prop("disabled", true);
    $("#vehiclegroup").prop("disabled", true);
    $("#merkId").addClass("select-disabled");
    $("#tipeId").addClass("select-disabled");
    $("#edit_vehicle").show();
    $("#submit_vehicle").hide();
    $("#submit_mileage").hide();
    $("#cancel_edit").hide();
    $("#reset_mileage").show();
    $("#close_form").html("Tutup");
    $("#div_mileage").show();
    $("#mileage").prop("disabled", true);
  } else {
    // edit
    $("#div_odometer").hide();
    $("#odometer").prop("disabled", true);
    $("#modal_title_vehicle").html("Ubah Kendaraan");
    // $('#div_tahunbuat').removeClass('col-md-4')
    // $('#div_tglstnk').removeClass('col-md-4')
    // $('#div_odometer').removeClass('col-md-4')
    // $('#div_tahunbuat').addClass('col-md-6')
    // $('#div_tglstnk').addClass('col-md-6')
    // $('#div_odometer').addClass('col-md-6')
    $("#vehicleName").prop("disabled", false);
    $("#nomorPolisi").prop("disabled", false);
    $("#merkId").prop("disabled", false);
    $("#tipeId").prop("disabled", false);
    $("#tahunPembuatan").prop("disabled", false);
    $("#tanggalStnk").prop("disabled", false);
    $("#deviceId").prop("disabled", true);
    $("#simcardNo").prop("disabled", true);
    $("#vehiclegroup").prop("disabled", false);
    $("#merkId").removeClass("select-disabled");
    $("#tipeId").removeClass("select-disabled");
    $("#edit_vehicle").hide();
    $("#submit_vehicle").show();
    $("#reset_mileage").hide();
    $("#submit_mileage").hide();
    $("#cancel_edit").show();
    $("#close_form").html("Tutup");
    $("#div_mileage").show();
    $("#mileage").prop("disabled", true);
  }
};

var showAddVehicle = function () {
  //alert('Add Vehicle')
  saveMode = "add";
  updateEditComponent("add");
  $("#add_vehicle_modal").modal("show");
  $("#vehicleId").val("");
  $("#vehicleName").val("");
  $("#nomorPolisi").val("");
  $("#merkId").val("");
  $("#tipeId").val("");
  $("#tahunPembuatan").val("");
  $("#tanggalStnk").val("");
  $("#deviceId").val("");
  $("#simcardNo").val("");
  $("#vehiclegroup").val("");
};

var dataVehicle = {};

var editDetail = function (vid) {
  // console.log('editDetail')
  saveMode = "edit";
  updateEditComponent("view");
  App.blockUI({
    boxed: true,
    message: "Sedang di proses....",
  });
  $("#vehicleId").val(vid);

  $.ajax({
    url: BACKEND_URL + "vehicles/edit",
    dataType: "JSON",
    type: "POST",
    data: "vehicleId=" + vid,
    success: function (resp) {
      App.unblockUI();
      dataVehicle = resp;
      $("#add_vehicle_modal").modal("show");
      $("#vehicleName").val(resp.vehiclename);
      $("#nomorPolisi").val(resp.nopol);
      $("#merkId").val(resp.merk);
      $("#tipeId").val(resp.tipe);
      $("#tahunPembuatan").val(resp.tahunpembuatan);
      $("#tanggalStnk").val(resp.tanggalstnk);
      $("#deviceId").val(resp.imei);
      $("#simcardNo").val(resp.simcard);
      $("#vehiclegroup").val(resp.vehiclegroup);
      $("#mileage").val(resp.odometer);

      tipeID = resp.tipe;
      $("#merkId").change();

      // var $el = $("#merkId");
      // $el.empty(); // remove old options
      // $el.append($("<option></option>").attr("value", 0).text("Merk/Manufacture*"));
      // $.each(resp.dataset, function(key, value) {
      //     $el.append($("<option></option>").attr("value", value.id).text(value.nama));
      // });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      App.unblockUI();
      var vmessage = extractErrorMessage(jqXHR);
      bootbox.alert({
        message: vmessage,
        title:
          '<span class="font-red bold"> <strong> <i class="fa fa-warning"> </i> Error!! </strong><span>',
      });
    },
    beforeSend: function (xhr, settings) {
      xhr.setRequestHeader("Authorization", "Bearer " + USER_TOKEN);
    },
  });
};

let download_text_data = function (filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

$("#cancel_edit").on("click", function () {
  updateEditComponent("view");
  var resp = dataVehicle;
  $("#vehicleName").val(resp.vehiclename);
  $("#nomorPolisi").val(resp.nopol);
  $("#merkId").val(resp.merk);
  $("#tipeId").val(resp.tipe);
  $("#tahunPembuatan").val(resp.tahunpembuatan);
  $("#tanggalStnk").val(resp.tanggalstnk);
  $("#deviceId").val(resp.imei);
  $("#simcardNo").val(resp.simcard);
  $("#vehiclegroup").val(resp.vehiclegroup);
  $("#mileage").val(resp.odometer);
});

$("#history_data-can").on("click", function () {
  let hari_ini = moment().format("YYYY-MM-DD");
  console.log("test hari ini", hari_ini);
  $("#tanggal-history").val(hari_ini);
  $("#can_vehicle_modal").modal("hide");
  $("#history_select_date_modal").modal("show");
  console.log("test1");
  // alert('test')
});

$("#download_history_data").on("click", function () {
  let vehicleid = $("#vehicleId-can").val();
  let vehiclename = $("#vehiclename-can").val();
  let tanggal = $("#tanggal-history").val();
  let filename = vehiclename + tanggal + ".csv";
  console.log("history-params", vehicleid, vehiclename, tanggal);

  let params = {
    vehicleid: vehicleid,
    tanggal: tanggal,
    type: "csv",
  };

  $.ajax({
    url: BACKEND_URL + "can/data_detail",
    // dataType: 'JSON',
    type: "POST",
    data: params,
    success: function (resp) {
      App.unblockUI();
      let dataVehicle = resp;
      console.log(dataVehicle);
      download_text_data(filename, dataVehicle);
      $("#history_select_date_modal").modal("hide");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      App.unblockUI();
      var vmessage = extractErrorMessage(jqXHR);
      bootbox.alert({
        message: vmessage,
        title:
          '<span class="font-red bold"> <strong> <i class="fa fa-warning"> </i> Error!! </strong><span>',
      });
    },
    beforeSend: function (xhr, settings) {
      xhr.setRequestHeader("Authorization", "Bearer " + USER_TOKEN);
    },
  });
});

var showCAN = function (vid) {
  // console.log('editDetail')
  // saveMode = 'edit'
  // updateEditComponent('view')
  App.blockUI({
    boxed: true,
    message: "Sedang di proses....",
  });
  $("#vehicleId").val(vid);

  $.ajax({
    url: BACKEND_URL + "vehicles/can",
    dataType: "JSON",
    type: "POST",
    data: "vehicleid=" + vid,
    success: function (resp) {
      App.unblockUI();
      dataVehicle = resp;
      $("#can_vehicle_modal").modal("show");
      $("#vehicleId-can").val(resp.vehicleid);
      $("#vehiclename-can").val(resp.vehiclename);
      $("#nopol-can").val(resp.nopol);
      $("#datatime-can").val(resp.datatime);
      $("#rpm-can").val(resp.rpm);
      $("#engine_temp-can").val(resp.engine_temp);
      $("#fuel_level_liter-can").val(resp.fuel_level_liter);
      $("#fuel_level_percentage-can").val(resp.fuel_level_percentage);
      $("#ecu_mileage-can").val(resp.ecu_mileage);
      $("#ecu_speed-can").val(resp.ecu_speed);
      $("#engine_oil_level-can").val(resp.engine_oil_level);
      $("#throtle_position-can").val(resp.throtle_position);
      $("#engine_work_time-can").val(resp.engine_work_time);
      $("#external_voltage-can").val(resp.external_voltage);

      tipeID = resp.tipe;
      $("#merkId").change();

      // var $el = $("#merkId");
      // $el.empty(); // remove old options
      // $el.append($("<option></option>").attr("value", 0).text("Merk/Manufacture*"));
      // $.each(resp.dataset, function(key, value) {
      //     $el.append($("<option></option>").attr("value", value.id).text(value.nama));
      // });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      App.unblockUI();
      var vmessage = extractErrorMessage(jqXHR);
      bootbox.alert({
        message: vmessage,
        title:
          '<span class="font-red bold"> <strong> <i class="fa fa-warning"> </i> Error!! </strong><span>',
      });
    },
    beforeSend: function (xhr, settings) {
      xhr.setRequestHeader("Authorization", "Bearer " + USER_TOKEN);
    },
  });
};

var TrackingMap = (function () {
  return {
    vehicleMarkers: null,
    route: null,
    vehicleList: [],
    vehicleData: {},
    geofenceMarkers: null,
    clearGeofenceMarkers: function () {
      if (this.geofenceMarkers) {
        this.map.removeLayer(this.geofenceMarkers);
      }
      this.geofenceMarkers = null;
    },

    placeMarkers: null,
    clearPlaceMarkers: function () {
      if (this.placeMarkers) {
        this.map.removeLayer(this.placeMarkers);
      }
      this.placeMarkers = null;
    },

    clearList: function () {
      this.hideVehicles();
      delete this.vehicleMarkers;
    },
    hideVehicles: function () {
      if (this.vehicleMarkers) {
        this.map.removeLayer(this.vehicleMarkers);
      }
    },
    resizeBound: function (vbounds, pct) {
      if (typeof pct == "undefined") {
        pct = 0.1; // 10 %
      }
      var vpt1 = vbounds.getNorthWest();
      var vpt2 = vbounds.getSouthEast();
      var vLatMin = vpt1.lat;
      var vLatMax = vpt2.lat;
      var vLonMin = vpt1.lng;
      var vLonMax = vpt2.lng;

      var vdelta = 0.001;
      if (vLatMax - vLatMin < 0.0000001) {
        vLatMin = vLatMin - vdelta;
        vLatMax = vLatMax + vdelta;
      }
      if (vLonMax - vLonMin < 0.0000001) {
        vLonMin = vLonMin - vdelta;
        vLonMax = vLonMax + vdelta;
      }

      vLatDelta = (vLatMax - vLatMin) * pct;
      vLonDelta = (vLonMax - vLonMin) * pct;
      vLatMin = vLatMin - vLatDelta;
      vLatMax = vLatMax + vLatDelta;
      vLonMin = vLonMin - vLonDelta;
      vLonMax = vLonMax + vLonDelta;

      var corner1 = L.latLng(vLatMin, vLonMin);
      var corner2 = L.latLng(vLatMax, vLonMax);
      return L.latLngBounds(corner1, corner2);
    },
    showVehicles: function () {
      if (this.vehicleMarkers) {
        this.map.addLayer(this.vehicleMarkers);
        var vbounds = this.vehicleMarkers.getBounds();
        var xbounds = this.resizeBound(vbounds);
        this.map.fitBounds(xbounds);
      }
    },
    mapBounds: null,
    loadGeofences: function () {
      var me = this;
      $.ajax({
        url: BACKEND_URL + "geofence/list",
        dataType: "JSON",
        type: "POST",
        success: function (resp) {
          console.log("geofence list", resp);
          me.showGeofences(resp.dataset);
        },
        complete: function (xhr, status) {},
        error: function (jqXHR, textStatus, errorThrown) {
          // window.setTimeout(function() {
          //   jsonError = jQuery.parseJSON( jqXHR.responseText );
          //   $('#warning_message').show();
          //   $('#error_message').html(jsonError.message);
          // }, 1000);
          console.log("error", jsonError.message);
          return false;
        },
        beforeSend: function (xhr, settings) {
          xhr.setRequestHeader("Authorization", "Bearer " + USER_TOKEN);
        },
      });
    },
    loadPlaces: function () {
      var me = this;
      $.ajax({
        url: BACKEND_URL + "place/list",
        dataType: "JSON",
        type: "POST",
        success: function (resp) {
          me.showPlaces(resp.dataset);
        },
        complete: function (xhr, status) {},
        error: function (jqXHR, textStatus, errorThrown) {
          // window.setTimeout(function() {
          //   jsonError = jQuery.parseJSON( jqXHR.responseText );
          //   $('#warning_message').show();
          //   $('#error_message').html(jsonError.message);
          // }, 1000);
          console.log("error", jsonError.message);
          return false;
        },
        beforeSend: function (xhr, settings) {
          xhr.setRequestHeader("Authorization", "Bearer " + USER_TOKEN);
        },
      });
    },
    checkTime: function (vitem) {
      if (typeof vitem.loctime === "undefined" || !vitem.loctime) {
        return "timeout";
      }
      var xtime = getDiffTime(vitem.loctime);
      if (xtime.days > 30) {
        return "inactive";
      } else {
        if (xtime.days > 1) {
          return "timeout";
        } else if (xtime.days === 1 && xtime.hours > 0) {
          return "timeout";
        } else {
          return "active";
        }
      }
    },
    filterData: function (dataset, mode) {
      var me = this;
      var vresult = {
        all: 0,
        on: 0,
        off: 0,
        timeout: 0,
        inactive: 0,
        dataset: [],
      };
      for (var i = 0; i < dataset.length; i++) {
        var vitem = dataset[i];
        var vtime = me.checkTime(vitem);
        if (vtime !== "inactive" && vtime !== "timeout") {
          vresult.all = vresult.all + 1;
          var vonoff;
          if (
            typeof vitem.stat_engine !== "undefined" &&
            vitem.stat_engine + "" === "1"
          ) {
            vresult.on = vresult.on + 1;
            vonoff = "on";
          } else {
            vresult.off = vresult.off + 1;
            vonoff = "off";
          }
          if (vtime === "timeout") {
            vresult.timeout = vresult.timeout + 1;
          }
          if (mode == "all") {
            vresult.dataset.push(vitem);
          } else if (mode == "on") {
            if (vonoff === "on") {
              vresult.dataset.push(vitem);
            }
          } else if (mode == "off") {
            if (vonoff === "off") {
              vresult.dataset.push(vitem);
            }
            // } else if (mode=='timeout') {
            //   if (vtime==='timeout') {
            //     vresult.dataset.push(vitem)
            //   }
          }
        } else if (vtime === "timeout") {
          vresult.timeout = vresult.timeout + 1;
          vresult.all = vresult.all + 1;
          if (mode === "timeout" || mode === "all") {
            vresult.dataset.push(vitem);
          }
        } else {
          vresult.inactive = vresult.inactive + 1;
          if (mode == "inactive") {
            vresult.dataset.push(vitem);
          }
        }
      }
      return vresult;
    },
    showFilterData: function (vfilter) {
      MapControlUpdateNumber("all", vfilter.all);
      MapControlUpdateNumber("on", vfilter.on);
      MapControlUpdateNumber("off", vfilter.off);
      MapControlUpdateNumber("timeout", vfilter.timeout);
      MapControlUpdateNumber("inactive", vfilter.inactive);
    },

    loadList: function (setBound, afterFinish) {
      if (typeof setBound == "undefined") {
        setBound = 1;
      }
      if (setBound) {
        App.blockUI({
          boxed: true,
          message: "Sedang di proses....",
        });
      }
      this.markers = [];
      var vsearch = MapControlGetSearchValue();
      var me = this;
      $.ajax({
        url: BACKEND_URL + "vehicles/list",
        dataType: "JSON",
        type: "POST",
        // data: 'showblokir=1',
        data: { showblokir: 1, search: vsearch },
        success: function (resp) {
          var vLatMin, vLatMax, vLonMin, vLonMax;
          var vfirst = true;
          var vlist = [];

          //var vehicle_list='<li><a href="javascript:;" onclick="viewAll();">All Vehicle</a><span><a data-toggle="modal" href="#add_vehicle_modal"><i class="icon-plus"></i></span><i class="arrow"></i></a></li>';
          // var vehicle_list = '<li id="custom-search-form"><input type="text" class="search-query" placeholder="Search"><button type="submit" class="btn sar"><i class="icon-search"></i></button><button onclick="showAddVehicle();" xdata-toggle="modal" xhref="#add_vehicle_modal" type="button" class="btn btn btn-gugu" ><i class="icon-plus" style="font-size:10px; font-weight:300"></i> Tambah Kendaran</button></li>';
          var vehicle_list =
            '<li id="custom-search-form"><button onclick="showAddVehicle();" xdata-toggle="modal" xhref="#add_vehicle_modal" type="button" class="btn btn btn-gugu" style="margin-top:0"><i class="icon-plus" style="font-size:10px; font-weight:300"></i> Tambah Kendaran</button></li>';
          tmp_vehicle = resp.dataset;
          var vmode = MapControlCheckFilter();
          var vfiltered = me.filterData(resp.dataset, vmode);
          me.showFilterData(vfiltered);

          me.clearList();
          $.each(vfiltered.dataset, function (key, value) {
            var vbtnstyle =
              "margin-right: 2px; padding-bottom: 2px; padding-top: 2px; padding-right: 6px; padding-left: 6px;";
            if (value.vstatus !== "blokir") {
              var vdisabled = "";
              if (value.protocol !== "zte" && value.protocol !== "zte_welink") {
                vdisabled = " disabled ";
              }
              var vsecondline = "";
              if (value.nopol) {
                vsecondline = value.nopol;
              }
              if (value.vehiclegroup) {
                if (vsecondline) {
                  vsecondline = vsecondline + ", ";
                }
                vsecondline = vsecondline + value.vehiclegroup;
              }
              if (value.loctime === undefined || value.loctime === null) {
                vehicle_list =
                  vehicle_list +
                  "<li>" +
                  '<a href="javascript:;" onclick="zoomVehicle(\'' +
                  value.vehicleid +
                  "');\">" +
                  value.vehiclename +
                  "</a>" +
                  // '<a href="'+BASE_URL+'vehicle/edit/'+value.vehicleid+'/'+value.vehiclename+'"><button type="button" class="btn btn-default">Detail</button></a>'+
                  // '<a href="'+BASE_URL+'vehicle/edit/'+value.vehicleid+'/'+value.vehiclename+'"><button type="button" class="btn btn-default button-md" style="'+vbtnstyle+'"><i class="icon-th-list"></i></button></a>'+
                  '<a href="javascript:;" onclick="editDetail(\'' +
                  value.vehicleid +
                  '\');"><button type="button" class="btn btn-default button-md" style="' +
                  vbtnstyle +
                  '"><i class="icon-th-list"></i></button></a>' +
                  // '<a href="'+BASE_URL+'vehicle/edit/'+value.vehicleid+'/'+value.vehiclename+'"><button type="button" class="btn btn-default button-md" style="'+vbtnstyle+'"><i class="icon-th-list"></i></button></a>'+
                  // '<a href="javascript:;" onclick="showQuota(\'' + value.simcard + '\');"><button type="button" class="btn btn-default button-md" style="' + vbtnstyle + '"><i class="icon-fourg"></i></button></a>' +
                  '<a href="javascript:;" onclick="showCAN(\'' +
                  value.vehicleid +
                  '\');"><button type="button" class="btn btn-default button-md" style="' +
                  vbtnstyle +
                  '"><i class="icon-speed"></i></button></a>' +
                  '<a href="javascript:;"onclick="showParams(\'' +
                  value.vehicleid +
                  '\');"><button type="button" class="btn btn-default button-md" style="' +
                  vbtnstyle +
                  '" ' +
                  vdisabled +
                  '><i class="icon-wifi"></i></button></a>' +
                  '<span class="vehicle_subitem">' +
                  vsecondline +
                  "</span>" +
                  "</li>";
              } else {
                vehicle_list =
                  vehicle_list +
                  "<li>" +
                  '<a href="javascript:;" onclick="zoomVehicle(\'' +
                  value.vehicleid +
                  "');\">" +
                  value.vehiclename +
                  "</a>" +
                  // '<a href="'+BASE_URL+'vehicle/edit/'+value.vehicleid+'/'+value.vehiclename+'"><button type="button" class="btn btn-default button-md" style="'+vbtnstyle+'"><i class="icon-th-list"></i></button></a>'+
                  '<a href="javascript:;" onclick="editDetail(\'' +
                  value.vehicleid +
                  '\');"><button type="button" class="btn btn-default button-md" style="' +
                  vbtnstyle +
                  '"><i class="icon-th-list"></i></button></a>' +
                  // '<a href="'+BASE_URL+'vehicle/edit/'+value.vehicleid+'/'+value.vehiclename+'"><button type="button" class="btn btn-default button-md" style="'+vbtnstyle+'"><i class="icon-th-list"></i></button></a>'+
                  // '<a href="javascript:;" onclick="showQuota(\'' + value.simcard + '\');"><button type="button" class="btn btn-default button-md" style="' + vbtnstyle + '"><i class="icon-fourg"></i></button></a>' +
                  '<a href="javascript:;" onclick="showCAN(\'' +
                  value.vehicleid +
                  '\');"><button type="button" class="btn btn-default button-md" style="' +
                  vbtnstyle +
                  '"><i class="icon-speed"></i></button></a>' +
                  '<a href="javascript:;"onclick="showParams(\'' +
                  value.vehicleid +
                  '\');"><button type="button" class="btn btn-default button-md" style="' +
                  vbtnstyle +
                  '" ' +
                  vdisabled +
                  '><i class="icon-wifi"></i></button></a>' +
                  '<p class="' +
                  date_label(value.loctime) +
                  ' " id="timeinfo_' +
                  value.vehicleid +
                  '" >' +
                  date_diff(value.loctime) +
                  "</p>" +
                  '<span class="vehicle_subitem">' +
                  vsecondline +
                  "</span>" +
                  "</li>";
                getMinimTime(value.loctime);
              }
            } else {
              vehicle_list =
                vehicle_list +
                '<li><a href="javascript:;" style="color:#bbb;" onclick="">' +
                value.vehiclename +
                "</a>" +
                '<p class="' +
                "far2" +
                '">' +
                "Terblokir" +
                "</p></li>";
            }

            if (
              value.latitude === undefined ||
              value.latitude === null ||
              value.vstatus === "blokir"
            ) {
            } else {
              //console.log(date_diff(value.loctime));

              // me.clearList();
              me.vehicleData[value.vehicleid] = value;

              var d = new Date(value.loctime);
              var fmtDT =
                d.getDate() +
                "-" +
                (d.getMonth() + 1) +
                "-" +
                d.getFullYear() +
                " " +
                d.getHours() +
                ":" +
                d.getMinutes() +
                ":" +
                d.getSeconds();

              var vAlarm = value.alarm;
              var contentString =
                '<div id="siteNotice">' +
                "</div>" +
                '<h1 id="firstHeading" class="firstHeading" style="color: #32c5d2;font-size: 20px;margin: 0px;">' +
                value.vehiclename +
                ' </h1><p style="margin-top:-25px;" class="' +
                date_label(value.loctime) +
                '">' +
                date_diff(value.loctime) +
                '</p><hr style="border: 0;border-top: 3px solid #32c5d2;border-bottom: 0;"/>' +
                '<div id="bodyContent">' +
                "<table><tr><td><b>Location Date/Time </b></td> <td>&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;</td> <td>" +
                (fmtDT == undefined || fmtDT == null ? 0 : fmtDT) +
                // '</td></tr>'+
                // '<tr><td><b>Mileage</b> </td> <td> &nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp; </td><td>'+((value.mileage === undefined || value.mileage === null)?0:value.mileage)+
                // '</td></tr>'+
                "<tr><td><b>Kecepatan  </b> </td> <td> &nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp; </td>" +
                "<td>" +
                (value.speed == undefined || value.speed == null
                  ? 0
                  : value.speed) +
                "</td></tr>" +
                "<tr>" +
                "<td><b>Status Mesin </b> </td> <td> &nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp; </td>" +
                "<td>" +
                (value.stat_engine === "1"
                  ? "<span class='label label-success'>ON</span>"
                  : "<span class='label label-warning'>OFF</span>") +
                "</td>" +
                "</tr>";
              if (value.status_data) {
                contentString =
                  contentString +
                  "<tr>" +
                  "<td><b>Status Data </b> </td> <td> &nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp; </td>" +
                  "<td>" +
                  value.status_data +
                  "</td>" +
                  "</tr>";
              }
              // if (value.status_gps) {
              //   contentString = contentString+
              //     '<tr>'+
              //     '<td><b>Status GPS </b> </td> <td> &nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp; </td>'+
              //     '<td>'+value.status_gps+'</td>'+
              //     '</tr>'
              // }
              if (vAlarm) {
                contentString =
                  contentString +
                  "<tr>" +
                  "<td colspan=2>" +
                  '<span class="label label-danger" style="font-size: 13px;"> &nbsp;' +
                  vAlarm +
                  " ! &nbsp;</span>" +
                  "</td>" +
                  '<td><button onclick="confirmDisableAlarm(' +
                  value.vehicleid +
                  ');" type="button" class="btn btn btn-xs" >Confirm</button></td>' +
                  "</tr>";
              }
              contentString =
                contentString +
                "</table>" +
                '<hr style="border-top: 1px solid #32c5d2;"/>' +
                '<b>Lokasi Saat ini  &nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp; </b><div id="location' +
                value.vehicleid +
                '"> </div></div>';
              // var vmarker = L.marker([value.latitude, value.longitude], {icon: me.carIcon})
              //     .addTo(me.map).bindPopup(contentString, {maxWidth: 600});
              // console.log('value......', value)
              var vtype = 0; // car
              if (typeof value.vehicletype !== "undefined") {
                vtype = value.vehicletype;
              }
              var vcaricon = me.carOff;
              if (Number(vtype) === 1) {
                // console.log('bike........')
                var vcaricon = me.bikeOff;
                if (value.stat_engine == 1) {
                  vcaricon = me.bikeOn;
                }
                if (value.alarm) {
                  vcaricon = me.bikeAlarm;
                }
              } else if (Number(vtype) === 2) {
                vcaricon = me.ptracker;
              } else {
                if (value.stat_engine == 1) {
                  vcaricon = me.carOn;
                }
                if (value.alarm) {
                  vcaricon = me.carAlarm;
                }
              }
              var vmarker = L.marker([value.latitude, value.longitude], {
                icon: vcaricon,
                rotationAngle: value.angle,
              }).bindPopup(contentString, {
                maxWidth: 600,
              });
              vlist.push(vmarker);

              var vMarkerLabel = value.vehiclename;
              if (vMarkerLabel.length > 20) {
                vMarkerLabel = vMarkerLabel.substr(0, 20) + "...";
              }
              var vLabelWidth = vMarkerLabel.length * 6 + 10;
              if (vLabelWidth < 60) {
                vLabelWidth = 60;
              }
              var vMyIcon = L.divIcon({
                className: "div-icon",
                iconSize: [vLabelWidth, 20],
                iconAnchor: [vLabelWidth / 2, -18],
                html: "<span>" + vMarkerLabel + "</span>",
              });
              console.log("vMyIcon", vMyIcon);
              var xmarker = L.marker([value.latitude, value.longitude], {
                icon: vMyIcon,
              });
              vlist.push(xmarker);

              var vlat = Number(value.latitude);
              var vlon = Number(value.longitude);
              if (vfirst) {
                vLatMin = vlat;
                vLatMax = vlat;
                vLonMin = vlon;
                vLonMax = vlon;
                vfirst = false;
              } else {
                if (vlat < vLatMin) {
                  vLatMin = vlat;
                }
                if (vlat > vLatMax) {
                  vLatMax = vlat;
                }
                if (vlon < vLonMin) {
                  vLonMin = vlon;
                }
                if (vlon > vLonMax) {
                  vLonMax = vlon;
                }
              }
              console.log(value);
            }
          });

          if (resp.geofences) {
            for (var i = 0; i < resp.geofences.length; i++) {
              var xrad = resp.geofences[i].radius / 111.32;
              var xlat1 = resp.geofences[i].latitude * 1.0 - xrad;
              var xlat2 = resp.geofences[i].latitude * 1.0 + xrad;
              var xlon1 = resp.geofences[i].longitude * 1.0 - xrad;
              var xlon2 = resp.geofences[i].longitude * 1.0 + xrad;
              if (vfirst) {
                vLatMin = xlat1;
                vLatMax = xlat2;
                vLonMin = xlon1;
                vLonMax = xlon2;
                vfirst = false;
              } else {
                if (xlat1 < vLatMin) {
                  vLatMin = xlat1;
                }
                if (xlat2 > vLatMax) {
                  vLatMax = xlat2;
                }
                if (xlon1 < vLonMin) {
                  vLonMin = xlon1;
                }
                if (xlon2 > vLonMax) {
                  vLonMax = xlon2;
                }
              }
            }
          }

          $("#vehicle_list").html(vehicle_list); //display sidebar vehicle list

          if (vfirst) {
            vLatMin = -6.85346;
            vLatMax = -6.966785;
            vLonMin = 107.55641;
            vLonMax = 107.7279;
          }

          me.vehicleMarkers = L.featureGroup(vlist).addTo(me.map);

          var vdelta = 0.0025;
          if (vLatMax - vLatMin < 0.0000001) {
            vLatMin = vLatMin - vdelta;
            vLatMax = vLatMax + vdelta;
          }
          if (vLonMax - vLonMin < 0.0000001) {
            vLonMin = vLonMin - vdelta;
            vLonMax = vLonMax + vdelta;
          }

          vLatDelta = (vLatMax - vLatMin) * 0.1;
          vLonDelta = (vLonMax - vLonMin) * 0.1;
          vLatMin = vLatMin - vLatDelta;
          vLatMax = vLatMax + vLatDelta;
          vLonMin = vLonMin - vLonDelta;
          vLonMax = vLonMax + vLonDelta;

          var corner1 = L.latLng(vLatMin, vLonMin),
            corner2 = L.latLng(vLatMax, vLonMax),
            bounds = L.latLngBounds(corner1, corner2);
          if (setBound) {
            me.map.fitBounds(bounds);
          }
        },
        complete: function (xhr, status) {
          App.unblockUI();
          if (typeof afterFinish != "undefined") {
            afterFinish();
          }
          write_location(tmp_vehicle);
        },
        beforeSend: function (xhr, settings) {
          xhr.setRequestHeader("Authorization", "Bearer " + USER_TOKEN);
        },
      });
    },
    createIconByImg: function (vimg) {
      var vicon = L.icon({
        iconUrl: BASE_URL + "assets/img/icon/" + vimg,
        // shadowUrl: 'leaf-shadow.png',

        iconSize: [16, 32], // size of the icon
        // shadowSize:   [50, 64], // size of the shadow
        // iconAnchor:   [20, 17], // point of the icon which will correspond to marker's location
        iconAnchor: [8, 16],
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [0, -10], // point from which the popup should open relative to the iconAnchor
      });
      return vicon;
    },
    createIconByImg2: function (vimg) {
      var vicon = L.icon({
        iconUrl: BASE_URL + "assets/img/icon/" + vimg,
        // shadowUrl: 'leaf-shadow.png',

        iconSize: [20, 40], // size of the icon
        // shadowSize:   [50, 64], // size of the shadow
        // iconAnchor:   [20, 17], // point of the icon which will correspond to marker's location
        iconAnchor: [8, 16],
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [0, -10], // point from which the popup should open relative to the iconAnchor
      });
      return vicon;
    },
    createIconByImg3: function (vimg) {
      // icon size 40x40
      var vicon = L.icon({
        iconUrl: BASE_URL + "assets/img/icon/" + vimg,
        // shadowUrl: 'leaf-shadow.png',

        iconSize: [40, 40], // size of the icon
        shadowSize: [40, 40], // size of the shadow
        // iconAnchor:   [20, 17], // point of the icon which will correspond to marker's location
        iconAnchor: [20, 20],
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [0, -10], // point from which the popup should open relative to the iconAnchor
      });
      return vicon;
    },
    createIconByImg4: function (vimg) {
      // icon size 40x40
      var vicon = L.icon({
        iconUrl: BASE_URL + "assets/img/icon/" + vimg,
        // shadowUrl: 'leaf-shadow.png',

        iconSize: [30, 40], // size of the icon
        shadowSize: [30, 40], // size of the shadow
        // iconAnchor:   [20, 17], // point of the icon which will correspond to marker's location
        iconAnchor: [15, 30],
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [0, -10], // point from which the popup should open relative to the iconAnchor
      });
      return vicon;
    },
    createIcon: function () {
      // var vicon = L.icon({
      //     iconUrl: BASE_URL+'assets/img/icon/03.png',
      //     // shadowUrl: 'leaf-shadow.png',

      //     iconSize:     [19, 40], // size of the icon
      //     // shadowSize:   [50, 64], // size of the shadow
      //     iconAnchor:   [20, 17], // point of the icon which will correspond to marker's location
      //     shadowAnchor: [4, 62],  // the same for the shadow
      //     popupAnchor:  [-20, -10] // point from which the popup should open relative to the iconAnchor

      // });
      this.carIcon = this.createIconByImg("03.png");
      this.carOff = this.createIconByImg("car-off.png");
      this.carOn = this.createIconByImg("car-on.png");
      this.carAlarm = this.createIconByImg("car-alarm.png");
      this.bikeOff = this.createIconByImg2("bike-off.png");
      this.bikeOn = this.createIconByImg2("bike-on.png");
      this.bikeAlarm = this.createIconByImg2("bike-alarm.png");
      this.bikeAlarm = this.createIconByImg2("bike-alarm.png");
      this.kantor = this.createIconByImg3("kantor.png");
      this.rumah = this.createIconByImg3("rumah.png");
      this.cabang = this.createIconByImg3("cabang.png");
      this.ptracker = this.createIconByImg4("ptracker.png");
    },
    showGeofences: function (vgeofences) {
      for (var i = 0; i < vgeofences.length; i++) {
        if (vgeofences[i].objtype === "circle") {
          var vlat = vgeofences[i].latitude;
          var vlon = vgeofences[i].longitude;
          var vradius = Number(vgeofences[i].radius) * 1000;
          var circle = L.circle([vlat, vlon], {
            color: "blue",
            weight: 1,
            fillColor: "#44a",
            fillOpacity: 0.15,
            opacity: 0.5,
            dashArray: "10 5",
            radius: vradius,
          }).addTo(this.map);
          circle.bindPopup(vgeofences[i].geofencename);
        }
      }
    },
    showPlaces: function (vplaces) {
      console.log("Places", vplaces);
      for (var i = 0; i < vplaces.length; i++) {
        var vlat = vplaces[i].latitude;
        var vlon = vplaces[i].longitude;
        // circle.bindPopup(vgeofences[i].geofencename)
        var vicon;
        if (vplaces[i].placetype === "K") {
          vicon = this.kantor;
        } else if (vplaces[i].placetype === "C") {
          vicon = this.cabang;
        } else {
          vicon = this.rumah;
        }
        var contentString =
          "<b>" + vplaces[i].placename + "</b>" + "<br />" + vplaces[i].address;
        var vmarker = L.marker([vlat, vlon], { icon: vicon })
          .bindPopup(contentString, { maxWidth: 200 })
          .addTo(this.map);
      }
    },
    MapControlOnClick: function (vmode) {},
    init: function () {
      this.createIcon();
      var map = L.map("map_canvas", {
        zoomControl: false,
      }).setView([-6.9318315, 107.616872], 12);

      this.map = map;

      var roadMutant = L.gridLayer
        .googleMutant({
          maxZoom: 20,
          type: "roadmap",
        })
        .addTo(map);

      var hybridMutant = L.gridLayer.googleMutant({
        maxZoom: 20,
        type: "hybrid",
      });

      var trafficMutant = L.gridLayer.googleMutant({
        maxZoom: 20,
        type: "roadmap",
      });
      trafficMutant.addGoogleLayer("TrafficLayer");
      // var trafficMutant = L.gridLayer.googleMutant({
      //   maxZoom: 20,
      //   type:'none'
      // });
      // trafficMutant.addGoogleLayer('TrafficLayer');

      // L.control.layers({
      //   "Road Map": roadMutant,
      //   // Aerial: satMutant,
      //   // Terrain: terrainMutant,
      //   "Satellite": hybridMutant,
      //   // Styles: styleMutant,
      //   "Road with Traffic Map": trafficMutant,
      //   // Transit: transitMutant
      // }, {}, {
      //   collapsed: false
      // }).addTo(map);

      var baseLayer = {
        "Road Map": roadMutant,
        Satellite: hybridMutant,
        "Road with Traffic Map": trafficMutant,
      };

      var overlayLayer = {
        // "Traffic": L.geoJSON(geojsonFeature).addTo(map)
      };
      this.layerControl = L.control
        .layers(baseLayer, overlayLayer, {
          collapsed: true,
        })
        .addTo(map);

      var me = this;
      this.loadList(1, function () {
        me.poolingReload();
        $("#location4").html("Test");
      });
      this.loadGeofences(function () {
        //
      });
      this.loadPlaces(function () {
        //
      });
      setTimeout(function () {
        refreshData();
      }, 10000);

      // map controls
      L.control
        .zoom({
          position: "bottomleft",
        })
        .addTo(map);
      L.control.dataFilter({ position: "topleft" }).addTo(me.map);

      MapControlPrepareEvent(me.MapSearchOnClick, me.MapFilterOnClick);

      // MapControlUpdateNumber('all', 65)
      // MapControlUpdateNumber('on', 20)
      // MapControlUpdateNumber('off', 30)
      // MapControlUpdateNumber('timeout', 15)
      // MapControlUpdateNumber('inactive', 1234)

      this.LoadCustomLayer();
      this.loadRiskData();
    },
    getRiskColor: function (xid, riskdata) {
      var vColorList = {
        "RESIKO TINGGI": "rgb(230, 0, 0)",
        "RESIKO SEDANG": "rgb(252, 132, 3)",
        "RESIKO RENDAH": "rgb(222, 215, 22)",
        "TIDAK ADA KASUS": "rgb(0, 189, 85)",
        "TIDAK TERDAMPAK": "rgb(0, 89, 45)",
      };
      if (typeof riskdata[xid] !== "undefined") {
        var vhasil = riskdata[xid];
        if (typeof vColorList[vhasil] !== "undefined") {
          var vresult = vColorList[vhasil];
          return vresult;
        }
      }
      return "#999";
    },
    getStyleById: function (vid) {
      var vcolor = this.getRiskColor(vid, this.riskData);
      var vitem = {
        color: vcolor,
        weight: 0.5,
        fillColor: vcolor,
        fillOpacity: 0.5,
      };
      // vitem['stroke'] = '#555555'
      // vitem['stroke-width'] = 0.5
      // vitem['stroke-opacity'] = 1
      // vitem['fill'] = 'red'
      // vitem['fill-opacity'] = 0.5
      return vitem;
    },
    getPopupText: function (feature) {
      var xid = feature.id;
      var riskdata = this.riskData;
      var vres = " - ";
      if (typeof riskdata[xid] !== "undefined") {
        vres = riskdata[xid];
      }
      var vresult =
        feature.properties.kota +
        ", " +
        feature.properties.provinsi +
        "<br/>" +
        "status: " +
        vres;
      return vresult;
    },
    // PreprocessingMap: function (baseGeo, riskData) {
    //   console.log('baseGeo', baseGeo);
    //   for (var i=0; i<baseGeo.features.length; i++) {
    //     var xitem = baseGeo.features[i]
    //     var xid = xitem.id
    //     var vcolor = this.getRiskColor(xid, riskData)
    //     var vitem = {}
    //     vitem['stroke'] = '#555555'
    //     vitem['stroke-width'] = 0.5
    //     vitem['stroke-opacity'] = 1
    //     vitem['fill'] = 'red'
    //     vitem['fill-opacity'] = 0.5
    //     baseGeo.features[i].geometry.style = vitem

    //     // "stroke": "#555555",
    //     // "stroke-width": 2,
    //     // "stroke-opacity": 1,
    //     // "fill": "#df6262",
    //     // "fill-opacity": 0.5,

    //     // this.updateFormat(vitem)
    //   }
    //   return baseGeo
    // },
    DisplayCustomLayer: function () {
      var me = this;
      if (this.baseGeoJson && this.riskData) {
        // var xresp = this.PreprocessingMap(this.baseGeoJson, this.riskData)
        var myStyle = {
          color: "#ff7800",
          weight: 5,
          opacity: 0.65,
        };
        xresp = this.baseGeoJson;
        var gjLayer = L.geoJSON(xresp, {
          style: function (feature) {
            vid = feature.id;
            return me.getStyleById(vid);
          },
          onEachFeature: function (feature, layer) {
            var vpopup = me.getPopupText(feature);
            layer.bindPopup(vpopup);
          },
        });
        gjLayer.addTo(this.map);
        console.log("xx add overlay layer.....");
        this.layerControl.addOverlay(gjLayer, "Covid19.co.id");
      }
    },
    LoadCustomLayer: function () {
      var me = this;
      // me.riskData = {test: 1}
      $.ajax({
        url: BACKEND_URL + "content/download/file/wadmkota",
        dataType: "JSON",
        type: "POST",
        success: function (resp) {
          // me.showPlaces(resp.dataset)
          // console.log('resp....xxxx.....', resp)
          try {
            me.baseGeoJson = resp;
            me.DisplayCustomLayer();
          } catch (exp) {
            // continue
            console.error(exp);
          }
        },
        complete: function (xhr, status) {},
        error: function (jqXHR, textStatus, errorThrown) {
          console.log("error", jsonError.message);
          return false;
        },
        beforeSend: function (xhr, settings) {
          xhr.setRequestHeader("Authorization", "Bearer " + USER_TOKEN);
        },
      });

      // setTimeout(function () {
      //   var gjLayer = L.geoJSON(geojsonFeature).addTo(me.map)
      //   me.layerControl.addOverlay(gjLayer, 'Covid Risk Map')
      //   me.map
      // }, 1000)
    },
    loadRiskData: function () {
      var me = this;
      // me.riskData = {test: 1}
      $.ajax({
        url: BACKEND_URL + "content/download/file/riskdata",
        dataType: "JSON",
        type: "POST",
        success: function (resp) {
          // me.showPlaces(resp.dataset)
          try {
            console.log("resp....risk data...xxxx.....", resp);
            var xrisk = {};
            for (var i = 0; i < resp.data.length; i++) {
              var vitem = resp.data[i];
              xrisk[vitem["kode_kota"]] = vitem["hasil"];
            }
            me.riskData = xrisk;
            console.log("resp....xrisk data...xxxx.....", xrisk);
            me.DisplayCustomLayer();
          } catch (exp) {
            // continue
            console.error(exp);
          }
        },
        complete: function (xhr, status) {},
        error: function (jqXHR, textStatus, errorThrown) {
          console.log("error", jsonError.message);
          return false;
        },
        beforeSend: function (xhr, settings) {
          xhr.setRequestHeader("Authorization", "Bearer " + USER_TOKEN);
        },
      });
    },
    MapSearchOnClick: function (vtext) {
      var me = TrackingMap;
      me.loadList(0);
    },
    MapFilterOnClick: function (vmode) {
      var me = TrackingMap;
      me.loadList(0);
    },
    poolingReload: function () {
      var me = this;
      setTimeout(function () {
        me.loadList(0, function () {
          me.poolingReload();
        });
      }, 30000);
      //write_location(tmp_vehicle);
    },
    createGroupRoute: function (vdata) {
      var vspeed = 100;
      var vstart, vend;
      var vresult = false;
      if (vdata.length > 0) {
        vstart = [vdata[0].latitude * 1.0, vdata[0].longitude * 1.0];

        vpoly = [];
        if (vdata.length > 1) {
          for (var i = 0; i < vdata.length; i++) {
            vpoly.push([vdata[i].latitude * 1.0, vdata[i].longitude * 1.0]);
          }
          vend = [
            vdata[vdata.length - 1].latitude * 1.0,
            vdata[vdata.length - 1].longitude * 1.0,
          ];
          vresult = L.featureGroup([
            L.marker(vstart, { snakingSpeed: vspeed }),
            L.polyline(vpoly, {
              snakingSpeed: vspeed,
              color: "black",
              opacity: 0.5,
              weight: 7,
            }),
            L.marker(vend, { snakingSpeed: vspeed }),
          ]);
        } else {
          vresult = L.featureGroup([
            L.marker(vstart, { snakingSpeed: vspeed }),
          ]);
        }
      }
      return vresult;
    },
    playRoute: function (vdata) {
      this.hideVehicles();
      this.hideRoute();
      var vroute = this.createGroupRoute(vdata);
      if (vroute) {
        this.map.fitBounds(vroute.getBounds());
        this.map.addLayer(vroute);
        vroute.snakeIn();
      }
      this.route = vroute;
    },
    showRoute: function (vdata) {
      this.hideVehicles();
      this.hideRoute();
      var vroute = this.createGroupRoute(vdata);
      if (vroute) {
        this.map.fitBounds(vroute.getBounds());
        this.map.addLayer(vroute);
      }
      this.route = vroute;
    },
    hideRoute: function () {
      if (this.route) {
        this.map.removeLayer(this.route);
      }
    },
    zoomToVehicle: function (vehicleId) {
      if (this.vehicleMarkers) {
        this.map.addLayer(this.vehicleMarkers);
        if (this.vehicleData[vehicleId]) {
          var vdata = this.vehicleData[vehicleId];
          var corner1 = L.latLng(vdata.latitude, vdata.longitude);
          var corner2 = L.latLng(vdata.latitude, vdata.longitude);
          var vbound = L.latLngBounds(corner1, corner2);
          var xbound = this.resizeBound(vbound);
          this.map.fitBounds(xbound);
        }
      }
    },
  };
})();

function write_location(tmp_vehicle) {
  if (tmp_vehicle != undefined && tmp_vehicle.length > 0) {
    // $.each(tmp_vehicle, function(key, value) {
    // 	if (value.latitude === undefined || value.longitude === null) {
    // 	}else{
    // 		latLngToAddress(value.latitude,value.longitude, function(result) {
    // 			$("#location"+value.vehicleid).html("lokasi");
    // 			console.log(result);
    // 			console.log(value.vehicleid);
    // 		});
    // 	}
    // });
  }
}

function initVehicle() {
  $.ajax({
    url: BACKEND_URL + "lookup/merk",
    dataType: "JSON",
    success: function (resp) {
      var $el = $("#merkId");
      $el.empty(); // remove old options
      $el.append(
        $("<option></option>").attr("value", 0).text("Merk/Manufaktur*")
      );
      $.each(resp.dataset, function (key, value) {
        $el.append(
          $("<option></option>").attr("value", value.id).text(value.nama)
        );
      });
    },
    beforeSend: function (xhr, settings) {
      xhr.setRequestHeader("Authorization", "Bearer " + USER_TOKEN);
    },
  });

  $("#merkId").on("change", function () {
    var $el = $("#tipeId");
    $el.empty(); // remove old options
    $el.append($("<option></option>").attr("value", "").text("Loading...."));
    $.ajax({
      url: BACKEND_URL + "lookup/model/merkId/" + $("#merkId").val(),
      dataType: "JSON",
      success: function (response) {
        $("#tipeId").val("");
        $("#tipeId").trigger("change");
        $el.empty(); // remove old options
        $el.append(
          $("<option></option>").attr("value", 0).text("Tipe Kendaraan*")
        );
        $.each(response.dataset, function (key, value) {
          $el.append(
            $("<option></option>").attr("value", value.id).text(value.nama)
          );
        });
        $("#tipeId").val(tipeID);
      },
      beforeSend: function (xhr, settings) {
        xhr.setRequestHeader("Authorization", "Bearer " + USER_TOKEN);
      },
    });
  });

  $("#edit_vehicle").on("click", function () {
    saveMode = "edit";
    updateEditComponent("edit");
  });

  $("#reset_mileage").on("click", function () {
    saveMode = "mileage";
    updateEditComponent("mileage");
  });

  $("#tahunPembuatan").keypress(function (evt) {
    evt = evt ? evt : window.event;
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      evt.preventDefault();
    } else {
      return true;
    }
  });

  $("#simcardNo").keypress(function (evt) {
    evt = evt ? evt : window.event;
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      evt.preventDefault();
    } else {
      return true;
    }
  });

  $("#odometer").keypress(function (evt) {
    evt = evt ? evt : window.event;
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      evt.preventDefault();
    } else {
      return true;
    }
  });

  $("#submit_vehicle").on("click", function () {
    App.blockUI({
      boxed: true,
      message: "Sedang di proses....",
      target: "#add_vehicle_modal",
    });

    var vurl;
    if (saveMode === "add") {
      vurl = BACKEND_URL + "vehicles/add";
    } else if (saveMode === "mileage") {
      vurl = BACKEND_URL + "vehicles/reset_mileage";
    } else {
      vurl = BACKEND_URL + "vehicles/update";
    }

    $.ajax({
      url: vurl,
      dataType: "JSON",
      type: "POST",
      data: $("#vehicle-form").serialize(),
      success: function (response) {
        if (response.success) {
          App.unblockUI("#add_vehicle_modal");
          window.setTimeout(function () {
            $.notific8("Data Terhapus", {
              heading: "Info",
              theme: "teal", // teal, amethyst,ruby, tangerine, lemon, lime, ebony, smoke
              life: 2000,
              horizontalEdge: "bottom",
              verticalEdge: "left",
            });
          }, 3000);
          window.location.href = BASE_URL;
        } else {
          App.unblockUI("#add_vehicle_modal");
          window.setTimeout(function () {
            $("#warning_message").show();
            $("#error_message").html(response.message);
          }, 1000);
          return false;
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        App.unblockUI("#add_vehicle_modal");
        window.setTimeout(function () {
          jsonError = jQuery.parseJSON(jqXHR.responseText);
          $("#warning_message").show();
          $("#error_message").html(jsonError.message);
        }, 1000);
        return false;
      },
      beforeSend: function (xhr, settings) {
        xhr.setRequestHeader("Authorization", "Bearer " + USER_TOKEN);
      },
    });
    return false;
  });
}

function newDateWithTimezone(strdate) {
  // 'YYYY-MM-DD HH:MM:SS.ZZZ+TZ'
}
function date_diff(loc_date) {
  var mdate = moment(loc_date);
  var date1 = mdate._d;
  var date2 = new Date();

  // Use Math.abs() so the order of the dates can be ignored and you won't

  var diffInSeconds = Math.abs(date1.getTime() - date2.getTime()) / 1000;
  var days = Math.floor(diffInSeconds / 60 / 60 / 24);
  var hours = Math.floor((diffInSeconds / 60 / 60) % 24);
  var minutes = Math.floor((diffInSeconds / 60) % 60);
  var seconds = Math.floor(diffInSeconds % 60);
  var milliseconds = Math.round(
    (diffInSeconds - Math.floor(diffInSeconds)) * 1000
  );

  if (days > 0) {
    return days + " hari";
  } else if (days < 1 && hours >= 1) {
    return hours + " jam";
  } else if (hours < 1 && minutes >= 1) {
    return minutes + " menit";
  } else {
    return seconds + " detik";
  }
}

function getDiffTime(loc_date) {
  var mdate = moment(loc_date);
  var date1 = mdate._d;
  var date2 = new Date();

  var result = {};
  var diffInSeconds = Math.abs(date1 - date2) / 1000;
  result.days = Math.floor(diffInSeconds / 60 / 60 / 24);
  result.hours = Math.floor((diffInSeconds / 60 / 60) % 24);
  result.minutes = Math.floor((diffInSeconds / 60) % 60);
  result.seconds = Math.floor(diffInSeconds % 60);
  result.milliseconds = Math.round(
    (diffInSeconds - Math.floor(diffInSeconds)) * 1000
  );
  return result;
}

function date_label(loc_date) {
  var mdate = moment(loc_date);
  var date1 = mdate._d;
  var date2 = new Date();

  var diffInSeconds = Math.abs(date1 - date2) / 1000;
  var days = Math.floor(diffInSeconds / 60 / 60 / 24);
  var hours = Math.floor((diffInSeconds / 60 / 60) % 24);
  var minutes = Math.floor((diffInSeconds / 60) % 60);
  var seconds = Math.floor(diffInSeconds % 60);
  var milliseconds = Math.round(
    (diffInSeconds - Math.floor(diffInSeconds)) * 1000
  );

  if (days > 0) {
    return "far2";
  } else if (days < 1 && hours >= 1) {
    return "far3";
  } else if (hours < 1 && minutes >= 1) {
    return "far";
  } else {
    return "far";
  }
}

function status_label(status) {
  if (status === undefined || status === null) {
    return "";
  } else if (status === "yellow") {
    return "icon-spamalt alert2";
  } else if (status === "inactive") {
    return "icon-ban-circle alert4";
  } else if (status === "green") {
    return "icon-spamalt alert3";
  } else if (status === "red") {
    return "icon-spamalt alert1";
  } else {
    return "";
  }
}

function getMinimTime(loc_date) {
  var date1 = new Date(loc_date);
  var date2 = new Date();

  if (minimTime == "") {
    minimTime = loc_date;
  } else {
    var minim = new Date(minimTime);
    var diffInSeconds1 = Math.abs(date1 - date2) / 1000;
    var diffInSeconds2 = Math.abs(minim - date2) / 1000;
    if (diffInSeconds1 < diffInSeconds2) {
      minimTime = loc_date;
    }
  }
}

function zoomVehicle(journeyid) {
  TrackingMap.zoomToVehicle(journeyid);
}

function viewAll() {
  TrackingMap.hideRoute();
  TrackingMap.showVehicles();
}

jQuery(document).ready(function () {
  //   TrackingMap.init();
  // initVehicle();
  // setInterval(function(){
  //   updateTimeInfo()
  // }, 60000);
});

HomeInit = function () {
  TrackingMap.init();
  initVehicle();
  setInterval(function () {
    updateTimeInfo();
  }, 60000);
};
