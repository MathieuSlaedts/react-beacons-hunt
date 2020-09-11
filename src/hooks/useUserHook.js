import { useContext } from 'react';
import Context from '../contexts/Context.js';

// If user is not in Context -> Redirect to home
// else -> Set user & role
function useUserHook() {
    
    const { context } = useContext(Context);
    let user = null;
    let role = null;
  
    if( context.user.name === undefined || context.user.role === undefined ) {
        window.location.href = '/';
        // user = 'dev';
        // role = 'player';
    } else {
        user = context.user.name;
        role = context.user.role;
    }

   return { user, role };
}
export default useUserHook;