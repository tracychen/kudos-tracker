import Web3 from "web3"
import Abi from "./kudosAbi.json"
import {AbiItem} from "web3-utils"
import dotenv from "dotenv";
import { sendToSlack } from "./slack";

export function watchKudosEvents() {
    dotenv.config();

    // Instantiate web3 with WebSocketProvider
    console.log(`Using Polygon websocket url: ${process.env.POLYGON_WS_URL}`)

    const web3 = new Web3()
    // const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.POLYGON_WS_URL!));

    // Refreshes provider instance and attaches event handlers
    function refreshProvider(web3Obj: Web3, providerUrl: string) {
        function retry() {
            console.log(`Reconnecting web3 provider for url ${providerUrl}`)
            refreshProvider(web3Obj, providerUrl)

            return null
        }

        const provider = new Web3.providers.WebsocketProvider(providerUrl)

        provider.on('end', () => retry())
        provider.on('error', () => retry())

        web3Obj.setProvider(provider)

        console.log(`New Web3 provider initiated for url ${provider.connection.url}`)

        return provider
    }

    refreshProvider(web3, process.env.POLYGON_WS_URL!)

    // Instantiate token contract object with JSON ABI and address
    const contract = new web3.eth.Contract(
        Abi as AbiItem[], process.env.CONTRACT_ADDRESS
    )

    contract.events.allEvents()
    .on('connected', (subscriptionId: string) => {
        console.log(`Connected, subscription: ${subscriptionId}`);
    })
    .on('data', async (event: any) => {
        console.log(event);
        if (event.event == 'RegisteredKudos') {
            console.log(`TokenId ${event.returnValues.tokenId} registered`);
            await sendToSlack("Registered", event.returnValues.tokenId, event.returnValues.creator)
        } else if (event.event == 'TransferSingle') {
            console.log(`TokenId ${event.returnValues.id} transferred to ${event.returnValues.to}`);
            await sendToSlack("Claimed", event.returnValues.id, event.returnValues.to)
        }
    })
    .on('error', (error: any) => {
        console.log(error);
    })
}
