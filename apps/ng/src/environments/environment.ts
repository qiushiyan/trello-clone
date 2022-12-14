// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const baseUrl = 'http://localhost:8080';
const apiBaseUrl = `${baseUrl}/api`;

export const environment = {
  production: false,
  api: {
    baseUrl: apiBaseUrl,
    socketio: baseUrl,
    auth: {
      currentUserUrl: `${apiBaseUrl}/users/me`,
      loginUrl: `${apiBaseUrl}/users/login`,
      registerUrl: `${apiBaseUrl}/users/new`,
      isEmailExistsUrl: `${apiBaseUrl}/users/email-exists`,
    },
    boards: {
      getBoardsUrl: `${apiBaseUrl}/boards`,
      createBoardUrl: `${apiBaseUrl}/boards/new`,
    },
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
