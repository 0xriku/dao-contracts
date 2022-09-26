import { SigningCosmWasmClient, Secp256k1HdWallet, GasPrice } from "cosmwasm";

import * as fs from "fs";
import axios from "axios";

const cw_core_wasm = fs.readFileSync("../artifacts/cw_core.wasm");
const cw20_stake_wasm = fs.readFileSync("../artifacts/cw20_stake.wasm");
const cw_proposal_single_wasm = fs.readFileSync(
  "../artifacts/cw_proposal_single.wasm"
);
const cw20_stake = fs.readFileSync("../artifacts/cw20_stake.wasm");

const cw_core_id = 96;
const cw_proposal_single_id = 97;
const cw20_stake_id = 93;
const cw20_code_id = 94;

const rpcEndpoint = "https://rpc.uni.juno.deuslabs.fi";

const mnemonic =
  "chaos consider detect option between will flee awkward protect imitate that average";

const prefix = "juno";

const nft_contract_address =
  "juno1q4hgxfrl4wzyyynpn92ytn39fttwx7yyhmm09lecrctucr724s6q3s7spc";
const cw_core_contract_address =
  "juno1p5jq04hf6tvgl98k2pew92jw4pw8zpvl5ah9avafjsrf8cwang4qmcjpgt";
const cw721_staking_address =
  "juno1lsxl2hs2tcvkmlaz7a4ctuagk9rjxdqjz3t9y3sxp4zgf4qlzzns5p60dd";
const cw_single_proposal_address =
  "juno15j80fyf2nutq600kuupvjy3rpa6czxelxwzl8c4a2r833yyz8xuqk2kmp3";

async function setupClient(mnemonic: string): Promise<SigningCosmWasmClient> {
  let gas = GasPrice.fromString("0.025ujunox");
  let wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: prefix,
  });
  let client = await SigningCosmWasmClient.connectWithSigner(
    rpcEndpoint,
    wallet,
    { gasPrice: gas }
  );
  return client;
}

async function getAddress(mnemonic: string) {
  let wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: prefix,
  });
  let accounts = await wallet.getAccounts();
  return accounts[0].address;
}

describe("DAODAO NFT Staking Tests", () => {
  xit("Generate Wallet", async () => {
    let wallet = await Secp256k1HdWallet.generate(12);
    console.log(wallet.mnemonic);
  });

  xit("Get wallet address", async () => {
    let client = await setupClient(mnemonic);
    let address = await getAddress(mnemonic);
    console.log(address);
  }).timeout(10000000000);

  xit("Upload Cw Proposal Single and get code_id", async () => {
    let client = await setupClient(mnemonic);
    let res = await client.upload(
      await getAddress(mnemonic),
      cw_proposal_single_wasm,
      "auto",
      undefined
    );
    console.log(res);
  }).timeout(10000000000);

  xit("Upload CW20 Stake contract and get code_id", async () => {
    let client = await setupClient(mnemonic);
    let res = await client.upload(
      await getAddress(mnemonic),
      cw20_stake_wasm,
      "auto",
      undefined
    );
    console.log(res);
  }).timeout(10000000000);

  xit("Upload CW20 Stake contract and get code_id", async () => {
    let client = await setupClient(mnemonic);
    let res = await client.upload(
      await getAddress(mnemonic),
      cw20_stake,
      "auto",
      undefined
    );
    console.log(res);
  }).timeout(10000000000);

// pub struct InstantiateMsg {
//     /// Optional Admin with the ability to execute DAO messages
//     /// directly. Useful for building SubDAOs controlled by a parent
//     /// DAO. If no admin is specified the contract is set as its own
//     /// admin so that the admin may be updated later by governance.
//     pub admin: Option<String>,
//     /// The name of the core contract.
//     pub name: String,
//     /// A description of the core contract.
//     pub description: String,
//     /// An image URL to describe the core module contract.
//     pub image_url: Option<String>,

//     /// If true the contract will automatically add received cw20
//     /// tokens to its treasury.
//     pub automatically_add_cw20s: bool,
//     /// If true the contract will automatically add received cw721
//     /// tokens to its treasury.
//     pub automatically_add_cw721s: bool,

//     /// Instantiate information for the core contract's voting
//     /// power module.
//     pub voting_module_instantiate_info: ModuleInstantiateInfo,
//     /// Instantiate information for the core contract's
//     /// proposal modules.
//     pub proposal_modules_instantiate_info: Vec<ModuleInstantiateInfo>,

//     /// Initial information for arbitrary contract addresses to be
//     /// added to the items map. The key is the name of the item in the
//     /// items map. The value is an enum that either uses an existing
//     /// address or instantiates a new contract.
//     pub initial_items: Option<Vec<InitialItem>>,
//     /// Implements the DAO Star standard: https://daostar.one/EIP
//     pub dao_uri: Option<String>,
// }

// pub struct ModuleInstantiateInfo {
//   /// Code ID of the contract to be instantiated.
//   pub code_id: u64,
//   /// Instantiate message to be used to create the contract.
//   pub msg: Binary,
//   /// Admin of the instantiated contract.
//   pub admin: Admin,
//   /// Label for the instantiated contract.
//   pub label: String,
// }

xit("Instantiate CW Core Contract", async () => {
  let client = await setupClient(mnemonic);
  let res = await client.instantiate(
    await getAddress(mnemonic),
    cw_core_wasm,
    { 
      name: "WBA DAO Core", 
      description: "Core DAO contract for WBA",
      automatically_add_cw20s: false,
      automatically_add_cw721s: false,
      voting_module_instantiate_info: {
        code_id: cw20_stake_id,
        msg: {

        }
      },
       },
    "DAO NFT",
    "auto",
    undefined
  );
  console.log(res);
}).timeout(100000);
  
// pub struct InstantiateMsg {
//   // Owner can update all configs including changing the owner. This will generally be a DAO.
//   pub owner: Option<String>,
//   // Manager can update all configs except changing the owner. This will generally be an operations multisig for a DAO.
//   pub manager: Option<String>,
//   pub token_address: String,
//   pub unstaking_duration: Option<Duration>,
// }

  xit("Mint NFT", async () => {
    let client = await setupClient(mnemonic);
    let res = await client.execute(
      await getAddress(mnemonic),
      nft_contract_address,
      {
        mint: {
          token_id: "1",
          token_uri: "url",
          owner: await getAddress(mnemonic),
        },
      },
      "auto",
      undefined
    );
    console.log(res);
  }).timeout(100000);

  xit("Instantiate Core Contract", async () => {
    let client = await setupClient(mnemonic);
    let proposal_instantiate_msg = {
      threshold: { absolute_percentage: { percentage: { majority: {} } } },
      max_voting_period: { height: 1000 },
      only_members_execute: false,
      allow_revoting: false,
      close_proposal_on_execution_failure: true,
    };

    let cw721_stake_instantiate_msg = {
      owner: { instantiator: {} },
      nft_address: nft_contract_address,
    };

    let cw_core_instantiate_msg = {
      name: "DAO DAO",
      description: "A DAO that builds DAOs",
      automatically_add_cw20s: true,
      automatically_add_cw721s: false,
      voting_module_instantiate_info: {
        code_id: cw721_stake_id,
        msg: Buffer.from(JSON.stringify(cw721_stake_instantiate_msg)).toString(
          "base64"
        ),
        admin: { none: {} },
        label: "DAO DAO voting module",
      },
      proposal_modules_instantiate_info: [
        {
          code_id: cw_proposal_single_id,
          msg: Buffer.from(JSON.stringify(proposal_instantiate_msg)).toString(
            "base64"
          ),
          admin: { core_contract: {} },
          label: "DAO DAO governance module.",
        },
      ],
    };

    //let res = await client.instantiate(await getAddress(mnemonic), cw_proposal_single_id, proposal_instantiate_msg, "DAO DAO", "auto", undefined);
    //let res = await client.instantiate(await getAddress(mnemonic), cw721_stake_id, cw721_stake_instantiate_msg, "DAO DAO", "auto", undefined);
    let res = await client.instantiate(
      await getAddress(mnemonic),
      cw_core_id,
      cw_core_instantiate_msg,
      "DAO DAO 2",
      "auto",
      undefined
    );
    console.log(res);
  }).timeout(100000000);

  xit("Get Staking contract address", async () => {
    let client = await setupClient(mnemonic);
    let res = await client.queryContractSmart(cw_core_contract_address, {
      dump_state: {},
    });
    console.log(res);
  }).timeout(1000000);

  xit("Stake NFTs", async () => {
    let client = await setupClient(mnemonic);
    let res = await client.execute(
      await getAddress(mnemonic),
      nft_contract_address,
      {
        send_nft: {
          contract: cw721_staking_address,
          token_id: "1",
          msg: Buffer.from(JSON.stringify({})).toString("base64"),
        },
      },
      "auto",
      undefined
    );
    console.log(res);
  }).timeout(100000);

  xit("Create Proposal", async () => {
    let client = await setupClient(mnemonic);
    let res = await client.execute(
      await getAddress(mnemonic),
      cw_single_proposal_address,
      {
        propose: {
          title: "A simple text proposal",
          description: "This is a simple text proposal",
          msgs: [],
        },
      },
      "auto",
      undefined
    );
    console.log(res);
  }).timeout(100000);

  xit("List proposals", async () => {
    let client = await setupClient(mnemonic);
    let res = await client.queryContractSmart(cw_single_proposal_address, {
      list_proposals: {},
    });
    console.log(res);
  }).timeout(100000);

  xit("Get Proposal id1", async () => {
    let client = await setupClient(mnemonic);
    let res = await client.queryContractSmart(cw_single_proposal_address, {
      proposal: { proposal_id: 1 },
    });
    console.log(res);
  }).timeout(100000);

  xit("Vote on Proposal", async () => {
    let client = await setupClient(mnemonic);
    let res = await client.execute(
      await getAddress(mnemonic),
      cw_single_proposal_address,
      { vote: { proposal_id: 1, vote: "yes" } },
      "auto",
      undefined
    );
    console.log(res);
  }).timeout(100000);
});
