import {
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  Stack,
  Divider
} from "@mui/material";

export default function Cart({ cart, setCart }) {

  const changeQty = (id, delta) => {
    setCart(
      cart.map(item =>
        item.dish_id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta)
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter(item => item.dish_id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Box>

      {/* HEADER */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Cart
      </Typography>

      {/* ITEMS */}
      {cart.length === 0 ? (
        <Typography sx={{ color: "gray" }}>
          Cart is empty
        </Typography>
      ) : (
        cart.map(item => (
          <Card key={item.dish_id} sx={{ mb: 1, borderRadius: 2 }}>
            <CardContent sx={{ py: 1.5 }}>

              <Stack spacing={1}>

                {/* NAME + PRICE */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontWeight: 600 }}>
                    {item.name}
                  </Typography>

                  <Typography>
                    {item.price * item.quantity} ₴
                  </Typography>
                </Box>

                {/* CONTROLS */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => changeQty(item.dish_id, -1)}
                  >
                    -
                  </Button>

                  <Typography>
                    {item.quantity}
                  </Typography>

                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => changeQty(item.dish_id, 1)}
                  >
                    +
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => removeItem(item.dish_id)}
                  >
                    Remove
                  </Button>

                </Box>

              </Stack>

            </CardContent>
          </Card>
        ))
      )}

      {/* TOTAL */}
      {cart.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Typography variant="h6">
              Total:
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {total} ₴
            </Typography>
          </Box>
        </>
      )}

    </Box>
  );
}