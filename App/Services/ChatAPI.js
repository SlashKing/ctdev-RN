import ReconnectingWebSocket from 'reconnecting-websocket';
import ChatActions from '../Redux/ChatRedux';
import _ from 'lodash';


const receiveSocketMessage = (store, action) => {
  /*
	 * We cheat by using the Redux-style Actions as our communication protocol
	 * with the server. This hack allows the server to directly act as a Action
	 * Creator, which we simply `dispatch()`. Consider separating communication
	 * format from client-side action API.
	 */
  switch (action.type) {
    // TODO Single Message Notification
    /*
	 * case ActionTypes.RECEIVE_MESSAGE: if ('Notification' in window) {
	 * Notification.requestPermission().then(function(permission) { if
	 * (permission === 'granted') { const n = new Notification(message.room, {
	 * body: message.content, }); n.onclick(function(event){ //
	 * event.preventDefault(); // open the room that contains this message });
	 * setTimeout(n.close.bind(n), 3000); } }); ... continue to dispatch()
	 */
    case ChatActions.RECEIVE_ROOMS:
    case ChatActions.RECEIVE_MESSAGES:
    default:
      return store.dispatch(action);
  }
};

const reconnect = (state) => {
  // Re-login (need user on channel_session)
  if(state.login.currentUser !== null){
	  //console.log('reconnecting to chat service api')
    ChatAPI.send({type:"CHAT_LOGIN", user: state.login.currentUser.username})
  }
  // TODO Delay the REQUEST_MESSAGES until after the LOGIN returns
  // Ensure we did not miss any messages
  //const lastMessage = _.maxBy(state.chat.messages, (m) => m.id);
  //ChatAPI.send({
  //  type: ChatActions.REQUEST_MESSAGES,
  //  lastMessageId: state.chat.messages.length === 0 ? 0 : lastMessage.id,
  //  user: state.globalfeed.user.username,
  //});
};


// TODO Consider re-implementing ChatAPI as a class, instead of using a
// module-level global
// FIXME on error / reconnect
let _socket = null;
let _connected = false;
let _store = null;
export const ChatAPI = {
  checkConnection: () =>{
    return _connected;
  },
  connect: (token) => {
    const scheme = 'ws';
    // TODO: revisit this when/if WebSocket supports Authorization Headers. Currently passing in querystring
    // TODO: custom encoding before transmission, decode on server-side
    console.log(token, _socket)
    _socket !== null && _socket.close(1000,'new connection',{keepClosed: true, fastClose: true})
    const url = `${scheme}://192.168.0.13:8000/?token=${token}`;
    _socket = new ReconnectingWebSocket(url, ['chat'], {debug: true, reconnectInterval: 1000});
  },
  getStore: () => {
    return _store
  },
  setStore: (store) => {
    _store = store
  },
  listen: (store) => {

	  _socket.onmessage = (event) => {
	        const action = JSON.parse(event.data);
	        receiveSocketMessage(store, action);
	      };

	      // reconnect(state)
	      _socket.onopen = () => {
	      console.log(store)
	    	  _store = store.getState()
	        if (_store.login.currentUser !== null) {
	          //console.log('logging into chat service api')
	          reconnect(_store);
	        };
	      };
	      _socket.onerror = () => {
	    	  reconnect(store.getState());
	      }
  },
  close: () => {_socket.close();},

  send: (action) => {
	  if(_socket.readyState ===1){
		  _socket.send(JSON.stringify(action));
	  };
  },
};

// const api = new ChatAPI();
// export default ChatAPI;
