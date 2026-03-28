import deployed from '../../../contracts/deployed.json';

const _deployedAddress: string = deployed.address;
const _envAddress: string | undefined =
  typeof process !== 'undefined'
    ? (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? process.env.EXPO_PUBLIC_CONTRACT_ADDRESS)
    : undefined;

export const CONTRACT_ADDRESS: string = _envAddress || _deployedAddress || 'PENDING_DEPLOYMENT';
export const CONTRACT_ABI = deployed.abi;
export const SHARDEUM_RPC =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_RPC_URL) ||
  'https://api-mezame.shardeum.org';
