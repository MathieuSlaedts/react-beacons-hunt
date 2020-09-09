import {createContext} from 'react'
const myContext = createContext({
    user: {},
    rUrl: {
        dev: 'http://localhost:1337/',
        prod: 'https://shielded-river-50283.herokuapp.com/',
    },
    env: 'prod'
});
export default myContext;