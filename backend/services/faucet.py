from web3 import Web3
import os

INFURA_URL = os.getenv("SEPOLIA_RPC_URL")
FAUCET_PRIVATE_KEY = os.getenv("FAUCET_PRIVATE_KEY")
FAUCET_ADDRESS = os.getenv("FAUCET_ADDRESS")

web3 = Web3(Web3.HTTPProvider(INFURA_URL))

def send_sepolia_eth(recipient: str, amount_eth: float) -> str:
    nonce = web3.eth.get_transaction_count(FAUCET_ADDRESS)
    gas_price = web3.eth.gas_price

    tx = {
        'nonce': nonce,
        'to': Web3.to_checksum_address(recipient),
        'value': web3.to_wei(amount_eth, 'ether'),
        'gas': 21000,
        'gasPrice': gas_price,
    }

    signed_tx = web3.eth.account.sign_transaction(tx, private_key=FAUCET_PRIVATE_KEY)
    tx_hash = web3.eth.send_raw_transaction(signed_tx.raw_transaction)
    return web3.to_hex(tx_hash)
