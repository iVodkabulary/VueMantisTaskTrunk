var authGoogle = false;
import utilsLibrary from '@/services/utils.js'
import Vue from 'vue'
import Hub from '@/events/Hub'

var imported = document.createElement('script');
imported.src = 'https://apis.google.com/js/client.js';
document.head.appendChild(imported);
// import gapi from 'https://apis.google.com/js/client.js'

var clientId = '68497599090-mt66grcb5vqtmh24av0bp5hhnf44h5b7.apps.googleusercontent.com',
  clientSecret = 'tvQqS1mu5NU0xMXYeJKevQM2',
  scopes = 'https://www.googleapis.com/auth/calendar',
  DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  userEmail;
//deferred = new Promise((resolve, reject) =>{}),
Vue.set(Hub.$rootScope, 'authGoogle', false);
Vue.set(Hub.$rootScope, 'firstLoad', true);
const singleRequest = {
  RequestClass: 'xBase',
  RequestAction: 'Request',
  TotalRequests: 1
}

export default {

  initClient(s, e) {
    return Promise((resolve, reject) => {
      var request = singleRequest;
      request.R1_RequestTemplate = 'SettingNew.SearchSetting';
      request.R1_ParentCode = 'xSetting.Default.GoogleSetting';
      utilsLibrary.post(request).then((data) => {
        data = utilsLibrary.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
        $.each(data, (k, value) => {
          if (value.Code === 'clientId') {
            clientId = value.Value;
          }
          if (value.Code === 'clientSecret') {
            clientSecret = value.Value;
          }
        })
        gapi.client.init({
          discoveryDocs: DISCOVERY_DOCS,
          clientId: clientId,
          scope: scopes,
          client_secret: clientSecret,
        }).then(() => {
            var data = gapi.auth2.getAuthInstance();
            data.isSignedIn.listen(this.updateSigninStatus);
            // Handle the initial sign-in state.
            var events = this.updateSigninStatus(data.isSignedIn.get(), s, e);
            resolve(events)
          },
          (error) => {
            console.log(error.details)
            console.log("can not connect google api");
            reject('error')
          });
      })
      //return promise;
    });
  },

  updateSigninStatus(isSignedIn, s, e) {
    var deferredEvent = Promise((resolve, reject) => {
      if (isSignedIn) {
        Vue.set(Hub.$rootScope, 'authGoogle', true);
        // authGoogle = true;
        var events = this.listUpcomingEvents(s, e);
        resolve(events)
      } else {
        Vue.set(Hub.$rootScope, 'authGoogle', false);
        // authGoogle = false;
        reject('error');
      }
    });
    return deferredEvent.promise;
  },
  checkAuth() {

    return new Promise((resolve, reject) => {
      try {
        var request = singleRequest;
        request.R1_RequestTemplate = 'SettingNew.SearchSetting';
        request.R1_ParentCode = 'xSetting.Default.GoogleSetting';
        utilsLibrary.post(request).then((data) => {
          data = utilsLibrary.getDataWithRoot(data.R1, 'Data.DynamicDS.Setting');
          $.each(data, (k, value) => {
            if (value.Code === 'clientId') {
              clientId = value.Value;
            }
            if (value.Code === 'clientSecret') {
              clientSecret = value.Value;
            }
          })
          setTimeout(function () {
            gapi.client.init({
              clientId: clientId,
              scope: scopes,
              discoveryDocs: DISCOVERY_DOCS,
              client_secret: clientSecret,
            }).then((response) => {
                gapi.auth2.getAuthInstance().then((data) => {
                  if (data.isSignedIn.get()) {
                    //console.log('$rootScope', Vue)
                    //Vue.set(Hub.$rootScope, 'authGoogle', true);
                  }
                  console.log('Connected Google');
                  resolve(data.isSignedIn.get())
                });
              },
              (error) => {
                console.log("can not connect google api", error);
                // reject('error');
              })
          }, 1000)

        })
      } catch (ex) {
        console.log(ex);
        console.log("can not connect google api");
        reject('error');
      }
    });
  },
  handleAuthClick(event) {
    return new Promise((resolve, reject) => {
      gapi.auth2.getAuthInstance().signIn().then((googleResponse) => {
          Vue.set(Hub.$rootScope, 'authGoogle', true);
          resolve(googleResponse)
        },
        function (error) {
          Vue.set(Hub.$rootScope, 'authGoogle', false);
          reject('error');
        });
    });
  },
  handleSignoutClick(event) {
    try {
      gapi.client.init({
        clientId: clientId,
        scope: scopes
      }).then((authResult) => {
        gapi.auth2.getAuthInstance().signOut().then(() => {
        });
      })
    } catch (ex) {
      console.log(ex)
    }

  },
  getEvents(startDate, maxDate) {
    return new Promise((resolve, reject) => {
      var request = gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': utilsLibrary.formatDateTime(new Date(startDate), 'YYYY-MM-DDTHH:mm:ss+07:00'),
        'timeMax': utilsLibrary.formatDateTime(new Date(maxDate), 'YYYY-MM-DDTHH:mm:ss+07:00'),
        'singleEvents': true,
        'orderBy': 'startTime',
      })
      request.execute(function (response) {
        if (!response.error) {
          resolve(response.items);
        } else {
          reject('error');
        }
      });
    });
  },

  listUpcomingEvents(startDate, maxDate) {
    return new Promise((resolve, reject) => {
      var data = [];
      var request = gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': utilsLibrary.formatDateTime(new Date(startDate), 'YYYY-MM-DDTHH:mm:ss+07:00'),
        'timeMax': utilsLibrary.formatDateTime(new Date(maxDate), 'YYYY-MM-DDTHH:mm:ss+07:00'),
        'singleEvents': true,
        'orderBy': 'startTime',
      })
      request.execute(function (response) {
        if (!response.error) {
          resolve(response.items);
        } else {
          reject('error');
        }
      });
    });
  },

  insertEvent(event, id) {
    return new Promise((resolve, reject) => {
      gapi.client.load('calendar', 'v3', function () {
        var request = gapi.client.calendar.events.insert({
          'calendarId': id,
          'resource': event
        });
        request.execute(function (res) {
          if (res.status === 'confirmed') {
            resolve(res);
          } else {
            reject('error');
          }
        });
      })
    });
  },
  updateEvent(eventNew) {
    return new Promise((resolve, reject) => {
      gapi.client.load('calendar', 'v3', () => {
        var eventOld = gapi.client.calendar.events.get({"calendarId": 'primary', "eventId": eventNew.id});
        eventOld.execute((res) => {
          if (res.status === 'confirmed') {
            var request = gapi.client.calendar.events.update({
              'calendarId': 'primary',
              'eventId': res.id,
              'resource': eventNew
            })
            request.execute((event) => {
              resolve(event);
            });
          } else {
            reject('error');
          }
        });
      })
    });
  },
  deleteEvent(eventId) {
    return new Promise((resolve, reject) => {
      gapi.client.load('calendar', 'v3', () => {
        var searchEvent = gapi.client.calendar.events.get({"calendarId": 'primary', "eventId": eventId});
        searchEvent.execute((res) => {
          var request = gapi.client.calendar.events.delete({
            'calendarId': 'primary',
            'eventId': eventId,
          })
          request.execute((resp) => {
            resolve(resp);
          })
        })

      })
    });
  },
  searchEventByExtraId(id) {
    return new Promise((resolve, reject) => {
      var request = gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'privateExtendedProperty': ['xTaskId=' + id],
        'singleEvents': true
      });
      request.execute(function (response) {
        if (!response.error) {
          resolve(response.items);
        } else {
          reject('error');
        }
      });
    });

  }
}


