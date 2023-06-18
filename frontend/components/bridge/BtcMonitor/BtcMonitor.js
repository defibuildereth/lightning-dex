import { useState, useEffect } from "react"

const BtcMonitor = ({ btcDepositAddress, btcHeight }) => {

    const [tx, setTx] = useState("")
    const [confirmed, setConfirmed] = useState(false)

    useEffect(() => {
        if (btcDepositAddress) {
            pollAddressAPI(btcDepositAddress)
        }
    }, [btcDepositAddress])

    useEffect(() => {
        if (tx) {
            pollTxAPI(tx)
        }
    }, [tx])

    function checkTransactions(transactions, btcHeight) {
        const tx = transactions[0];
        if (tx.status && !tx.status.confirmed) {
            setTx(tx.txid)
            return tx.txid
        }
    }

    async function pollTxAPI(tx) {
        let intervalId = setInterval(async () => {

            await fetch('/api/btcTxStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tx }),
            })
                .then(r => r.json())
                .then(data => {
                    if (data.confirmed) {
                        setConfirmed(true)
                        clearInterval(intervalId) // stop polling
                    }
                })
                .catch(error => console.error(error))
        }, 15000)
    }

    async function pollAddressAPI(btcDepositAddress) {
        let intervalId = setInterval(async () => {

            await fetch('/api/btcAddressTxs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ btcDepositAddress }),
            })
                .then(r => r.json())
                .then(data => {
                    if (checkTransactions(data, btcHeight)) {
                        clearInterval(intervalId) // stop polling
                    }
                })
                .catch(error => console.error(error))
        }, 15000)
    }

    return (<>
        {tx ? <>
            <a
                href={`https://mempool.space/tx/${tx}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                Pending tx: {tx.slice(0, 6)}...{tx.slice(-6)}
            </a>
            {confirmed ? <p>Confirmed</p> : null}
        </>
            : <p>Awaiting btc deposit...</p>}
    </>
    );
};

export default BtcMonitor;