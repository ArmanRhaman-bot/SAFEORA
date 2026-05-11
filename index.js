const express = require("express")
const dotenv = require("dotenv")
const { ethers } = require("ethers")

dotenv.config()

const app = express()

app.use(express.json())

// BSC RPC
const provider =
new ethers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org"
)

// WALLET
const wallet =
new ethers.Wallet(
  process.env.PRIVATE_KEY,
  provider
)

// USDT CONTRACT
const usdtAddress =
"0x55d398326f99059fF775485246999027B3197955"

// ABI
const abi = [

"function transfer(address to,uint amount) public returns(bool)",

"function balanceOf(address owner) public view returns(uint)"

]

// CONTRACT
const contract =
new ethers.Contract(
  usdtAddress,
  abi,
  wallet
)

// ROOT
app.get("/", (req, res) => {

  res.send(
    "SAFEORA BEP20 API WORKING"
  )

})

// USDT SEND
app.post("/usdt/send", async (req, res) => {

  try {

    // API KEY
    const apiKey =
      req.headers["x-api-key"]

    if(apiKey !== process.env.API_KEY){

      return res.json({
        success:false,
        error:"Invalid API Key"
      })

    }

    // BODY
    const to =
      req.body.wallet

    const amount =
      parseFloat(req.body.amount)

    if(!to){

      return res.json({
        success:false,
        error:"Wallet missing"
      })

    }

    if(!amount || amount <= 0){

      return res.json({
        success:false,
        error:"Invalid amount"
      })

    }

    // SEND
    const tx =
      await contract.transfer(

        to,

        ethers.parseUnits(
          amount.toString(),
          6
        )

      )

    // WAIT
    await tx.wait()

    // SUCCESS
    return res.json({

      success:true,

      tx_hash:
      "https://bscscan.com/tx/" +
      tx.hash

    })

  } catch(e){

    return res.json({

      success:false,

      error:e.message

    })

  }

})

// PORT
const PORT =
process.env.PORT || 3000

app.listen(PORT, () => {

  console.log(
    "SAFEORA BEP20 STARTED"
  )

})
