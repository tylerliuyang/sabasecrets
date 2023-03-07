This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the server:

npm run build
npm run start

(you can use `npm run dev`, but it has weird auto refresh behavior that doesn't play well with api/directory/definitions/directory)

Visit `http://localhost:3000/home` to see the 'registration' page
visit `http://localhost:3000/api/directory/definitions/directory` to introspect the currently registered users and associated keys
all keys are stored in local storage

## Visit `http://localhost:3000/home/message` to send messages to other users

## [otherUsername][message][submit][refresh]

refresh gets messages from the server (currently only renders recieved messages not outgoing, and doesn't distinguish other user sources)
visit `http://localhost:3000/api/messages/definitions/messages` to instrospect messages (note how they're encrypted :D)

luckily, it turns out libsignal comes baked in with forward secrecy due to prekeys and possibly with message franking? still have to look into that

please help me do frontend you see how atrocious it is

see
`https://github.com/privacyresearchgroup/libsignal-typescript-demo/tree/31b3716bf7ada42f1771cc39d63f8096f3cf4a1a/signal-protocol-client`
for reference
