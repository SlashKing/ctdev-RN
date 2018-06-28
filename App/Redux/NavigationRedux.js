import AppNavigation from '../Navigation/AppNavigation'

export const reducer = (state, action) => {
  let newState = AppNavigation.router.getStateForAction(action, state)
  if (action.params && action.params.backRoute) {
    let drawerIndex = newState.routes[0].routes[0].index
    let currentStack = newState.routes[0].routes[0].routes[drawerIndex]
    let currentStackIndex = currentStack.index

    // hack*** TODO: revisit when nested stack(drawerNavigator) is not so buggy
    // get the current stack and index from the drawer navigator
    // navigate to new screen and remove current and previous screen from
    // the appropriate stack's routes then reverse the index by 2.
    // this allows us to pass new parameters when going back to the current screen

    currentStack.routes.splice(currentStackIndex-2, 2)
    currentStack.index-=2
    console.log(currentStack)
  }
  return newState || state
}
