import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { accessToken, clientId } from './utils/localStorageUtils'

const SOCKET_URL = import.meta.env.VITE_API_URL + '/ws'

const header = {
    authorization: accessToken.get() ?? '',
    'x-client-id': clientId.get() ?? '',
}

export type ChatPayload = {
    id: string
    senderId: string
    receiverId: string
    message: string
    type: 'TEXT' | 'IMAGE' | 'FILE'
    isRead: boolean
    createdAt: string
    error?: string
}

type ChatRequest = {
    message: string
    senderId: string
    receiverId: string
}

class SocketService {
    private static instance: SocketService
    private client: Stomp.Client
    private subscribers: Map<string, Set<(message: ChatPayload) => void>> = new Map()
    private onConnectCallbacks: (() => void)[] = []
    private onDisconnectCallbacks: (() => void)[] = []
    private reconnectDelay = 5000 // 5 seconds

    private constructor() {
        const sockJS = new SockJS(SOCKET_URL)

        this.client = Stomp.over(sockJS)

        sockJS.onclose = () => {
            console.warn('WebSocket connection closed, trying to reconnect...')
            this.onDisconnectCallbacks.forEach((callback) => callback())
            setTimeout(() => this.connect(), this.reconnectDelay)
        }
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new SocketService()
        }
        return this.instance
    }

    public connect() {
        if (!this.client.connected) {
            this.client.connect(
                header,
                () => {
                    console.log('Connected to WebSocket')

                    this.onConnectCallbacks.forEach((callback) => callback())
                    this.subscribers.forEach((callbacks, destination) => {
                        this.client.subscribe(destination, (message) => {
                            console.log(`Received message on ${destination}:`, message)
                            callbacks.forEach((callback) => callback(JSON.parse(message.body)))
                        })
                    })
                },
                (error) => {
                    console.error('Failed to connect to WebSocket', error)
                }
            )
        }
    }

    public disconnect() {
        if (this.client && this.client.connected) {
            this.client.disconnect(() => {
                console.log('Disconnected from WebSocket')
                this.onDisconnectCallbacks.forEach((callback) => callback())
            })
        } else {
            console.warn('WebSocket is not connected')
        }
    }

    public sendMessage(destination: string, body: ChatRequest) {
        if (this.client.connected) {
            this.client.send(destination, {}, JSON.stringify(body))
        } else {
            console.error('WebSocket is not connected')
        }
    }

    public pingUser(userId: string, type: 'online' | 'offline' = 'online') {
        if (this.client.connected) {
            this.client.send(`/app/${type}`, {}, userId)
        } else {
            console.error('WebSocket is not connected')
        }
    }

    public subscribe(
        destination: string,
        callback: (message: ChatPayload) => void,
        callbackFail?: (error: string) => void
    ) {
        if (!this.subscribers.has(destination)) {
            this.subscribers.set(destination, new Set())
        }
        const callbacks = this.subscribers.get(destination)!
        callbacks.add(callback)

        if (this.client.connected) {
            this.client.subscribe(destination, (message) => {
                console.log(`Received message on ${destination}:`, message)
                if (message.body.includes('error')) {
                    callbackFail && callbackFail(message.body)
                }
                callbacks.forEach((cb) => cb(JSON.parse(message.body)))
            })
        } else {
            console.warn(`Not connected. Cannot subscribe to ${destination}.`)
        }
    }

    public unsubscribe(destination: string) {
        if (this.subscribers.has(destination)) {
            this.client.unsubscribe(destination)
            this.subscribers.delete(destination)
        }
    }

    public removeCallback(destination: string, callback: (message: ChatPayload) => void) {
        if (this.subscribers.has(destination)) {
            const callbacks = this.subscribers.get(destination)!
            callbacks.delete(callback)
            if (callbacks.size === 0) {
                this.unsubscribe(destination)
            }
        }
    }

    public onConnect(callback: () => void) {
        this.onConnectCallbacks.push(callback)
    }

    public onDisconnect(callback: () => void) {
        this.onDisconnectCallbacks.push(callback)
    }

    public isConnected(): boolean {
        return this.client.connected
    }
}

const socketService = SocketService.getInstance()

export default socketService
