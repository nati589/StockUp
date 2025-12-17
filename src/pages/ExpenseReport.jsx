import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/system";
import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
// import { db } from "../config/firebase";
// import { getDocs, collection, updateDoc, doc } from "firebase/firestore";
import api from "../lib/api";

const StyledMUIDataTable = styled(MUIDataTable)(({ theme }) => ({
  background: theme.palette.background.default,
}));
const columns = [
  "Type",
  {
    name: "Verification",
    options: {
      filter: false,
    },
  },
  {
    name: "Payment",
    options: {
      filter: false,
    },
  },
  {
    name: "Date",
    options: {
      filter: false,
    },
  },
  {
    name: "DAY",
    options: {
      filter: true,
      display: false,
    },
  },
  {
    name: "MONTH",
    options: {
      filter: true,
      display: false,
    },
  },
  {
    name: "YEAR",
    options: {
      filter: true,
      display: false,
    },
  },
];
const options = {
  // filterType: "checkbox",
  elevation: 0,
  selectableRows: "none",
};

function ExpenseReport() {
  const [expenseList, setExpenseList] = useState([]);
  const expenseRef = api.get("/expenses");

  const getDetails = async () => {
    try {
      const expenseData = await expenseRef;
      const filteredExpenses = expenseData.data.map((expense) => ({
        ...expense,
        id: expense._id,
      }));
      setExpenseList(
        filteredExpenses.map((expense) => {
          let [month, day, year] = expense.date_added.split("/");
          return [
            expense.type,
            expense.verification,
            expense.price,
            expense.date_added,
            day,
            month,
            year,
          ];
        })
      );
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getDetails();
  }, []);
  return (
    <Grid container spacing={1} sx={{ pl: 1, pr: 1 }}>
      <Grid
        item
        xs={12}
        md={12}
        sx={{
          pr: 1,
        }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Expense Report
        </Typography>
        <StyledMUIDataTable
          title={"Expenses"}
          data={expenseList}
          columns={columns}
          options={options}
        />
      </Grid>
    </Grid>
  );
}

export default ExpenseReport;
