lncli listchannels | jq '[ .channels[] | { remote_pubkey: .remote_pubkey, local_balance: .local_balance, remote_balance: .remote_balance } ]' | curl -X POST -H "Content-Type: application/json" https://api.bitcoin.zigzag.exchange/channels -d "$(</dev/stdin)"