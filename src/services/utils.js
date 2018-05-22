import Vue from "vue"
import VueResource from "vue-resource"
import xml2json from '@/lib/jquery.xml2json.js'
import {
  Loading,
  MessageBox,
  Message,
  Notification
} from "element-ui";
import Lodash from 'lodash'

Vue.use(Loading.directive);
Vue.use(require('vue-moment'));

export default {
  getIOSversion() {
    if(window.MSStream){
      // There is some iOS in Windows Phone...
      // https://msdn.microsoft.com/en-us/library/hh869301(v=vs.85).aspx
      return -1;
    }
    var match = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/),
      version;

    if (match !== undefined && match !== null) {
      version = [
        parseInt(match[1], 10),
        parseInt(match[2], 10),
        parseInt(match[3] || 0, 10)
      ];
      return parseFloat(version.join('.'));
    }

    return -1;
  },
  getViewModelRequest(viewModelData, requestTemplate) {
    var request = {
      RequestClass: 'xBase',
      RequestAction: 'Request',
      TotalRequests: 1
    }
    //var request = Lodash.copy(singleRequest);
    $.each(viewModelData.Fields, (key, field) => {
      request['R' + request.TotalRequests + '_RequestTemplate'] = requestTemplate != null ? requestTemplate : 'Setting.SearchSetting';
      if (field.Default == false) {
        $.each(field.Conditions, (key, value) => {
          request['R' + request.TotalRequests + '_' + key] = value;
        });
      } else {
        $.each((field.Conditions != null ? field.Conditions : viewModelData.Default.Conditions), (key, value) => {
          if (key == 'ParentCode') {
            request['R' + request.TotalRequests + '_' + key] = (field.Prefix != null ? field.Prefix : viewModelData.Default.Prefix != null ? viewModelData.Default.Prefix : '') + (field[value] != null ? field[value] : field.Name);
          } else {
            request['R' + request.TotalRequests + '_' + key] = value;
          }
        });
      }
      request.TotalRequests += 1;
    });
    request.TotalRequests -= 1;
    return request;
  },

  removeVNCharacters(input) {
    var str_rewrite = this.isEmpty(input) ? Lodash.clone(input) : '';
    str_rewrite = str_rewrite.toLowerCase();

    str_rewrite = str_rewrite.replace(/à|ả|ã|á|ạ|ă|ằ|ẳ|ẵ|ắ|ặ|â|ầ|ẩ|ẫ|ấ|ậ/g, 'a');
    str_rewrite = str_rewrite.replace(/è|ẻ|ẽ|é|ẹ|ê|ề|ể|ễ|ế|ệ/g, 'e');
    str_rewrite = str_rewrite.replace(/ì|ỉ|ĩ|í|ị/g, 'i');
    str_rewrite = str_rewrite.replace(/ò|ỏ|õ|ó|ọ|ô|ồ|ổ|ỗ|ố|ộ|ơ|ờ|ở|ỡ|ớ|ợ/g, 'o');
    str_rewrite = str_rewrite.replace(/ù|ủ|ũ|ú|ụ|ư|ừ|ử|ữ|ứ|ự/g, 'u');
    str_rewrite = str_rewrite.replace(/ỳ|ỷ|ỹ|ý/g, 'y');
    str_rewrite = str_rewrite.replace(/đ/g, 'd');
    str_rewrite = str_rewrite.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\'|\&|\#|\[|\]|~/g, '-');
    str_rewrite = str_rewrite.replace(/-+-/g, '-');
    str_rewrite = str_rewrite.replace(/^\-+|\-+$/g, '');
    str_rewrite = str_rewrite.replace(' ', '-');
    return str_rewrite;
  },
  bindScopeModel(scope, dataToPass) {
    scope.action = 'edit';
    scope.model = Lodash.clone(dataToPass.item);
    $.each(scope.model, (key, value) => {
      if (value === 'true')
        scope.model[key] = true;
      else if (value === 'false')
        scope.model[key] = false;
    });
    $.each(scope.viewModel.Data.Fields, (k, field) => {
      var valueMember = field.valueMember != null ? field.valueMember : scope.viewModel.Data.Default.valueMember;
      if (field.Model != null) {
        var arrFieldModels = field.Model.split(';');
        $.each(scope.viewModel[field.Name], (k, viewModel) => {
          $.each(arrFieldModels, (k, model) => {
            if (viewModel[valueMember] === scope.model[model]) {
              scope.model[model] = viewModel;
            }
          });
        });
      } else {
        $.each(scope.viewModel[field.Name], (k, viewModel) => {
          if (this.isEmpty(viewModel) && scope.model[field.Name] === viewModel[valueMember]) {
            scope.model[field.Name] = viewModel;
          }
        });
      }
    });
  },
  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  showMessage(type, message) {
    type = type ? type : 'warning';
    if(navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/iPhone|iPad|iPod/i) ||
      navigator.userAgent.match(/Opera Mini/i) ||
      navigator.userAgent.match(/IEMobile/i)){
      Message({
        message: message,
        type: type
      });
    } else {
      Notification({
        message: message,
        type: type
      });
    }
  },
  showConfirm(title, message, event) {
    return new Promise((resolve, reject) => {
      MessageBox.confirm(message, 'Cảnh báo', {
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Bỏ qua',
        type: 'warning'
      }).then(() => {
        resolve();
      }).catch(() => {
        // reject();
      });
    })
  },
  deleteAttachmentBinary(attachmentId, parentId) {
    var attParams = {
      RequestClass: "xBase",
      RequestAction: "DeleteBinary",
      Id: attachmentId,
      Parent: parentId
    };
    this.post(attParams).then((data) => {
      // callback(data);
    });
  },
  rotateDementionArr(arr, fieldTobeKey) {
    var retObj = {};
    arr.filter(item => {
      retObj[item[fieldTobeKey]] = item;
    })
    return retObj;
  },
  treeify(oriList, key, parentKey, levelKeyNewName) {

    var list = Lodash.clone(oriList);
    var map = {}, node, roots = [], i;
    for (i = 0; i < list.length; i += 1) {
      map[list[i][key]] = i; // initialize the map
      delete list[i].children; // remove children to cleanup the list
      if (levelKeyNewName)
        list[i][levelKeyNewName] = 1;
    }
    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (map[node[parentKey]] !== undefined) {
        // if you have dangling branches check that map[node.parentId] exists
        if (list[map[node[parentKey]]].children == undefined)
          list[map[node[parentKey]]].children = [];
        list[map[node[parentKey]]].children.push(node);
        if (levelKeyNewName)
          node[levelKeyNewName] = list[map[node[parentKey]]][levelKeyNewName] + 1;
      } else {
        //node without parent existed in the list, add to root
        roots.push(node);
      }
    }
    return roots;
  },
  URL() {
    //return '';
    //return 'http://temp.mn.com.vn';
    //return 'http://man-crm.mn.com.vn';
    //return 'http://localhost.shit';
    // return 'http://man-std.mn.com.vn';
    return 'http://man-uat.mn.com.vn';
    // return 'http://man-pre.mn.com.vn';
    // return 'http://projects.mantis.edu.vn';
    //return 'http://localhost:37677';
    // return 'http://crm-erp.mn.com.vn';
  },
  BaseUri() {
    if (this.URL() != '') {
      return this.URL();
    } else {
      return window.location.origin;
    }
  },
  roleEveryoneId() {
    return "a94bae42-4953-f536-26fb-e5503be76321";
  },
  administrator() {
    return "2fc8fae8-bf43-4fdb-8daf-58b73bf2ff36";
  },
  supervisor() {
    return "93dd70fa-290c-4c0c-a9eb-c723c85bacc0";
  },
  manager() {
    return "a2ce6617-54ac-85fe-1e6f-928f1bd14220";
  },
  leader() {
    return "4d7874b2-9bd2-4394-965f-30aaadca6e5c";
  },
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  deleteAutoValue(input) {
    delete input.id;
    delete input.leaf;
    delete input.level;
    delete input.text;
    delete input.uid;
    delete input.expanded;
    delete input.Data;
    delete input.Level;
    delete input.ParentId;
    if (input.cls != undefined) delete input.cls;
    if (input.parent_uid != undefined) delete input.parent_uid;
    if (input.LeftIndex != undefined) delete input.LeftIndex;
    if (input.RightIndex != undefined) delete input.RightIndex;
    if (input['$$hashKey'] != undefined) delete input['$$hashKey'];
    if (input['$$mdSelectId'] != undefined) delete input['$$mdSelectId'];
  },
  /*Chỉ so sánh được 2 Arrays mà các phần tử chỉ là String*/
  equals(obj1, obj2) {
  if (obj1 == null && obj2 == null) {
    return true;
  }
  else if (obj1 === undefined && obj2 === undefined) {
    return true;
  } else if ((typeof obj1) === 'string' && (typeof obj2) === 'string') {
    return obj1 === obj2;
  } else if ((obj1 instanceof Array) && (obj2 instanceof Array) && (obj1.length == obj2.length)) {
    var count = 0;
    $.each(obj1, (k, item) => {
      count++;
      return obj2.indexOf(item) > 0;
    });
    return count -1 == obj1.length;
  } else if ((obj1 instanceof Object) && false === (obj1 instanceof Array)) {
    var res = true;
    $.each(obj1, (k, item) => {
      res = this.equals(obj2[k], item);
      return res;
    });
    return res;
  }
  return false;
},
  // Changes XML to JSON

  showLoading(type, load) {
    switch (type) {
      case 'start':
        const loading = Loading.service({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        return loading
        break;
      case 'stop':
        if (load)
          load.close();
        else
          Loading.service().close();
        break;
      default:
        break;
    }
  },
  jsonParse(data) {
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        return undefined; // error in the above string (in this case, yes)!
      }
    }
  },
  formatNumber(value) {
    let val = (value / 1).toFixed(2).replace(',', '.')
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  },
  dynamicDataFilter(value, setting) {
    setting = setting ? setting : {};
    var format = (value) => {
      let val = (value / 1).toFixed(2).replace(',', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    };
    switch (setting.FieldColumnType) {
      case 'Integer':
        if (value != '' && !isNaN(value)) {
          value = format(parseFloat(value).toFixed(0));
        }
        return value;
        break;
      case 'Double':
        if (value != '' && !isNaN(value)) {
          var formated = false;
          if (setting.FormatValue) {
            var afterDecimal = 0;
            afterDecimal = setting.FormatValue.substring(setting.FormatValue.indexOf('.') + 1, setting.FormatValue.indexOf('f'));
            afterDecimal = afterDecimal == '' ? 0 : afterDecimal;
            value = (value == 0) ? 0 : format(parseFloat(value).toFixed(afterDecimal));
            formated = true;
          }
          if (typeof setting.Format == 'string') {
            setting.Format = setting.Format.replaceAll('{{0', '{{' + setting.Name);
            var object = {};
            object[setting.Name] = value;
            value = this.expressionToString(object, setting.Format);
            formated = true;
          }
          if (!formated) {
            value = format(parseFloat(value).toFixed(0));
          }

        }
        return value;
      case 'DateTime':
        if (!value || value.trim() == '') {
          return value;
        }
        var date = utilsLibrary.stringToDate(value, setting.InputFormat);
        var format;
        if (this.isEmpty(setting.Format)) {
          format = setting.Format;
        }
        return this.formatDateTime(date, format);
        break;
      default:
        return value;
    }
  },
  calculator(exp) {
    try {
      return eval(exp);
    } catch (error) {
      console.error(error);
      return 0;
    }
  },
  sortWithIndexes(toSort, type, number) {
    var sortIndices = [];
    var count = 0;
    number = !isNaN(number) ? number : toSort.length;
    for (var i = 0; i < toSort.length; i++) {
      toSort[i] = [toSort[i], i];
    }
    toSort.sort((left, right) => {
      if (right[0] > left[0]) {
        return type;
      } else if (right[0] < left[0]) {
        return -1 * type;
      }
      return 0;
    });
    toSort.sortIndices = [];
    for (var j = 0; j < toSort.length; j++) {
      if (number) {
        if (count < number) {
          sortIndices.push(toSort[j][1]);
          toSort[j] = toSort[j][0];
          count++;
        } else {
          break;
        }
      } else {
        sortIndices.push(toSort[j][1]);
        toSort[j] = toSort[j][0];
      }
    }
    return sortIndices;
  },
  getDataWithRoot(data, path) {
    if (!path) {
      path = '';
    }
    var arrPath = path.split('.');
    for (var i = 0; i < arrPath.length; i++) {
      if (arrPath[i]) {
        data = Lodash.cloneDeep(data[arrPath[i]]);
        if (data == undefined) {
          data = [];
          break;
        }
      }
    }
    if (!data || JSON.stringify(data) === '{}') {
      return [];
    } else if (Object.prototype.toString.call(data) !== '[object Array]') {
      return [data];
    }
    return data;
  },
  readSettingNode(input, output) {
    /**
     * Create output object if not existed
     */
    if (!this.isEmpty(output)) {
      output = {};
    }

    $.each(input, (key, value) => {
      /**
       * Xóa các phần tử không dùng đến, có khả năng gây lỗi
       */
      // deleteAutoValue(value);
      /**
       * Kiểm tra nếu không có giá trị Description thì lấy toàn bộ giá trị của setting
       * Nếu có giá trị Description thì chỉ lấy giá trị của Description thôi
       */
      output[value.Name] = (!this.isEmpty(value.Description) ? value : value.Description);
      if (this.isEmpty(value.children)) {
        output = this.readSettingNode(value.children, output);
        delete value.children;
      }
    });
    return output;
  },

  isEmpty(params, path, returnData) {
    var object = params;
    if (path && path !== '') {
      var arrPath = path.split('.');
      for (var i = 0; i < arrPath.length; i++) {
        if (object === null || object === undefined) {
          break;
        } else {
          object = object[arrPath[i].trim()];
        }
      }
    }
    if (object === null || object === undefined) {
      return false;
    }
    if (returnData) {
      return object;
    }
    return true;
  },
  getUserInfo(field) {
    if (!field) {
      return localStorage.getItem('LoggedOnUser');
    }
    return localStorage.getItem('LoggedOnUser') && JSON.parse(localStorage.getItem('LoggedOnUser'))[field] ? JSON.parse(localStorage.getItem('LoggedOnUser'))[field] : '';
  },
  expressionToString(item, expression) {
    item = item ? item : {};
    expression = expression ? expression : '';
    var returnExpression = '',
      exp = expression.trim();
    /** kiểm tra cho đến khi replace hết giá trị trong chuỗi */
    while (exp != '') {
      if (exp.indexOf('{{') >= 0 && exp.indexOf('}}') > exp.indexOf('{{')) {
        returnExpression += exp.substr(0, exp.indexOf('{{'));
        var key = exp.substr(exp.indexOf('{{') + 2, exp.indexOf('}}') - exp.indexOf('{{') - 2);
        /** thêm filter dựa vào setting tính từ dấu |, định dạng được xác định bằng dấu : trong chuỗi */
        if (key.indexOf('|') > 0) {
          var name = key.substr(0, key.indexOf('|')).trim(),
            value = this.getDataWithRoot(item, name)[0],
            filter = key.substr(key.indexOf('|') + 1, key.length).split(':'),
            type = filter[0].trim(),
            format = filter[1];
          switch (type) {
            /** trường hợp ngày tháng, lấy giá trị ngày tháng hiện tại với định dạng*/
            case 'DateTime':
              value = this.stringToDate(value);
              switch (format) {
                case 'Age':
                  var ageDate = new Date(Date.now() - value.getTime());
                  returnExpression += Math.abs(ageDate.getUTCFullYear() - 1970);
                  break;
                case 'toNow':
                  // var ageDate = new Date(Date.now() - value.getTime());
                  // returnExpression += Math.abs(ageDate.getUTCFullYear() - 1970);
                  var Now = new Date();
                  var ms = Vue.moment(value).diff(Vue.moment(Now));
                  var d = Vue.moment.duration(ms);
                  var hours = parseInt(d.asHours());
                  var minutes = parseInt(d.asMinutes()) - hours * 60;
                  var date = hours + ":" + Math.abs(minutes) + "<i class='icon icon-clock s20 md-warn-fg'></i>";
                  if (minutes > 0)
                    var date = hours + ":" + Math.abs(minutes) + "<i class='icon icon-clock s20'></i>";
                  returnExpression += date;
                  break;
                case 'toNows':
                  // var ageDate = new Date(Date.now() - value.getTime());
                  // returnExpression += Math.abs(ageDate.getUTCFullYear() - 1970);
                  var Now = new Date();
                  var ms = Vue.moment(value).diff(Vue.moment(Now));
                  var d = Vue.moment.duration(ms);
                  var hours = parseInt(d.asHours());
                  var minutes = parseInt(d.asMinutes()) - hours * 60;
                  var date = hours - Math.abs(minutes) / 60;
                  if (minutes > 0)
                    var date = hours + Math.abs(minutes) / 60;
                  returnExpression += date;
                  break;
                default:
                  if (name == 'Now') {
                    var time = new Date;
                    returnExpression += this.formatDateTime(time, 'DD/MM/YYYY HH:mm:ss');
                  } else
                    returnExpression += this.formatDateTime(value, format);
                  break;
              }
              break;
            case 'UserInfo':
              /** trường hợp lấy thông tin người dùng*/
              returnExpression += this.getUserInfo(name);
              break;
            case 'Number':
              if (value || value == 0) {
                returnExpression += parseFloat(value).toFixed(format);
              }
              break;
            case 'Dynamic':
              var date = new Date();
              if (name == 'StartMonth') {
                returnExpression += this.formatDateTime(new Date(date.getFullYear(), date.getMonth(), 1));
              }
              if (name == 'EndMonth') {
                returnExpression += this.formatDateTime(new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59));
              }
              break;
            default:
              returnExpression += value;
              break;
          }
        } else if (this.isEmpty(item[key])) {
          returnExpression += item[key];
        }
        exp = exp.substr(exp.indexOf('}}') + 2, exp.length);
      } else {
        returnExpression += exp;
        exp = '';
      }
    }
    return returnExpression;
  },
  post(params, ignoreSession, baseUri) {
    let url = baseUri ? baseUri : this.URL() + '/xRequest.ashx';
    return new Promise((resolve, reject) => {
      if (params.TotalRequests != 0) {
        if (!ignoreSession)
          params.SessionId = localStorage.getItem('SessionId');
        if (!baseUri && document.location.protocol == "file:") {
          var storedURI = localStorage.getItem('StoredURI');
          url = storedURI != null ? storedURI : this.URL() + '/xRequest.ashx';
        }
        let headers = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
        var arrDelete = ['id', 'leaf', 'text', 'cls', 'level', 'expanded', 'uid', 'parent_uid', 'LeftIndex', 'RightIndex', 'Data', '$$hashKey'];
        for (var key in arrDelete) {
          if (params.TotalRequests) {
            for (var i = 1; i <= params.TotalRequests; i++) {
              delete params['R' + i + '_' + key];
            }
          } else
            delete params[key];
        }
        Vue.http.post(url, $.param(params), {headers})
          .then(response => {
            resolve(response.data);
          }, (response) => {
            reject('Error!:', response.data);
          });
      }
      // return {};
    })
  },
  postGetExcel(params, ignoreSession, baseUri) {
    return new Promise((resolve, reject) => {
      if (params.TotalRequests != 0) {
        if (!ignoreSession)
          params.SessionId = localStorage.getItem('SessionId');
        let url = baseUri ? baseUri : this.URL() + '/xRequest.ashx';
        if (!baseUri && document.location.protocol == "file:") {
          var storedURI = localStorage.getItem('StoredURI');
          url = storedURI != null ? storedURI : this.URL() + '/xRequest.ashx';
        }

        //var storedURI =  localStorage.getItem('StoredURI');
        //let url = baseUri ? baseUri : storedURI != null ? storedURI : this.URL()+'/xRequest.ashx';
        let headers = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
        var arrDelete = ['id', 'leaf', 'text', 'cls', 'level', 'expanded', 'uid', 'parent_uid', 'LeftIndex', 'RightIndex', 'Data', '$$hashKey'];
        for (var key in arrDelete) {
          if (params.TotalRequests) {
            for (var i = 1; i <= params.TotalRequests; i++) {
              delete params['R' + i + '_' + key];
            }
          } else
            delete params[key];
        }
        var responseType = 'arraybuffer';
        var options = {headers, responseType : 'arraybuffer'};
        Vue.http.post(url,  $.param(params), options)
          .then(response => {
            resolve(response.data);
          }, (response) => {
            reject('Error!:', response.data);
          });
      }
      // return {};
    })
  },
  postCheckResult(params) {
    return new Promise((resolve, reject) => {
      var loading = this.showLoading('start');
      this.post(params).then(result => {
        this.showLoading('stop', loading);
        resolve(result);
      }, () => {
        this.showMessage('error', 'Tải dữ liệu không thành công');
        this.showLoading('stop', loading);
        resolve({});
      })
    });
  },
  login(user, callback) {
    // localStorage.clear();
    var params = {
      RequestClass: "BPM",
      RequestAction: "SignIn",
      HostURL: user.base,
      DeviceType: user.deviceType
    };
    if (user.Username != undefined && user.Username != null) {
      params.Account = user.Username;
      params.Password = user.password;
    } else {
      params.Setting = user;
    }
    if (user.SessionId)
      params.SessionId = user.SessionId;

    if (user.registrationId)
      params.RegistrationID = user.registrationId;

    if (user.deviceId)
      params.DeviceID = user.deviceId;

    // $http({
    //     url: appUri.BaseUri,
    //     method: "POST",
    //     data: $.param(params),
    //     headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    //   })
    this.post(params, true, user.uri)
      .then((data) => {
        if(callback)
        callback(data);
      })
      , (() => {
        if(callback)
      callback(null);
    });
  },

  clearStorage() {
    if (
      window.localStorage.getItem(
        'SaveStatus'
      ) == "true"
    ) {
      var SaveStatus = window.localStorage.getItem(
        'SaveStatus'
      );
      if (
        window.localStorage.getItem(
          'LoginName'
        )
      )
        var LoginName = window.localStorage.getItem(
          'LoginName'
        );
      if (
        window.localStorage.getItem(
          'AppConfig'
        )
      )
        var AppConfig = window.localStorage.getItem(
          'AppConfig'
        );
      if (
        window.localStorage.getItem(
          'Password'
        )
      )
        var Password = window.localStorage.getItem(
          'Password'
        );

      if (
        window.localStorage.getItem(
          'StoredURI'
        )
      )
        var StoredURI = window.localStorage.getItem(
          'StoredURI'
        );
    }
    window.localStorage.clear();
    if (SaveStatus) {
      window.localStorage.setItem(
        'SaveStatus',
        SaveStatus
      );
      if (LoginName)
        window.localStorage.setItem(
          'LoginName',
          LoginName
        );
      if (AppConfig)
        window.localStorage.setItem(
          'AppConfig',
          AppConfig
        );
      if (Password)
        window.localStorage.setItem(
          'Password',
          Password
        );
      if (StoredURI)
        window.localStorage.setItem(
          'StoredURI',
          StoredURI
        );
    }
  },
  logout() {
    var credential = {};
    return new Promise((resolve, reject) => {
      if (localStorage.getItem('LoggedOnUser') && localStorage.getItem('SessionId')) {
        credential.Username = JSON.parse(localStorage.getItem('LoggedOnUser')).LoginName;
        credential.SessionId = localStorage.getItem('SessionId');
        var params = {
          RequestClass: "BPM",
          RequestAction: "SignIn"
         // HostURL: user.base,
          ///DeviceType: user.deviceType
        };
        if (credential.Username != undefined && credential.Username != null) {
          params.Account = credential.Username;
        }
        if (credential.SessionId)
          params.SessionId = credential.SessionId;

        this.post(params).then((data) => {
          this.clearStorage();
          resolve();
        })
      } else {
        this.clearStorage();
        resolve();
      }
    })
  },
  checkSession() {
    let url = this.URL() + '/xRequest.ashx';
    if (document.location.protocol == "file:") {
      var storedURI = localStorage.getItem('StoredURI');
      url = storedURI != null ? storedURI : this.URL() + '/xRequest.ashx';
    }
    //let url = conUrl === '' ? (storedURI != null ? storedURI : this.URL()+'/xRequest.ashx') : this.URL()+'/xRequest.ashx';
    //let url = this.URL()+'/xRequest.ashx';

    let params = {
      RequestAction: "GetUserInformation",
      RequestClass: "BPM",
      SessionId: localStorage.getItem('SessionId')
    };
    return new Promise((resolve, reject) => {
        this.post(params).then(response => {
          if (response.UserDS && response.UserDS.User) {
            resolve({success: true});
          } else {
            resolve({success: false});
          }
        }).catch(() => {
          resolve({success: false});
        });
    })
  },
  encodeHtmlEntities(str) {
    if (!str) {
      return '';
    }
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },
  decodeHtmlEntities(str) {
    if (!str) {
      return '';
    }
    return String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  },
  objectToString(object) {
    var returnString = '';
    $.each(object, (key, val) => {
      if (typeof val != 'object' && typeof val != 'array' && val) {
        returnString += key + '=' + val + '&';
      }
    });
    if (returnString != '') {
      returnString = returnString.substr(0, returnString.length - 1);
    }
    return returnString;
  },
  stringToObject(string, separator, split) {
    if (typeof string != 'string') {
      return {};
    }
    separator = separator ? separator : '&';
    split = split ? split : '=';
    string = this.decodeHtmlEntities(string.trim());
    var returnObject = {},
      arr = string.split(separator);
    $.each(arr, (ks, str) => {
      if (str.indexOf(split) > 0) {
        var keyVal = str.split(split);
        $.each(keyVal, (k, v) => {
          keyVal[k] = v.trim();
        });
        returnObject[keyVal[0]] = keyVal[1];
      }
    });
    return returnObject;
  },
  stringToArray(string, separator) {
    if (!string) {
      return [];
    }
    if (!separator) {
      separator = '!!';
    }
    var returnArray = []; //var objParams
    $.each(string.split(separator), (k, str) => {
      if (str.indexOf('=') > 0) {
        var obj = this.stringToObject(str);
        returnArray.push(obj);
      } else if (str != '') {
        returnArray.push(str);
      }
    });
    return returnArray;
  },
  updateParamsSingleRequest(request, params, index) {
    $.each(params, (key, val) => {
      if (typeof val != 'object' && typeof val != 'array') {
        if (index != null) {
          request['R' + index + '_' + key] = val;
        } else {
          request['R1_' + key] = val;
        }
      }
    });
    return request;
  },
  stringToDate(str, format) {
    if (format) {
      return Vue.moment(str, format).toDate();
    }
    return Vue.moment(str).toDate();
  },
  formatDateTime(dateTime, format) {
    if (!dateTime) {
      dateTime = new Date();
    }
    if (!format) {
      format = "YYYY-MM-DDTHH:mm:ss";
    }
    return Vue.moment(dateTime).format(format);
  },
  dateToString(day) {
    switch (day) {
      case 1:
        return 'Thứ hai';
        break;
      case 2:
        return 'Thứ ba';
        break;
      case 3:
        return 'Thứ tư';
        break;
      case 4:
        return 'Thứ năm';
        break;
      case 5:
        return 'Thứ sáu';
        break;
      case 6:
        return 'Thứ bảy';
        break;
      case 0:
        return 'Chủ nhật';
        break;
      default:
        return '[Không xác định]';
    }
  },
  getListGroup(callback) {
    var paramsOrganization = {
      RequestClass: 'BPM',
      RequestAction: 'SearchGroup',
      RequestDataType: 'json',
      ConditionFields: 'GroupType',
      GroupType: 1,
      StaticFields: 'GroupId;GroupName;Description;GroupParent'
    };
    this.post(paramsOrganization).then((organization) => {
      callback(organization.UserDS.Group);
    }, () => {
      callback([]);
    });
  },
  createTreeFromList(list, idAttr, parentAttr, childrenAttr) {
    idAttr = idAttr ? idAttr : 'Id';
    parentAttr = parentAttr ? parentAttr : 'ParentId';
    childrenAttr = childrenAttr ? childrenAttr : 'children';

    var treeList = [];
    var lookup = {};
    list.forEach(function (obj) {
      if (obj.Name) obj['label'] = obj.Name;
      if (obj.Id) obj['value'] = obj.Id;
      lookup[obj[idAttr]] = obj;
      //obj[childrenAttr] = [];
    });
    var vm = this;
    list.forEach(function (obj) {
      if (vm.isEmpty(obj[parentAttr]) && vm.isEmpty(lookup[obj[parentAttr]])) {
        if (!lookup[obj[parentAttr]][childrenAttr]) lookup[obj[parentAttr]][childrenAttr] = [];
        lookup[obj[parentAttr]][childrenAttr].push(obj);
      } else {
        treeList.push(obj);
      }
    });
    return treeList;
  },
  createdListFromDataTree(tree, result) {
    tree.forEach((value) => {
      var tmpData = Lodash.cloneDeep(value);
      delete(tmpData.children);

      result.push(tmpData);
      if (value.children) {
        this.createdListFromDataTree(value.children, result);
      }
    });

    return result;
  },
  createCustomTreeFromList(list, idAttr, parentAttr, childrenAttr, bindingFields, extendedProperties) {
    idAttr = idAttr ? idAttr : 'Id';
    parentAttr = parentAttr ? parentAttr : 'ParentId';
    childrenAttr = childrenAttr ? childrenAttr : 'children';

    var treeList = [];
    var lookup = {};
    list.forEach(obj => {
      if (bindingFields)
        for (var key in bindingFields) {
          if (obj[key]) obj[bindingFields[key]] = obj[key];
        }
      if (extendedProperties)
        for (var key in extendedProperties) {
          obj[key] = extendedProperties[key];
        }

      //if(obj.Name) obj['label']=obj.Name;
      //if(obj.Id) obj['value']=obj.Id;
      lookup[obj[idAttr]] = obj;
      //obj[childrenAttr] = [];
    });
    //var vm = this;
    list.forEach(obj => {
      if (this.isEmpty(obj[parentAttr]) && this.isEmpty(lookup[obj[parentAttr]])) {
        if (!lookup[obj[parentAttr]][childrenAttr]) lookup[obj[parentAttr]][childrenAttr] = [];
        lookup[obj[parentAttr]][childrenAttr].push(obj);
      } else {
        treeList.push(obj);
      }
    });
    return treeList;
  },
  removeAllLink(listId) {
    /** bắn phân quyền everyone cho trang mới tạo*/
    if (isEmpty(listId) && listId != '' && listId != undefined) {
      var paramsSearchLinked = {
        RequestAction: 'SearchLinked',
        RequestClass: 'Addition',
        ConditionFields: 'Parent;',
        StaticFields: 'Code;Child;Parent;Name;Created;Description',
        OrderFields: 'Created DESC',
        Parent: listId
      };
      postCheckResult(paramsSearchLinked).then(function (result) {
        if (result.TotalCount > 0) {
          var arrLink = result.TotalCount == 1 ? [result.Data.DataDS.Linked] : result.Data.DataDS.Linked;
          var removeLinks = {
            RequestClass: 'xBase',
            RequestAction: 'Request',
            TotalRequests: arrLink.length,
            RequestTemplate: 'Permission.Remove'
          };
          arrLink.forEach(function (key, link) {
            removeLinks['R' + (key + 1) + '_Id'] = link.Id;
            removeLinks['R' + (key + 1) + '_Parent'] = link.Parent;
            removeLinks['R' + (key + 1) + '_Child'] = link.Child;
            removeLinks['R' + (key + 1) + '_Code'] = link.Code;
          });
          /** post request xóa, và gọi lại function tạo phân quyền với count + 1 */
          postCheckResult(removeLinks).then(function () {
          });
        } else {
        }
      });
    }
  },
  removeVNCharacters(input) {
    var str_rewrite = this.isEmpty(input) ? Lodash.cloneDeep(input) : '';
    str_rewrite = str_rewrite.toLowerCase();

    str_rewrite = str_rewrite.replace(/à|ả|ã|á|ạ|ă|ằ|ẳ|ẵ|ắ|ặ|â|ầ|ẩ|ẫ|ấ|ậ/g, 'a');
    str_rewrite = str_rewrite.replace(/è|ẻ|ẽ|é|ẹ|ê|ề|ể|ễ|ế|ệ/g, 'e');
    str_rewrite = str_rewrite.replace(/ì|ỉ|ĩ|í|ị/g, 'i');
    str_rewrite = str_rewrite.replace(/ò|ỏ|õ|ó|ọ|ô|ồ|ổ|ỗ|ố|ộ|ơ|ờ|ở|ỡ|ớ|ợ/g, 'o');
    str_rewrite = str_rewrite.replace(/ù|ủ|ũ|ú|ụ|ư|ừ|ử|ữ|ứ|ự/g, 'u');
    str_rewrite = str_rewrite.replace(/ỳ|ỷ|ỹ|ý/g, 'y');
    str_rewrite = str_rewrite.replace(/đ/g, 'd');
    str_rewrite = str_rewrite.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\'|\&|\#|\[|\]|~/g, '-');
    str_rewrite = str_rewrite.replace(/-+-/g, '-');
    str_rewrite = str_rewrite.replace(/^\-+|\-+$/g, '');
    str_rewrite = str_rewrite.replace(' ', '-');
    return str_rewrite;
  },
  linkToRoleEveryone(arrayObject, UrlRequest, sessionId) {
    /** bắn phân quyền everyone cho trang mới tạo*/
    var request = {
      RequestClass: 'xBase',
      RequestAction: 'Request',
      TotalRequests: 1
    };
    request.TotalRequests = 0;
    if (sessionId)
      request.SessionId = sessionId;
    $.each(arrayObject, (k, object) => {
      request.TotalRequests++;
      var objectLink = {
        RequestClass: 'xBase',
        Parent: object.Id,
        Child: this.roleEveryoneId(),
        Code: 'View',
        Name: (object.Caption ? object.Caption : object.Name) + ' - Everyone',
        RequestAction: 'LinkGroupToObject',
        ParentTable: 'xObject',
        ChildTable: 'tblGroup',
        RequestTemplate: 'Permission.Insert'
      };
      $.each(objectLink, (key, val) => {
        request['R' + request.TotalRequests + '_' + key] = val;
      });
    });
    if (request.TotalRequests > 0) {
      if (UrlRequest)
        this.post(request, true, UrlRequest);
      else
        this.post(request);
    }
  },
  removeAllLink(listId) {
    /** bắn phân quyền everyone cho trang mới tạo*/
    if (this.isEmpty(listId) && listId != '' && listId != undefined) {
      var paramsSearchLinked = {
        RequestAction: 'SearchLinked',
        RequestClass: 'Addition',
        ConditionFields: 'Parent;',
        StaticFields: 'Code;Child;Parent;Name;Created;Description',
        OrderFields: 'Created DESC',
        Parent: listId
      };
      this.postCheckResult(paramsSearchLinked).then((result) => {
        if (result.TotalCount > 0) {
          var arrLink = result.TotalCount == 1 ? [result.Data.DataDS.Linked] : result.Data.DataDS.Linked;
          var removeLinks = {
            RequestClass: 'xBase',
            RequestAction: 'Request',
            TotalRequests: arrLink.length,
            RequestTemplate: 'Permission.Remove'
          };
          $.each(arrLink, (link, key) => {
            removeLinks['R' + (key + 1) + '_Id'] = link.Id;
            removeLinks['R' + (key + 1) + '_Parent'] = link.Parent;
            removeLinks['R' + (key + 1) + '_Child'] = link.Child;
            removeLinks['R' + (key + 1) + '_Code'] = link.Code;
          });
          /** post request xóa, và gọi lại function tạo phân quyền với count + 1 */
          this.postCheckResult(removeLinks).then(() => {
          });
        } else {
        }
      });
    }
  },
  getDateTimeByKey(key, format, dateOption) {
    var firstDayOfWeekCfg = localStorage.getItem('firstDayOfWeekCfg')? parseInt(JSON.parse(localStorage.getItem('firstDayOfWeekCfg')).Value): 1;
    var returnValue = '';
    var date = new Date();
    if (dateOption != undefined) date = dateOption;
    switch (key) {
      case 'DayAgoStart':
        date.setHours(0, 0, 0, 0)
        /*var start = this.formatDateTime(Date.Now, 'YYYY-MM-DDT00:00:00');
        returnValue = this.formatDateTime(new Date(new Date(start).getTime() - 24 * 60 * 60 * 1000), 'YYYY-MM-DDT00:00:00');*/
        /*returnValue = this.formatDateTime(start, format);*/
        returnValue = this.formatDateTime(Vue.moment(date).subtract(1, 'days').toDate(), format);
        break;
      case 'DayAgoEnd':
        date.setHours(23, 59, 59, 999)
        /*var end = this.formatDateTime(Date.Now, 'YYYY-MM-DDT23:59:59');
        returnValue = this.formatDateTime(new Date(new Date(end).getTime() - 24 * 60 * 60 * 1000), 'YYYY-MM-DDT23:59:59');*/
        /*returnValue = this.formatDateTime(date, format);*/
        returnValue = this.formatDateTime(Vue.moment(date).subtract(1, 'days').toDate(), format);
        break;
      case 'DayStart':
        date.setHours(0, 0, 0, 0)
        returnValue = this.formatDateTime(date, format);
        break;
      case 'DayEnd':
        date.setHours(23, 59, 59, 999)
        returnValue = this.formatDateTime(date, format);
        break;
      case 'DayNextStart':
        date.setHours(0, 0, 0, 0)
        returnValue = this.formatDateTime(Vue.moment(date).add(1, 'days').toDate(), format);
        break;
      case 'DayNextEnd':
        date.setHours(23, 59, 59, 999)
        returnValue = this.formatDateTime(Vue.moment(date).add(1, 'days').toDate(), format);
        break;
      case 'WeekAgoStart':
        returnValue = this.formatDateTime(Vue.moment(date).subtract(1, 'weeks').startOf('isoweek').toDate(), format);
        break;
      case 'WeekAgoEnd':
        returnValue = this.formatDateTime(Vue.moment(date).subtract(1, 'weeks').endOf('isoweek').toDate(), format);
        break;
      case 'MonthAgoStart':
        returnValue = this.formatDateTime(new Date(date.getFullYear(), date.getMonth() - 1, 1), format);
        break;
      case 'MonthAgoEnd':
        returnValue = this.formatDateTime(new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59), format);
        break;
      case 'WeekStart':
        returnValue = Vue.moment(date).isoWeekday(firstDayOfWeekCfg).startOf('isoweek');
        returnValue = this.formatDateTime(returnValue.toDate(), format);
        break;
      case 'WeekEnd':
        returnValue = Vue.moment(date).isoWeekday(firstDayOfWeekCfg).endOf('isoweek');
        returnValue = this.formatDateTime(returnValue.toDate(), format);
        break;
      case 'MonthStart':
        returnValue = this.formatDateTime(new Date(date.getFullYear(), date.getMonth(), 1), format);
        break;
      case 'MonthEnd':
        returnValue = this.formatDateTime(new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59), format);
        break;
      case 'WeekNextStart':
        returnValue = Vue.moment(date).add(1, 'weeks').isoWeekday(firstDayOfWeekCfg).startOf('isoweek');
        returnValue = this.formatDateTime(returnValue.toDate(), format);
        break;
      case 'WeekNextEnd':
        returnValue = Vue.moment(date).add(1, 'weeks').isoWeekday(firstDayOfWeekCfg).endOf('isoweek');
        returnValue = this.formatDateTime(returnValue.toDate(), format);
        break;
      case 'MonthNextStart':
        returnValue = this.formatDateTime(new Date(date.getFullYear(), date.getMonth() + 1, 1), format);
        break;
      case 'MonthNextEnd':
        returnValue = this.formatDateTime(new Date(date.getFullYear(), date.getMonth() + 2, 0, 23, 59, 59), format);
        break;
      case 'Week2NextStart':
        returnValue = this.formatDateTime(Vue.moment(date).add(2, 'weeks').isoWeekday(firstDayOfWeekCfg).startOf('isoweek').toDate(), format);
        break;
      case 'Week2NextEnd':
        returnValue = this.formatDateTime(Vue.moment(date).add(2, 'weeks').isoWeekday(firstDayOfWeekCfg).endOf('isoweek').toDate(), format);
        break;
      case 'Month2NextStart':
        returnValue = this.formatDateTime(new Date(date.getFullYear(), date.getMonth() + 2, 1), format);
        break;
      case 'Month2NextEnd':
        returnValue = this.formatDateTime(new Date(date.getFullYear(), date.getMonth() + 3, 0, 23, 59, 59), format);
        break;
      case 'YearStart':
        returnValue = this.formatDateTime(new Date(date.getFullYear(), 0, 1), format);
        break;
      case 'YearEnd':
        returnValue = this.formatDateTime(new Date(date.getFullYear(), 11, 31, 23, 59, 59), format);
        break;
    }
    return returnValue;
  },
  saveSelectModel(scope) {
    scope.viewModel.Data.Fields.forEach((field) => {
      if (field.IsJqueryWidgets == null) {
        var valueMember = field.valueMember != null ? field.valueMember : scope.viewModel.Data.Default.valueMember;
        if (scope.model[field.Name] != undefined && scope.model[field.Name] != '') {
          if (field.Model != null) {
            var arrFieldModels = field.Model.split(';');
            arrFieldModels.forEach((model) => {
              if (scope.model[model] != undefined && scope.model[model] != '') {
                scope.model[model] = scope.model[model][valueMember];
              }
            });
          } else {
            scope.model[field.Name] = scope.model[field.Name][valueMember];
          }
        }
      }
    });
  },
  loadUserInformation(dataLogin, callback) {
    var params = {
      RequestAction: "GetUserInformation",
      RequestClass: "BPM",
      SessionId: dataLogin.Data
    };
    this.postCheckResult(params).then(data => {
      var user = {};
      if (data.UserDS.User) {
        user = data.UserDS.User.length > 0 ? data.UserDS.User[0] : data.UserDS.User;
        localStorage.setItem('UserId', user.UserId)
        var userData = $.xml2json(user.Data, true);
        if (userData.Data[0] && userData.Data[0].Fields[0]) {
          $.each(userData.Data[0].Fields[0].Field, (key, value) => {
            user[value.Code[0].text] = value.Value[0].text;
          });
        }
        var email = this.isEmpty(userData.Data[0].Dynamic[0], "Email") ? userData.Data[0].Dynamic[0].Email[0].text : null;
        if (this.isEmpty(email)) {
          user.Email = email;
        }

        var project = this.isEmpty(userData.Data[0].Dynamic[0], "Project") ? userData.Data[0].Dynamic[0].Project[0].text : null;
        if (this.isEmpty(project)) {
          user.Project = this.jsonParse(project) ? this.jsonParse(project) : {};
        }

        var notification = this.isEmpty(userData.Data[0].Dynamic[0], "Notification") ? userData.Data[0].Dynamic[0].Notification[0].text : null;

        if (this.isEmpty(notification)) {
          user.Notification = notification;
        }

        var filter = this.isEmpty(userData.Data[0].Dynamic[0], "Filter") ? userData.Data[0].Dynamic[0].Filter[0].text : null;

        if (this.isEmpty(filter)) {
          // setItemLocalStorage(localStorageConstant.FilterData, filter);
          localStorage.setItem('FilterData', filter)

        }

        var currentlist = this.isEmpty(userData.Data[0].Dynamic[0], "CurrentList") ? userData.Data[0].Dynamic[0].CurrentList[0].text : null;

        if (this.isEmpty(currentlist)) {
          user.CurrentList = currentlist;

        }
        try {
          var avatar = this.isEmpty(userData.Data[0].Dynamic[0], "Avatar") ? userData.Data[0].Dynamic[0].Avatar[0].text : null;

          if (this.isEmpty(avatar)) {
            user.Avatar = avatar;
          } else {
            user.Avatar = "assets/images/avatars/profile.png";
          }

        } catch (e) {
          user.Avatar = "assets/images/avatars/profile.png";
        }
        user.Roles = [];
        user.Groups = [];
        if (data.UserDS.Group != undefined) {
          var arrGroup = data.UserDS.Group.length > 0 ? data.UserDS.Group : [data.UserDS.Group];
          for (var i = 0; i < arrGroup.length; i++) {
            switch (arrGroup[i].GroupType) {
              case "0":
                user.Roles.push(arrGroup[i]);
                break;
              case "1":
                user.Groups.push(arrGroup[i]);
                break;
              case "2":
                user.Groups.push(arrGroup[i]);
                break;
            }
          }
        }
        var request = {
          RequestClass: 'xBase',
          RequestAction: 'Request',
          TotalRequests: 1
        };
        request.R1_RequestTemplate = 'Setting.SearchBase';
        request.R1_ParentCode = "xSetting.Project.Tools.Callcenter";
        // request.R1_Keyword = user.UserId;
        request.R1_IncludedNestedSetParent = true;
        this.post(request).then(Extdata => {
          Extdata = this.getDataWithRoot(Extdata.R1, 'Data.DynamicDS.Setting');
          // if(this.isEmpty(Extdata, '0')){
          //   user.Wsserver = Extdata[0].Value;
          //   user.Server = Extdata[0].Caption;
          //   user.ApiKey = Extdata[0].DynamicText;
          //   user.ApiSecret = Extdata[0].NodeType;
          // }
          $.each(Extdata, (key, value) => {
            if (key != 0 && value.DynamicText == user.UserId) {
              user.Wsserver = Extdata[0].Value;
              user.Server = Extdata[0].Caption;
              user.ApiKey = Extdata[0].DynamicText;
              user.ApiSecret = Extdata[0].NodeType;
              user.Extension = Extdata[key].Name;
              user.IsCallTo = Extdata[key].NodeType;
              user.ExtensionPassword = Extdata[key].Value
              // setItemLocalStorage(localStorageConstant.LoggedOnUser, JSON.stringify(user));
              localStorage.setItem('LoggedOnUser', JSON.stringify(user))
            }
          })
        })
        var singleRequest = {
          RequestClass: 'xBase',
          RequestAction: 'Request',
          TotalRequests: 1
        }
        var request = Lodash.clone(singleRequest);
        request.R1_RequestTemplate = 'Setting.SearchBase';
        request.R1_ParentCode = 'xSetting.Default.AppInfo';
        this.post(request).then(data => {
          var ListSetting = this.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          var objSetting = {};
          $.each(ListSetting, (k, val) => {
            objSetting[val.Name] = val.Value
          })
          if (this.isEmpty(objSetting)) {
            // setItemLocalStorage(localStorageConstant.Notification, JSON.stringify(objSetting));
            localStorage.setItem('Notification', JSON.stringify(objSetting))
          }
        });
        //lưu thông tin người dùng
        // if (dataLogin.Extension != undefined && dataLogin.Extension != null) {
        //   user.PhoneId = dataLogin.Extension;
        //   var params = {
        //     RequestClass: 'BPM',
        //     RequestAction: 'UpdateUser',
        //     StructFields: "PhoneId",
        //     SessionId: dataLogin.Data,
        //     UserId: user.UserId,
        //     PhoneId: dataLogin.Extension,
        //     ConditionFields: 'UserId'
        //   };
        //   post(params).success(function () {
        //   });
        // }
        // setItemLocalStorage(localStorageConstant.SessionId, dataLogin.Data);
        localStorage.setItem('SessionId', dataLogin.Data)
        // var groupInfo = JSON.parse(user.Description);
        // user.GroupLevel1 = isEmpty(groupInfo, 'GroupLevel1') ? groupInfo.GroupLevel1[0].Value : '';
        // user.GroupLevel1Name = isEmpty(groupInfo, 'GroupLevel1') ? groupInfo.GroupLevel1[0].Caption : '';
        // user.GroupLevel2 = isEmpty(groupInfo, 'GroupLevel2') ? groupInfo.GroupLevel2[0].Value : '';
        // user.GroupLevel2Name = isEmpty(groupInfo, 'GroupLevel2') ? groupInfo.GroupLevel2[0].Caption : '';
        // user.Accountable = groupInfo.Accountable;
        // user.Control = groupInfo.Control;
        // setItemLocalStorage(localStorageConstant.LoggedOnUser, JSON.stringify(user));
        localStorage.setItem('LoggedOnUser', JSON.stringify(user))
        // $rootScope.loggedOnUser = user;
        if(callback)
        callback(user);
      } else {
        if(callback)
        callback();
      }
    });
  },

  getUserFromGroupWithRole(grpCode, role) {
    return new Promise((resolve, reject) => {
      // if(isEmpty(grpCode) && grpCode!= ''){
      var parameter = {
        RequestAction: 'SearchUsers',
        // IncludedGroupManager: true,
        IncludedGroup: true,
        RequestClass: 'BPM',
        GroupId: grpCode,
        StaticFields: 'UserId;Username;Status',
        OrderFields: 'LoginName ASC',
        Status: 1,
        Role: role,
        ConditionFields: 'GroupId;Role;IncludedGroup;Status'
      };
      this.post(parameter).then((listUser) => {
        resolve(this.getDataWithRoot(listUser, 'Data.UserDS.User'));
      }, () => {
        resolve([]);
      });
      // } else {
      //   resolve([]);
      // }
    });
  },

  /**
   * lấy danh sách người dùng trong tổ chức với role tương ứng, trả về danh sách người dùng với quyền của họ,
   * với mỗi quyền sẽ tìm kiếm danh sách người dùng 1 lần, sau đó thêm vào dãy kết quả trả về
   *
   * @param {String} grpCode: chuỗi các Id của các đội nhóm cần tìm
   * @param roleArray: danh sách các quyền cần tìm
   */
  getUserFromGroupAndListRole(grpCode, roleArray) {
    return new Promise((resolve, reject) => {
      var count = 0,
        listResult = [];
      /** lấy danh sách các quyền trong hệ thống, với mỗi quyền trong roleArray sẽ so sánh tên để lấy ra id tương ứng của role đó*/
      roleArray.forEach((roleId) => {
        var key = Lodash.cloneDeep(roleId);
        /** lấy ra danh sách người dùng từ group theo role*/
        this.getUserFromGroupWithRole(grpCode, roleId).then((listUser) => {
          count++;
          listUser.forEach((user) => {
            user.RoleId = key;
            listResult.push(user);
          });
          if (count == roleArray.length) {
            resolve(listResult);
          }
        });
      });
    });
  },

}
