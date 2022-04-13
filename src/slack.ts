import axios from "axios"
import dotenv from "dotenv";

dotenv.config();
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL!

// TODO: ens resolution
export async function sendToSlack(eventType: string, tokenId: string, address: string) {
    dotenv.config()
    console.log(`Sending message to slack for tokenId: ${tokenId}`)
    try {
        const res = await axios.post(SLACK_WEBHOOK_URL, { 
            "tokenId": tokenId,
            "claimLink": `https://mintkudos.xyz/claim/${tokenId}`,
            "imageLink": `https://images.mintkudos.xyz/token/${tokenId}.png`,
            "eventType": `${eventType} By ${address}`
        });
        console.log(`Response from slack webhook: ${res.status}`);
    } catch (error: any) {
        console.log(error);
    }
}
