<!-- xlsx.js (C) 2013-present  SheetJS -- http://sheetjs.com -->
<template>
  <div>
    <div @drop="_drop" @dragenter="_suppress" @dragover="_suppress">
      <form class="form-inline">
        <div class="form-group">
          <label for="file">Chọn file</label>
          <input type="file" class="form-control" id="file" :accept="SheetJSFT" @change="_change"/>
        </div>
      </form>
    </div>
    <div class="row">
      <el-button v-show="isShowDataSheetTbl" @click="isShowSheetTbl=true;isShowDataSheetTbl = false">Quay lại</el-button>
      <!--<button :disabled="data.length ? false : true" class="btn btn-success" @click="_export">Export</button>-->
    </div>
    <div>
      <el-table v-show="isShowSheetTbl" :data="model.listSheets" border style="width: 100%">
        <el-table-column type="index" width="50">
        </el-table-column>

        <el-table-column prop="Name" label="Tên Sheet">
        </el-table-column>
        <el-table-column label="Số lượng">
          <template slot-scope="scope">{{scope.row.Rows.length}}</template>
        </el-table-column>
        <el-table-column label="Trạng thái import">
          <template slot-scope="scope">
            {{scope.isImported==true?'Đã import': 'Chưa import'}}
          </template>
        </el-table-column>
        <el-table-column width="180" label="Hành động">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" @click="executeSheet($event,'edit',scope.row,scope.$index)"></el-button>
             <!--
            <el-button icon="icon-eye" @click="showPreview(scope.row)"></el-button>
            -->
          </template>
        </el-table-column>
      </el-table>
      <!--
      <div v-show="isShowDataSheetTbl" id="htmlPreview">
      </div>
      -->
    </div>
  </div>
</template>

<script>
import ImportForm from "@/components/static/advance/ImportForm";
const _XLSX = require("xlsx");
const X = typeof XLSX !== "undefined" ? XLSX : _XLSX;
const make_cols = refstr =>
  Array(X.utils.decode_range(refstr).e.c + 1)
    .fill(0)
    .map((x, i) => ({
      name: X.utils.encode_col(i),
      key: i
    }));
/* see Browser download file example in docs */
function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

export default {
  components: {ImportForm},
  data() {
    return {
      data: ["SheetJS".split(""), "1234567".split("")],
      isShowSheetTbl: true,
      isShowDataSheetTbl: false,
      SheetJSFT: [
        "xlsx",
        "xlsb",
        "xlsm",
        "xls",
        "xml",
        "csv",
        "txt",
        "ods",
        "fods",
        "uos",
        "sylk",
        "dif",
        "dbf",
        "prn",
        "qpw",
        "123",
        "wb*",
        "wq*",
        "html",
        "htm"
      ]
        .map(x => {
          return "." + x;
        })
        .join(","),
      fileReader: {},
      sheets: [],
      openedSheetData: [],
      communication: { action: "", item: {}, index: "", scope: this },
      model: { listSheets: [] }
    };
  },
  mounted() {
    // console.log(XW);
  },
  methods: {
    _suppress(evt) {
      evt.stopPropagation();
      evt.preventDefault();
    },
    _drop(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      const files = evt.dataTransfer.files;
      if (files && files[0]) this._file(files[0]);
    },
    _change(evt) {
      const files = evt.target.files;
      if (files && files[0]) this._file(files[0]);
    },
    _export(evt) {
      /* convert state to workbook */
      const ws = X.utils.aoa_to_sheet(this.data);
      const wb = X.utils.book_new();
      X.utils.book_append_sheet(wb, ws, "SheetJS");
      /* generate X file */
      const wbout = X.write(wb, { type: "binary", bookType: "xlsx" });
      /* send to client */
      saveAs(
        new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
        "sheetjs.xlsx"
      );
    },
    _file(file) {
      var ctrl = this;
      const reader = new FileReader();
      reader.onload = e => {
        ctrl.model.listSheets = [];
        /* Parse data */
        const bstr = e.target.result;
        ctrl.fileReader = X.read(bstr, { type: "binary" });
        ctrl.fileReader.SheetNames.forEach(item => {
          var roa = X.utils.sheet_to_row_object_array(
            ctrl.fileReader.Sheets[item]
          );
          if (roa != undefined) {
            if (roa.Rows.length > 0) {
              roa.Name = item;
              roa.isImported = false;
              ctrl.model.listSheets.push(roa);
            }
          }
        });
      };
      reader.readAsBinaryString(file);
    },
    showPreview(sheet) {
      var ctrl = this;
      ctrl.isShowSheetTbl = false;
      ctrl.isShowDataSheetTbl = true;
      // to_html
      var HTMLOUT = document.getElementById("htmlPreview");
      var htmlstr = X.write(ctrl.fileReader, {
        sheet: sheet.sheetName,
        type: "binary",
        bookType: "html"
      });
      HTMLOUT.innerHTML += htmlstr;
    },
    executeSheet(ev, action, item, index) {
      var ctrl = this;
      ctrl.communication.action = action;
      ctrl.communication.scope = ctrl;
      if (action == "edit") {
        ctrl.communication.item = item;
        ctrl.communication.index = index;
      }
      this.$hub.$emit(
        "set-modal-data",
        "Import exel",
        "60%",
        true,
        "center",
        ImportForm,
        true,
        "",
        ctrl.communication,
        false
      );
    },
    fixdata(data) {
      var o = "",
        l = 0,
        w = 10240;
      for (; l < data.byteLength / w; ++l)
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        );
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    },
    ab2str(data) {
      var o = "",
        l = 0,
        w = 10240;
      for (; l < data.byteLength / w; ++l)
        o += String.fromCharCode.apply(
          null,
          new Uint16Array(data.slice(l * w, l * w + w))
        );
      o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w)));
      return o;
    },
    s2ab(s) {
      var b = new ArrayBuffer(s.length * 2),
        v = new Uint16Array(b);
      for (var i = 0; i != s.length; ++i) v[i] = s.charCodeAt(i);
      return [v, b];
    },
    xw_noxfer(data, cb) {
      var worker = new Worker(XW.noxfer);
      worker.onmessage = function(e) {
        switch (e.data.t) {
          case "ready":
            break;
          case "e":
            console.error(e.data.d);
            break;
          case XW.msg:
            cb(JSON.parse(e.data.d));
            break;
        }
      };
      var arr = rABS ? data : btoa(fixdata(data));
      worker.postMessage({ d: arr, b: rABS });
    },
    xw_xfer(data, cb) {
      var worker = new Worker(rABS ? XW.rABS : XW.norABS);
      worker.onmessage = function(e) {
        switch (e.data.t) {
          case "ready":
            break;
          case "e":
            console.error(e.data.d);
            break;
          default:
            xx = ab2str(e.data)
              .replace(/\n/g, "\\n")
              .replace(/\r/g, "\\r");
            cb(JSON.parse(xx));
            break;
        }
      };
      if (rABS) {
        var val = s2ab(data);
        worker.postMessage(val[1], [val[1]]);
      } else {
        worker.postMessage(data, [data]);
      }
    },
    xw(data, cb) {
      transferable = document.getElementsByName("xferable")[0].checked;
      if (transferable) xw_xfer(data, cb);
      else xw_noxfer(data, cb);
    },
    to_json(workbook) {
      workbook.SheetNames.forEach(function(sheetName) {
        var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        if (roa.Rows != undefined) {
          if (roa.Rows.length > 0) {
            roa.Name = sheetName;
            roa.isImported = false;
            ctrl.model.listSheets.push(roa);
          }
        }
      });
    },
    process_wb(wb) {
      $timeout(function() {
        to_json(wb);
      });
    },
    handleFile(e) {
      rABS = document.getElementsByName("userabs")[0].checked;
      use_worker = document.getElementsByName("useworker")[0].checked;
      var files = e.target.files;
      var f = files[0];
      {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function(e) {
          ctrl.model = { listSheets: [], listData: {} };
          var data = e.target.result;
          if (use_worker) {
            xw(data, process_wb);
          } else {
            var wb;
            if (rABS) {
              wb = X.read(data, { type: "binary" });
            } else {
              var arr = fixdata(data);
              wb = X.read(btoa(arr), { type: "base64" });
            }
            process_wb(wb);
          }
        };
        if (rABS) reader.readAsBinaryString(f);
        else reader.readAsArrayBuffer(f);
      }
    },

    init() {
      ctrl.dtOptions = {
        paging: false,
        searching: false,
        autoWidth: false,
        showNEntries: false,
        responsive: true
      };
      ctrl.communication = { action: "", item: {}, index: "", scope: ctrl };
      ctrl.model = { listSheets: [] };
      var xlf = document.getElementById("xlf");
      if (xlf.addEventListener)
        xlf.addEventListener("change", handleFile, false);
    }
  }
};
</script>
