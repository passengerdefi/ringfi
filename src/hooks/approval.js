import { erc20ABI } from '../appconfig/abi';
import BigNumber from 'bignumber.js';
 
export const approval = ({ web3, address, tokenAddress, contractAddress, dispatch }) => {
  return new Promise((resolve, reject) => {
    const contract = new web3.eth.Contract(erc20ABI, tokenAddress);

    contract.methods
      .approve(contractAddress, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
      .send({ from: address })
      .on('transactionHash', function (hash) {
        
        resolve(hash);

      })
      .on('receipt', function (receipt) {
        resolve(new BigNumber('Infinity').toNumber());
      })
      .on('error', function (error) {
        reject(error);
      })
      .catch(error => {
        reject(error);
      });
  });
};
