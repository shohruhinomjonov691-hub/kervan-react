import React from "react";
import { Box, Container, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePopularDishes } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

/* REDUX */
const popularDishesRetriever = createSelector(
  retrievePopularDishes,
  (popularDishes) => ({ popularDishes }),
);

export default function PopularDishes() {
  const { popularDishes } = useSelector(popularDishesRetriever);
  const history = useHistory();

  const handleProductClick = (id: string) => {
    history.push(`/products/${id}`);
  };

  return (
    <div className="popular-dishes-frame">
      <Container maxWidth="lg">
        <Stack className="popular-section">
          {/* Header row */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
            sx={{ width: "100%", mb: 4 }}
          >
            <Box>
              <Box className="section-label">Most Loved Flavours</Box>
              <Box className="category-title">Signature Dishes</Box>
            </Box>
            <Box
              className="see-all-link"
              onClick={() => history.push("/products")}
            >
              See Full Menu <ArrowForwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
            </Box>
          </Stack>

          {/* Cards */}
          <Stack className="cards-frame">
            {popularDishes.length !== 0 ? (
              popularDishes.map((product: Product) => {
                const imagePath = `${serverApi}/${product.productImages[0]}`;
                return (
                  <Box
                    key={product._id}
                    className="sig-card"
                    onClick={() => handleProductClick(product._id)}
                  >
                    {/* Image */}
                    <Box className="sig-card-img-wrap">
                      <img
                        src={imagePath}
                        alt={product.productName}
                        className="sig-card-img"
                        onError={(e: any) => {
                          e.target.src = "/img/homeNavbar.png";
                        }}
                      />
                      {/* Views badge */}
                      <Box className="sig-card-views">
                        <RemoveRedEyeOutlinedIcon sx={{ fontSize: 13 }} />
                        <span>{product.productViews}</span>
                      </Box>
                      {/* Collection badge */}
                      <Box className="sig-card-badge">
                        {product.productCollection}
                      </Box>
                    </Box>

                    {/* Info */}
                    <Box className="sig-card-info">
                      <Box className="sig-card-name">{product.productName}</Box>
                      <Box className="sig-card-desc">
                        {product.productDesc
                          ? product.productDesc.slice(0, 60) + "..."
                          : "Authentic Turkish flavour crafted with tradition."}
                      </Box>
                      <Box className="sig-card-price">
                        ₩{product.productPrice.toLocaleString()}
                      </Box>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Box className="no-data">No signature dishes yet!</Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
