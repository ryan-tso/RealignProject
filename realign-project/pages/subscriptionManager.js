import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {useEffect, useState} from "react";
import axios from "axios";

const columns = [
  { field: 'product', headerName: 'Product', width: 200 },
  { field: 'status', headerName: 'Status', width: 100 },
  { field: 'dateCreated', headerName: 'Date Submitted', width: 200 },
  { field: 'email', headerName: 'Email', width: 300 },
  { field: 'phone', headerName: 'Phone', width: 200 },
];

const rows = [
  { id: 1, product: "Product 1", status: "Pending", dateCreated: "02-29-2023", email: "abc@hotmail.com", phone: "1234567890"},
  { id: 2, product: "Product 2", status: "Contacted", dateCreated: "02-25-2023", email: "Bob@hotmail.com", phone: "5555555555"},
  { id: 3, product: "Product 1", status: "Pending", dateCreated: "02-23-2023", email: "Sally@hotmail.com", phone: "0987654321"},
];



function SubscriptionManager() {
  const [subList, setSubList] = useState([])

  useEffect(() => {
    axios.get(`/api/subscriptions/`)
      .then((response) => {
        if (response.status === 200) {
          let subscriptions = response.data.map((sub, index) => (
            {...sub, product: sub.product.name, email: sub.user.email, phone: sub.user.phone}
          ))

          setSubList(subscriptions);
        }
      }).catch((err) => {
        console.log(`Error in getting subscriptions with error ${JSON.stringify(err)}`);
      })
  }, [])


  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={subList}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}

export default SubscriptionManager