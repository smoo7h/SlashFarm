
import BigNumber from 'bignumber.js'


interface Call {
  address: string // Address of the contract
  name: string // Function name on the contract (exemple: balanceOf)
  params?: any[] // Function params
}

const multicalltrx = async (abi: any[], calls: Call[]) => {

  // can not for the life of me get the multi contract working just going 2 do it manually 4 now 

  // loop through the values and get the data from the blockchain 
  

  const newArr = await calls.map(async function(val, index){
   

    // gett the contract
    const contractObj =  await (window as any).tronWeb.contract().at(val.address);
   
    

    // check to see how many params there is 
    let value;
    if(val.params === undefined){
      // this is 0 params
      // this is to check to  see if we have some ABI if we dont it means we have a justswap lp token
      if(contractObj.abi.length <= 1){
        const functionSelector = val.name;

    
         const transaction = await (window as any).tronWeb.transactionBuilder.triggerConstantContract(
          val.address,
           functionSelector,
           {},
         );
        
        // need to convert this hex number to a bignumber
        const bigNumResult = new BigNumber(`0x${transaction.constant_result[0]}`)   

         value = bigNumResult;
      }
      else{
        value = await contractObj[val.name]().call();
       
      }
    }else if(val.params[0] && val.params[1] === undefined){
      // this is 1 param
    

      if(contractObj.abi.length <= 1){
        const functionSelector = val.name;
        // parse the type from the string

        const theType = functionSelector.substring(functionSelector.lastIndexOf("(") + 1, functionSelector.lastIndexOf(")") );
        
        const parameter = [
           {
             type: theType,
             value: val.params[0],
           }
         ];
        
         const transaction = await (window as any).tronWeb.transactionBuilder.triggerConstantContract(
          val.address,
           functionSelector,
           {},
           parameter
          // parameter
         );

        const bigNumResult = new BigNumber(`0x${transaction.constant_result[0]}`)   
        // need to convert this hex number to a bignumber
         value = bigNumResult;
      }
      else{
        value = await contractObj[val.name](val.params[0]).call();
       
      }
    
    }else{
      // this is 2 params
     

   
        const functionSelector = val.name;
        // parse the type from the string

        const theType1 = functionSelector.substring(functionSelector.lastIndexOf("(") + 1, functionSelector.lastIndexOf(")") ).split(',')[0];
        const theType2 = functionSelector.substring(functionSelector.lastIndexOf("(") + 1, functionSelector.lastIndexOf(")") ).split(',')[1];
        
        const parameter = [
           {
             type: theType1,
             value: val.params[0],
           },
           {
            type: theType2,
            value: val.params[1],
          }
         ];
        
         const transaction = await (window as any).tronWeb.transactionBuilder.triggerConstantContract(
          val.address,
           functionSelector,
           {},
           parameter
          // parameter
         );

        const bigNumResult = new BigNumber(`0x${transaction.constant_result[0].replace('fffffffffffffffffffffffffffff','')}`)   
        // need to convert this hex number to a bignumber
       
         value = bigNumResult;
     
      
    }
    
    // await Promise.resolve(value)
    return(value)
    
  })
  // wait for it to resolve
  const returndata = await Promise.all(newArr);

  return returndata
  
}

export default multicalltrx
