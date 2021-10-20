import { Divider } from "@chakra-ui/react"
import { VStack, HStack } from "@chakra-ui/layout";
import React, { useState, useEffect } from "react";
import { utils } from "ethers";
import FrakButton from '../button';
import FrakButton2 from '../button2';
import OfferDetail from '../offerDetail';
import { makeOffer, getMajority } from '../../utils/contractCalls';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
} from "@chakra-ui/react"

const BuyOutCard=(({
  account,
  tokenAddress,
  fraktionsBalance,
  minPrice,
  investors,
  offers,
  provider,
  marketAddress,
  fraktionsApproved,
  itemStatus,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [valueToOffer, setValueToOffer] = useState("0");
  const [offering, setOffering] = useState(false);
  const [userIsOfferer, setUserIsOfferer] = useState(false);
  const [majority, setMajority] = useState(0);

  // functions for the offers!
  //claim Fraktal

  useEffect(()=>{
    if(account && offers && offers.length){
      let userHasOffered = offers.find(x=>x.offerer.id == account.toLocaleLowerCase());
      if(userHasOffered && userHasOffered.value > 0){
        setUserIsOfferer(true);
      }
    }
  },[account, offers]);
  useEffect(async()=>{
    if(tokenAddress && provider){
      try{
        let tokenMajority=await getMajority(provider, tokenAddress)
        setMajority(tokenMajority/100)
      }catch{
        console.log('Not yet fraktionalized')
      }
    }
  },[tokenAddress, provider])

  async function onOffer(){
    setOffering(true)
    try {
      let tx = await makeOffer(
        utils.parseEther(valueToOffer),
        tokenAddress,
        provider,
        marketAddress)
      tx.then(()=>{
        setOffering(false)
        setValueToOffer("0")
      });
      }catch(err){
        console.log('Error',err);
      }
  }

  function onSetValue(d){
    if(parseFloat(d) && parseFloat(d) >= minPrice){
      setValueToOffer(d);
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }

  return(
    <div style={{
      borderRadius:'4px',
      borderWidth:'1px',
      borderColor:'#E0E0E0',
      padding: '16px',
      marginTop:'40px 0px'
    }}
    >
    <div style={{
      color:'#5A32F3',
      fontWeight:'bold',
      fontFamily:'Inter',
      fontSize:'24px',
      lineHeight:'29px'
    }}>Fraktal NFT Buyout</div>
    <HStack style={{marginTop:'24px'}}>
      <VStack style={{
        textAlign:'start',
        marginLeft:'24px'
      }}>
      <div style={{
        fontFamily:'Inter',
        fontWeight:600,
        fontSize:'12px',
        lineHeight:'14px',
        letterSpacing:'1px',
        color:'#A7A7A7'
      }}>
      MIN OFFER
      </div>
      <HStack>
        <img src={"/eth.png"} alt={'Eth'} style={{height:'26px', marginRight:'4px'}}/>
        <div style={{
          fontFamily:'Inter',
          fontWeight:600,
          fontSize:'32px',
          lineHeight:'40px',
          color:'#000000'
        }}>
          {minPrice ?minPrice:0}
        </div>
      </HStack>
      </VStack>
      <VStack style={{
        textAlign:'start'
      }}>
        <div style={{
          fontFamily:'Inter',
          fontWeight:600,
          fontSize:'12px',
          lineHeight:'14px',
          letterSpacing:'1px',
          color:'#A7A7A7'
        }}>
          INVESTORS
        </div>
        <div style={{
          fontFamily:'Inter',
          fontWeight:600,
          fontSize:'32px',
          lineHeight:'40px',
          color:'#000000'
        }}>
          {investors}
        </div>
      </VStack>
      {userIsOfferer?
        <FrakButton
          onClick={onOffer}
        >
          Take out offer
        </FrakButton>
        :
        <VStack style={{
          textAlign:'start',
          marginLeft:'24px'
        }}>
        <div style={{
          fontFamily:'Inter',
          fontWeight:600,
          fontSize:'12px',
          lineHeight:'14px',
          letterSpacing:'1px',
          color:'#A7A7A7'
        }}>
        BUYOUT OFFER IN ETH
        </div>
        <FrakButton2
        isReady={isReady}
        onClick={onOffer}
        onSet={onSetValue}
        >
        {offering ? "Making offer" : "Offer"}
        </FrakButton2>
        </VStack>
      }
    </HStack>
    <div style={{
      fontWeight:300,
      fontSize:'12px',
      lineHeight:'14px',
      marginTop:'24px',
      marginBottom:'32px'
    }}>
    {majority}% of the investors have to accept your offer for it to go through.
    </div>

    <Divider />
    <div style={{
      fontSize:'20px',
      lineHeight:'24px',
      fontWeight:300,
      marginTop:'12px'
    }}>
      Offers
    </div>
    <div>
      {offers && offers.length && itemStatus != 'Retrieved' ?
      <Table>
        <Thead>
          <Tr>
            <Td>DATE</Td>
            <Td>ADDRESS</Td>
            <Td>OFFER</Td>
            <Td>ACTION</Td>
          </Tr>
        </Thead>

        <Tbody>
          {offers.map(x=>{
              return(
                <OfferDetail
                  account = {account}
                  offerItem = {x}
                  fraktionsBalance = {fraktionsBalance}
                  tokenAddress = {tokenAddress}
                  marketAddress = {marketAddress}
                  provider = {provider}
                  fraktionsApproved = {fraktionsApproved}
                />
              )
          })}
        </Tbody>
      </Table>
      :
      <div style={{marginTop:'24px'}}>
        There are no offers for this NFT.
      </div>
    }
    </div>
    </div>
  )
})
export default BuyOutCard;