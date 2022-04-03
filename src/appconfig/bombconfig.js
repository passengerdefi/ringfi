import { addressBook } from 'bombfarm-addressbook';
import { bscPools } from '../appconfig/bsc_pools'



export const inputTokens = [bscPools[0].name, ...bscPools[0].assets]
const { bsc: bscAddressBook, } = addressBook;
export {  bscAddressBook };

