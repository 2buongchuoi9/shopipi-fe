import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { accessToken, clientId } from './utils/localStorageUtils'

const SOCKET_URL = import.meta.env.VITE_API_URL + '/ws'

const header = {
    authorization: accessToken.get() ?? '',
    'x-client-id': clientId.get() ?? '',
}

class SocketService {
    private static instance: SocketService
    private client: Stomp.Client
    private subscribers: Map<string, (message: any) => void> = new Map()
    private onConnectCallbacks: (() => void)[] = []
    private onDisconnectCallbacks: (() => void)[] = []

    constructor() {
        const sockJS = new SockJS(SOCKET_URL)

        this.client = Stomp.over(sockJS)

        // this.connect() // Connect when the service is initialized
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new SocketService()
            // this.instance.connect()
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
                    this.subscribers.forEach((callback, destination) => {
                        this.client.subscribe(destination, (message) => {
                            console.log(`Received message on ${destination}:`, message)
                            callback(JSON.parse(message.body))
                        })
                    })
                },
                (error) => {
                    console.error('Failed to connect to WebSocket', error)
                    // setTimeout(() => this.connect(), 5000) // Retry after 5 seconds
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

    public sendMessage(destination: string, body: any) {
        if (this.client.connected) {
            this.client.send(destination, {}, JSON.stringify(body))
        } else {
            console.error('WebSocket is not connected')
        }
    }

    public subscribe(destination: string, callback: (message: any) => void) {
        if (!this.subscribers.has(destination)) {
            if (this.client.connected) {
                this.client.subscribe(destination, (message) => {
                    console.log(`Received message on ${destination}:`, message)
                    callback(JSON.parse(message.body))
                })
            } else {
                console.warn(`Not connected. Cannot subscribe to ${destination}.`)
            }
            this.subscribers.set(destination, callback)
        } else {
            console.log(`Already subscribed to ${destination}`)
        }
    }

    public unsubscribe(destination: string) {
        if (this.subscribers.has(destination)) {
            this.client.unsubscribe(destination)
            this.subscribers.delete(destination)
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
