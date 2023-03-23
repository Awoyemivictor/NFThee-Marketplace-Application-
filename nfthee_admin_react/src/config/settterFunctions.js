import { ethers } from 'ethers';

import theeERC721ABI from './abis/polygon/TheeERC721.json';
import theeERC1155ABI from './abis/polygon/TheeERC1155.json';
import Creator from './abis/polygon/Creator.json';
import Market from './abis/polygon/Marketplace.json';
import Royalty from './abis/polygon/Royalty.json';
import ERC721 from './abis/polygon/TestERC721.json';
import ERC20 from './abis/polygon/TestERC20.json';
import contracts from './contracts';
import { generateRandomNumbers, getUnixTimeAfterDays } from './helpers';
import { getFullYearTime, getUserAddress } from './constants';

const exportInstance = async (SCAddress, ABI) => {
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();
  let a = new ethers.Contract(SCAddress, ABI, signer);
  if (a) {
    return a;
  } else {
    return {};
  }
};

const readReceipt = async (hash) => {
  try {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    const receipt = await provider.getTransactionReceipt(hash.hash);
    let contractAddress = receipt.logs[0].address;
    return contractAddress;
  } catch (e) {
    console.log('error in api', e);
  }
};

export const getServiceFeesAmount = async () => {
  let marketplaceInstance = await exportInstance(
    contracts.polygonContracts.MARKETPLACE,
    Market.abi
  );
  let serviceFees = await marketplaceInstance.serviceFee();
  console.log(serviceFees);
};

export const handleChangeServiceFees = async (serviceFeesAmount) => {
  console.log(serviceFeesAmount);
  const userAddress = await getUserAddress();
  let marketplaceInstance = await exportInstance(
    contracts.polygonContracts.MARKETPLACE,
    Market.abi
  );
  // let gasLimit = await marketplaceInstance.estimateGas.changeSeriveFee(30);
  // console.log(gasLimit)
  // let options = {
  //   from: userAddress,
  //   gasLimit: Number(gasLimit) + 10,
  // };

  let options = { gasPrice: 10000000000, gasLimit: 9000000 };

  let setServiceFees = await marketplaceInstance.changeSeriveFee(22, options);
  console.log(setServiceFees);
  setServiceFees = await setServiceFees.wait();

  if (setServiceFees.status === 0) {
    console.log('Transaction Failed');
  }

  return setServiceFees.status;
};

export const getMarketplaceOwner = async () => {
  let marketplaceInstance = await exportInstance(
    contracts.polygonContracts.MARKETPLACE,
    Market.abi
  );
  let ownerAddress = await marketplaceInstance.owner();
  console.log(ownerAddress);
  return ownerAddress;
};