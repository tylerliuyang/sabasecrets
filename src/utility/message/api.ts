
import { MessageType } from '@privacyresearch/libsignal-protocol-typescript'
// import { setSignalWebsocket, setWebsocketSubscription, signalWebsocket } from '@app/network/websocket'

// import { processPreKeyMessage, processRegularMessage } from '@app/messages/functions'
// import { isSendWebSocketMessage, SendWebSocketMessage, WebSocketMessage } from '@app/network/types'

// export function sendSignalProtocolMessage(to: string, from: string, message: MessageType): void {
//     const wsm: SendWebSocketMessage = {
//         action: 'sendMessage',
//         address: to,
//         from,
//         message: JSON.stringify(message),
//     }
//     console.log('sending message to websocket', { wsm })
//     signalWebsocket.next(wsm)
// }

export const sendMessage = (to: string, message: string) => {
    fetch('/api/messages/storeMessage', {
        method: "POST",
        body: JSON.stringify({ address: to, message: message })
    })
}

export const getMessages = (address: string) => {
    return fetch('/api/messages/getMessages', {
        method: "POST",
        body: JSON.stringify({ address: address })
    })
}
