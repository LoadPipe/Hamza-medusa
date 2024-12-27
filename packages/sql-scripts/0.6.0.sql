
ALTER TABLE "payment" ADD COLUMN blockchain_data jsonb;

UPDATE payment set blockchain_data = ('{"receiver_address:"' || receiver_address || 
    '", "payer_address":"'||payer_address||
    '", "transaction_id":"'||transaction_id||
    '", "chain_id":"'||chain_id||
    '", "escrow_address":"'||escrow_contract_address||'"}')::jsonb;


ALTER TABLE "payment" DROP COLUMN "payer_address";
ALTER TABLE "payment" DROP COLUMN "transaction_id";
ALTER TABLE "payment" DROP COLUMN "chain_id";
ALTER TABLE "payment" DROP COLUMN "escrow_contract_address";
ALTER TABLE "payment" DROP COLUMN "receiver_address";