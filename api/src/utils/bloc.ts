// blochq.io -- an api service that allows you to buy airtime and data from your app.

import axios from "axios";
import { TELCOS } from "./utils";

export async function buyAirtimeFromBloc(amount: number, phoneNumber: string, network: string) {

  const baseUrl = 'https://api.blochq.io/v1/bills';
  const authorization = `Bearer ${process.env.BLOCHQ_TOKEN}`;
  const url = `${baseUrl}/payment?bill=telco`;
  const headers = {
    accept: 'application/json',
    authorization,
    'content-type': 'application/json'
  };

  const operator_id = TELCOS.find(telco => telco.name.toLowerCase() === network.toLowerCase())?.id
  const products = await axios.get(`${baseUrl}/operators/${operator_id}/products?bill=telco`, { headers });
  const product_id = products.data.data[0].id;

  const data = {
    "device_details": {
      "beneficiary_msisdn": phoneNumber
    },
    "amount": amount,
    "product_id": product_id,
    "operator_id": operator_id
  };

  const response = await axios.post(url, data, { headers });
  return response.data;
}