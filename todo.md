tyler priorities:
[] group chats with multiple pairwise channels (read project proposal for why)
[] add wss support for realtime messages
[] write up about DOS attacks (consuming all prekeys)
[] add obfuscated group ids for each pairwise channel in groups to ensure fast database retrival without exposing group inclusion

---

[] Check if message franking is built into libsignal
[] work on ui
[] getting messages based on time/chat/user

---

[X] Change storage to database for persistent state
[X] (for now?) (specifically make locations and such consistent)
[X] switch to tRPC
[X] switch to supabase completely
[X] create pairwise channels
[X] improve fetching efficiency (have the sender and receiver be keys for the database)
[X] make message refresh fetch both sent and recieved messages (currently only fetches receieved)
[X] sort messages by timestamp
[X] from libsignal "Ciphertexts come in two flavors: WhisperMessage and PreKeyWhisperMessage."
[X] do the messaging correctly
