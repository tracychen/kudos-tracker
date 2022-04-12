import Web3 from "web3"
import Abi from "./kudosAbi.json"
import {AbiItem} from "web3-utils"
import dotenv from "dotenv";

export function watchKudosEvents() {
    dotenv.config();

    // Instantiate web3 with WebSocketProvider
    console.log(`Using Polygon Websocket: ${process.env.POLYGON_WS_URL}`)
    const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.POLYGON_WS_URL!));

    // Instantiate token contract object with JSON ABI and address
    const contract = new web3.eth.Contract(
        Abi as AbiItem[], process.env.CONTRACT_ADDRESS
    )

    contract.events.allEvents()
    .on('connected', (subscriptionId: string) => {
        console.log(`Connected, subscription: ${subscriptionId}`);
    })
    .on('data', (event: any) => {
        console.log(event);
    })
    .on('error', console.error);
}
