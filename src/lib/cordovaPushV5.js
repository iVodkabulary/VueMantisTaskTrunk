import $hub from "@/events/Hub.js"
export default {
  initialize: (options) => {
    var q = new Promise((resolve, reject) => {
      $hub.push = PushNotification.init(options);
      resolve($hub.push)
    }) //$q.defer();
    //push = PushNotification.init(options);
    //q.resolve(push);
    return q;
  },
  onNotification: () => {
    setTimeout(() => {
      $hub.push.on('notification', (notification) => {
        $hub.$emit('$cordovaPushV5:notificationReceived', notification);
      });
    });
  },
  onError: () => {
    setTimeout(() => {
      $hub.push.on('error', (error) => { $hub.$emit('$cordovaPushV5:errorOccurred', error); });
    });
  },
  register: () => {
    var q = new Promise((resolve, reject) => {
      if ($hub.push === undefined) {
        reject(new Error('init must be called before any other operation'));
      } else {
        $hub.push.on('registration', (data) => {
          resolve(data.registrationId);
        });
      }
    })
    return q;
  },
  unregister: () => {
    var q = new Promise((resolve, reject) => {
      if ($hub.push === undefined) {
        reject(new Error('init must be called before any other operation'));
      } else {
        $hub.push.unregister((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        });
      }
    })
    return q;
  },
  getBadgeNumber: () => {
    var q = new Promise((resolve, reject) => {
      if ($hub.push === undefined) {
        reject(new Error('init must be called before any other operation'));
      } else {
        $hub.push.getApplicationIconBadgeNumber((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        });
      }
    })
    return q;
  },
  setBadgeNumber: (number) => {
    var q = new Promise((resolve, reject) => {
      if ($hub.push === undefined) {
        reject(new Error('init must be called before any other operation'));
      } else {
        $hub.push.setApplicationIconBadgeNumber((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        }, number);
      }
    })
    return q;
  },
  finish: () => {
    var q = new Promise((resolve, reject) => {
      if ($hub.push === undefined) {
        reject(new Error('init must be called before any other operation'));
      } else {
        $hub.push.finish((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        });
      }
    })
    return q;
  }
}
