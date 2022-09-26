import axios from "axios"
import dotenv from "dotenv";
import { KudosEventType } from "./watcher";

dotenv.config();
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL!


const profileLinkMap: {[kudosEventType in KudosEventType]: (address: string, tokenId: string) => string} = {
    [KudosEventType.CLAIMED]: (address, tokenId) => `https://mintkudos.xyz/profile/${address}?tab=Received&tokenId=${tokenId}`,
    [KudosEventType.REGISTERED]: (address, tokenId) => `https://mintkudos.xyz/profile/${address}?tab=Sent&tokenId=${tokenId}`
}
// TODO: ens resolution
export async function sendToSlack(eventType: KudosEventType, tokenId: string, address: string) {
    dotenv.config()
    console.log(`Sending message to slack for tokenId: ${tokenId}`)
    try {
        const res = await axios.post(SLACK_WEBHOOK_URL, { 
            "tokenId": tokenId,
            "profileLink": profileLinkMap[eventType](address, tokenId),
            "imageLink": `https://images.mintkudos.xyz/token/${tokenId}.png`,
            "eventType": `${eventType} By ${address}`
        });
        console.log(`Response from slack webhook: ${res.status}`);
    } catch (error: any) {
        console.log(error);
    }
}
