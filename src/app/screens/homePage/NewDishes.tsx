import React from "react";
import { Box, Container, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveNewDishes } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { useHistory } from "react-router-dom";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

/* REDUX */
const newDishesRetriever = createSelector(retrieveNewDishes, (newDishes) => ({
  newDishes,
}));

export default function NewDishes() {
  const { newDishes } = useSelector(newDishesRetriever);
  const history = useHistory();

  const handleProductClick = (id: string) => {
    history.push(`/products/${id}`);
  };

  return (
    <div className="new-products-frame">
      <Container maxWidth="lg">
        <Stack className="main">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box className="section-label">Try Our Latest Creations</Box>
            <Box className="category-title">New Menu</Box>
          </Box>

          {/* Cards */}
          <Stack className="cards-frame">
            {newDishes.length !== 0 ? (
              newDishes.map((product: Product) => {
                const imagePath = `${serverApi}/${product.productImages[0]}`;
                const sizeVolume =
                  product.productCollection === ProductCollection.DRINK
                    ? `${product.productVolume}L`
                    : product.productSize;

                return (
                  <Box
                    key={product._id}
                    className="new-card"
                    onClick={() => handleProductClick(product._id)}
                  >
                    {/* NEW badge */}
                    <Box className="new-badge">NEW</Box>

                    {/* Image */}
                    <Box className="new-card-img-wrap">
                      <img
                        src={imagePath}
                        alt={product.productName}
                        className="new-card-img"
                      />
                    </Box>

                    {/* Info */}
                    <Box className="new-card-info">
                      <Box className="new-card-name">{product.productName}</Box>
                      <Box className="new-card-price">
                        ₩{product.productPrice.toLocaleString()}
                      </Box>
                      <Box className="new-card-detail">
                        <Box className="new-card-size">{sizeVolume}</Box>
                        <Box className="divider-line" />
                        <Box className="new-card-views">
                          <RemoveRedEyeOutlinedIcon sx={{ fontSize: 13 }} />
                          <span>{product.productViews}</span>
                        </Box>
                      </Box>
                      {product.productDesc && (
                        <Box className="new-card-desc">
                          {product.productDesc.slice(0, 55)}...
                        </Box>
                      )}
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Box className="no-data">No new dishes yet!</Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
