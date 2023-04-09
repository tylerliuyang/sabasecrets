import { RealtimeChannel, createClient } from '@supabase/supabase-js';
import { MinMessage } from '../message/message';

// if (process.env.SUPABASE_URL === undefined || process.env.SUPABASE_KEY === undefined) {
//     console.log("TEST")
//     throw Error;
// }
// hardcoded right now, should change to allow users to configure
const supabase = createClient("https://lzmhlmpgnmpkduzdlopl.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bWhsbXBnbm1wa2R1emRsb3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgyMTcyOTgsImV4cCI6MTk5Mzc5MzI5OH0.ywwT01orvWTuIbI-6ybJQj4St_JYz7ZJTY2iFue_R_I")

export const initChannel = (channelAddress: string) => {
    return supabase.channel(channelAddress).subscribe();
}


export const sendWSSMessage = (message: string, type: number, channel: RealtimeChannel) => {
    // channel.subscribe((status) => {
    // if (status === 'SUBSCRIBED') {
    channel.send({
        type: 'broadcast',
        event: 'message',
        payload: { message: message, type: type },
    })
    // } else {
    //     console.log("Message failed to send!");
    // }
    // })
}

export const handleWSSMessage = (handler: (payload: MinMessage) => void, channel: RealtimeChannel) => {
    channel
        .on('broadcast', { event: 'message' }, ({ payload }) => { console.log("Inside handler" + JSON.stringify(payload)), handler(payload) })
}