// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
      "project_info": {
        "project_number": "1078180605683",
        "firebase_url": "https://recipe-32d20-default-rtdb.firebaseio.com",
        "project_id": "recipe-32d20",
        "storage_bucket": "recipe-32d20.firebasestorage.app"
      },
      "client": [
        {
          "client_info": {
            "mobilesdk_app_id": "1:1078180605683:android:90d41d4174b2db8f499186",
            "android_client_info": {
              "package_name": "com.recipe"
            }
          },
          "oauth_client": [],
          "api_key": [
            {
              "current_key": "AIzaSyBDRTsmi1wi5okX4wqV5fR2iJfLdJZxlyg"
            }
          ],
          "services": {
            "appinvite_service": {
              "other_platform_oauth_client": []
            }
          }
        }
      ],
      "configuration_version": "1"
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
