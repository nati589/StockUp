import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InfoIcon from "@mui/icons-material/Info";
import { Box } from "@mui/system";

function ProductCard({ data, addToCart }) {
  const [info, showInfo] = useState(false);
  function toggleInfo() {
    showInfo(!info);
  }
  return (
    <Box>
      <Card variant="outlined" sx={{ borderRadius: 3, borderWidth: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={toggleInfo} color="primary">
            {!info && <InfoOutlinedIcon />}
            {info && <InfoIcon />}
          </IconButton>
        </Box>
        <CardContent sx={{ minHeight: 130 }}>
          <Box>
            {!info && <Typography align="center">{data.name}</Typography>}
            {!info && (
                            <Typography align="center">Quantity: {data.quantity}</Typography>

            )}
            {info && <Typography align="center">{data.name}</Typography>}
            {info && (
              <Typography align="center">U/Price: {data.price_bought}</Typography>
            )}
            {info && <Typography align="center">Unit: {data.unit}</Typography>}
            {info && (
              <Typography align="center">Quantity: {data.quantity}</Typography>
            )}
          </Box>
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button variant="outlined" onClick={() => addToCart(data)} disabled={data.quantity == 0}>
            ADD
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default ProductCard;