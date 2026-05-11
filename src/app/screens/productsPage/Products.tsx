import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Pagination,
  PaginationItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { setProducts } from "./slice";
import { retrieveProducts } from "./selector";
import { Product, ProductInquiry } from "../../../lib/types/product";
import { ProductCollection } from "../../../lib/enums/product.enum";
import ProductService from "../../services/ProductService";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { useHistory } from "react-router-dom";
import { sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";

/* REDUX */
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});
const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

/* Branch data */
const branches = [
  {
    name: "Itaewon",
    key: "ITAEWON",
    address: "127-3 Itaewon-ro, Yongsan-gu, Seoul",
    desc: "The original heart of Kervan. Experience authentic Anatolian vibes in the city's international hub.",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.5!2d126.9940!3d37.5345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca2012d5c6c4f%3A0x69f4eded3ac7dc0!2sItaewon-ro!5e0!3m2!1sen!2skr!4v1700000000000",
  },
  {
    name: "COEX Mall",
    key: "COEX",
    address: "513 Yeongdong-daero, Gangnam-gu, Seoul",
    desc: "Modern luxury dining. A premium oasis for business travelers and shopping aficionados.",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.4!2d127.0592!3d37.5126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca41040000001%3A0x1!2sCOEX!5e0!3m2!1sen!2skr!4v1700000000000",
  },
  {
    name: "Famille Station",
    key: "FAMILLE",
    address: "176 Sinbanpo-ro, Seocho-gu, Seoul",
    desc: "The culinary crossroads. A sophisticated retreat for travelers at the Seoul Express Terminal.",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.3!2d127.0045!3d37.5080!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca000000001%3A0x1!2sFamille+Station!5e0!3m2!1sen!2skr!4v1700000000000",
  },
];

/* Filter chips */
const filterChips = [
  { label: "All", value: undefined },
  { label: "Kebab", value: ProductCollection.KEBAB },
  { label: "Pide", value: ProductCollection.PIDE },
  { label: "Meze", value: ProductCollection.MEZE },
  { label: "Soup", value: ProductCollection.SOUP },
  { label: "Desserts", value: ProductCollection.DESSERT },
  { label: "Drinks", value: ProductCollection.DRINK },
];

interface ProductsProps {
  onAdd: (item: CartItem) => void;
}

export default function Products(props: ProductsProps) {
  const { onAdd } = props;
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const history = useHistory();

  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 6,
    order: "productViews",
    search: "",
  });

  const [searchText, setSearchText] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState(0);

  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts(productSearch)
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, [productSearch]);

  // Clear search when text is empty
  useEffect(() => {
    if (searchText === "") {
      setProductSearch((prev) => ({ ...prev, search: "", page: 1 }));
    }
  }, [searchText]);

  /** HANDLERS **/
  const searchCollectionHandler = (collection?: ProductCollection) => {
    setProductSearch((prev) => ({
      ...prev,
      page: 1,
      productCollection: collection,
    }));
  };

  const searchOrderHandler = (order: string) => {
    setProductSearch((prev) => ({ ...prev, order, page: 1 }));
  };

  const searchProductHandler = () => {
    setProductSearch((prev) => ({ ...prev, search: searchText, page: 1 }));
  };

  const paginationHandler = (_: ChangeEvent<any>, value: number) => {
    setProductSearch((prev) => ({ ...prev, page: value }));
  };

  // ✅ Click on card body → ChosenProduct page
  const handleProductClick = (id: string) => {
    history.push(`/products/${String(id)}`);
  };

  // ✅ Hover basket button → add to cart
  const handleAddToBasket = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // card click ni to'xtatadi
    onAdd({
      _id: product._id,
      quantity: 1,
      name: product.productName,
      price: product.productPrice,
      image: product.productImages[0],
    });
    await sweetTopSmallSuccessAlert("Added to basket! 🛍️", 900);
  };

  return (
    <div className="products-list-section">
      <Container maxWidth="lg">
        {/* ── PAGE HEADER ── */}
        <Box className="products-header">
          <Typography className="products-headline">
            Our Curated Turkish Menu
          </Typography>
          <Typography className="products-sub">
            Discover the artistry of Anatolian cuisine. Every dish is a journey
            through centuries of heritage.
          </Typography>
        </Box>

        {/* ── FILTER + SORT + SEARCH ROW ── */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexWrap="wrap"
          gap={2}
          sx={{ mb: 4 }}
        >
          {/* Collection chips */}
          <Stack direction="row" gap={1} flexWrap="wrap">
            {filterChips.map((chip) => (
              <Button
                key={chip.label}
                className={
                  productSearch.productCollection === chip.value
                    ? "filter-chip filter-chip--active"
                    : "filter-chip"
                }
                onClick={() => searchCollectionHandler(chip.value)}
              >
                {chip.label}
              </Button>
            ))}
          </Stack>

          {/* Sort + Search */}
          <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
            {/* Sort */}
            <Typography className="sort-label">Sort By:</Typography>
            <Select
              value={productSearch.order}
              onChange={(e) => searchOrderHandler(e.target.value)}
              size="small"
              className="sort-select"
            >
              <MenuItem value="productViews">Most Popular</MenuItem>
              <MenuItem value="productPrice">Price</MenuItem>
              <MenuItem value="createdAt">Newest</MenuItem>
            </Select>

            {/* ✅ Search input */}
            <Stack direction="row" className="product-search-wrap">
              <input
                type="search"
                className="product-search-input"
                placeholder="Search dishes..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") searchProductHandler();
                }}
              />
              <button
                className="product-search-btn"
                onClick={searchProductHandler}
              >
                <SearchIcon sx={{ fontSize: 18 }} />
              </button>
            </Stack>
          </Stack>
        </Stack>

        {/* ── PRODUCT GRID ── */}
        <div className="product-grid">
          {products.length !== 0 ? (
            products.map((product: Product) => {
              const imagePath = `${serverApi}/${product.productImages[0]}`;
              return (
                // ✅ Card click → ChosenProduct
                <Box
                  key={product._id}
                  className="product-card"
                  onClick={() => handleProductClick(product._id)}
                >
                  {/* Image wrap — hover button ichida */}
                  <Box className="product-card-img-wrap">
                    <img
                      src={imagePath}
                      alt={product.productName}
                      className="product-card-img"
                    />
                    {/* Collection badge */}
                    <Box className="product-card-collection">
                      {product.productCollection}
                    </Box>

                    {/* ✅ Hover overlay + basket button */}
                    <Box className="product-card-hover-overlay">
                      <Button
                        variant="contained"
                        className="product-card-basket-btn"
                        startIcon={
                          <ShoppingBagOutlinedIcon sx={{ fontSize: 16 }} />
                        }
                        onClick={(e) => handleAddToBasket(e, product)}
                      >
                        Add to Basket
                      </Button>
                    </Box>
                  </Box>

                  {/* Card body */}
                  <Box className="product-card-body">
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Typography className="product-card-name">
                        {product.productName}
                      </Typography>
                      <Typography className="product-card-price">
                        ₩{product.productPrice.toLocaleString()}
                      </Typography>
                    </Stack>

                    {product.productDesc && (
                      <Typography className="product-card-desc">
                        {product.productDesc.slice(0, 65)}...
                      </Typography>
                    )}

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mt: 1.5 }}
                    >
                      <Box className="product-card-rating">
                        ⭐ 4.8{" "}
                        <span className="product-card-reviews">
                          120 Reviews
                        </span>
                      </Box>
                      <Box className="product-card-views">
                        <RemoveRedEyeOutlinedIcon sx={{ fontSize: 14 }} />
                        <span>{product.productViews}</span>
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box className="no-products">No dishes found.</Box>
          )}
        </div>

        {/* ── PAGINATION ── */}
        <Stack alignItems="center" sx={{ mt: 5, mb: 3 }}>
          <Pagination
            count={
              products.length < productSearch.limit
                ? productSearch.page
                : productSearch.page + 1
            }
            page={productSearch.page}
            renderItem={(item) => (
              <PaginationItem
                components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
            onChange={paginationHandler}
            className="kervan-pagination"
          />
        </Stack>
      </Container>

      {/* ── BRANCHES SECTION ── */}
      <Box className="branches-section">
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography className="section-label-brown">
              Find Your Nearest
            </Typography>
            <Typography className="branches-title">
              Our Establishments
            </Typography>
            <Typography className="branches-sub">
              Find your nearest sanctuary of Turkish hospitality across Seoul's
              most iconic districts.
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", lg: "row" }} gap={3}>
            {/* Branch selector cards */}
            <Stack gap={2} sx={{ minWidth: 300, flex: "0 0 300px" }}>
              {branches.map((branch, i) => (
                <Box
                  key={branch.key}
                  className={`branch-card-sm ${selectedBranch === i ? "branch-card-sm--active" : ""}`}
                  onClick={() => setSelectedBranch(i)}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Typography className="branch-card-sm-name">
                      {branch.name}
                    </Typography>
                    <LocationOnOutlinedIcon
                      sx={{
                        fontSize: 18,
                        color: selectedBranch === i ? "#8d4b00" : "#dbc2b0",
                      }}
                    />
                  </Stack>
                  <Typography className="branch-card-sm-desc">
                    {branch.desc}
                  </Typography>
                  <Typography className="branch-card-sm-addr">
                    📍 {branch.address}
                  </Typography>
                </Box>
              ))}
            </Stack>

            {/* Map iframe */}
            <Box className="branch-map-wrap">
              <iframe
                title={`${branches[selectedBranch].name} Map`}
                src={branches[selectedBranch].mapSrc}
                width="100%"
                height="100%"
                style={{ border: "none" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <Box className="map-info-card">
                <Typography className="map-info-name">
                  {branches[selectedBranch].name} Branch
                </Typography>
                <Typography className="map-info-addr">
                  📍 {branches[selectedBranch].address}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  className="map-navigate-btn"
                  onClick={() =>
                    window.open(
                      `https://maps.google.com/?q=Kervan+${branches[selectedBranch].name}`,
                      "_blank",
                    )
                  }
                >
                  Navigate to Branch
                </Button>
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>
    </div>
  );
}
