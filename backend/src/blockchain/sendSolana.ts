const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} = require('@solana/web3.js');
import { ComputeBudgetProgram } from '@solana/web3.js';
import bs58 from 'bs58';
import { verify } from 'tweetnacl';
import { verifySolanaTx } from './verifySolanaTx';
import { decrypt } from 'src/utils/encrypt';

export function getKeypairFromBase58(base58SecretKey) {
  // Decode the base58 string into a Uint8Array
  const secretKeyBytes = bs58.decode(base58SecretKey);

  // Create a Keypair from the secret key bytes
  const keypair = Keypair.fromSecretKey(secretKeyBytes);

  return keypair;
}

async function sendSolana(
  base58PrivateKey: string,
  destinationAddress: string,
  amount: number,
) {
  try {
    // Connect to the Solana devnet cluster
    const connection = new Connection(
      process.env.SOLANA_ENDPOINT || clusterApiUrl('mainnet-beta'),
      'confirmed',
    );

    // Create a Keypair from the source private key
    let secretKey = Buffer.from(base58PrivateKey, 'hex');
    let sourceKeypair;
    try {
      sourceKeypair = Keypair.fromSecretKey(secretKey);
    } catch (ex) {
      sourceKeypair = getKeypairFromBase58(base58PrivateKey);
    }

    // Get the public key of the source wallet
    const sourcePublicKey = sourceKeypair.publicKey;
    console.log('sourcePublicKey: ', sourcePublicKey);

    // Get the public key of the destination wallet
    const destinationPublicKey = new PublicKey(destinationAddress);

    // Get the balance of the source wallet
    const balance = await connection.getBalance(sourcePublicKey);

    console.log('Balance: ', balance / 1000000000);

    // const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    //   units: 1000,
    // });

    // const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    //   microLamports: 20000000,
    // });

    // Create a transaction to send the entire balance minus the transaction fee
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: sourcePublicKey,
        toPubkey: destinationPublicKey,
        lamports: Math.floor(amount * 1000000000),
      }),
    );

    const payer = getKeypairFromBase58(decrypt(process.env.SOL_PAYER_WALLET));
    transaction.feePayer = payer.publicKey;

    console.log({
      fromPubkey: sourcePublicKey,
      toPubkey: destinationPublicKey,
      lamports: Math.floor(amount * 1000000000),
    });

    // Sign and send the transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      sourceKeypair,
      payer,
    ]);

    await new Promise((resolve, reject) => setTimeout(() => resolve(1), 3000));
    await verifySolanaTx(signature);
    return { txHash: signature, amount: amount };
  } catch (ex) {
    console.error(ex);
    throw ex;
  }
}

export default sendSolana;
