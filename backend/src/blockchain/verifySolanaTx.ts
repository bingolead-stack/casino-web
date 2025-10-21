const { Connection, clusterApiUrl } = require('@solana/web3.js');

export const verifySolanaTx = async (signature: string) => {
  const connection = new Connection(
    process.env.SOLANA_ENDPOINT || clusterApiUrl('mainnet-beta'),
    'confirmed',
  );

  // Fetch the transaction details
  const transactionDetails = await connection.getTransaction(signature, {
    commitment: 'confirmed',
  });

  if (transactionDetails && transactionDetails.meta) {
    if (transactionDetails.meta.err) {
      console.error(
        'Transaction failed with error:',
        transactionDetails.meta.err,
      );
      // Handle the failure case

      throw new Error('Transaction failed with error');
    } else {
      console.debug('Transaction succeeded');
      return signature;
    }
  } else {
    console.error(
      'Failed to fetch transaction details or transaction not found',
    );

    throw new Error('Transaction failed with error');
  }
};
