import {createContext} from "react";
const context = createContext({

  // User infos
  user: {},

  // Axios request URLs
  requestURL: {
    dev: "http://localhost:1337/",
    prod: "https://shielded-river-50283.herokuapp.com/"
  },

  // Environment mode
  ENV: "prod",

  // Test prail - dev purpose
  ENV_DEV: {
    trail: {
      trail_id: "ivm0lbv8g6v",
      name: "Parcours de test (dev)",
      beacons: [
        {
          lat: 50.82364238904407,
          lng: 4.382519647479058,
          beacon_id: "5ju4macoinu"
        }, {
          lat: 50.823045964581446,
          lng: 4.383442327380181,
          beacon_id: "ii73k2rg3sj"
        }
      ]
    }

  // end of props
  }
});
export default context;